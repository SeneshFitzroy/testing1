import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

/* Helper – save cart/wishlist to Firestore for logged-in users */
const syncToFirestore = async (uid, items, wishlistItems) => {
  if (!uid) return
  try {
    await setDoc(doc(db, 'carts', uid), {
      items: items.map(({ id, name, price, quantity, selectedColor, category, image }) => ({ id, name, price, quantity, selectedColor, category, image })),
      wishlistItems: wishlistItems.map(({ id, name, price, category, image, addedAt }) => ({ id, name, price, category, image, addedAt })),
      updatedAt: serverTimestamp(),
    }, { merge: true })
  } catch (e) { console.warn('Cart sync failed:', e) }
}

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      wishlistItems: [],
      isOpen: false,
      _uid: null, // track logged-in user for Firestore sync

      setUid: (uid) => set({ _uid: uid }),

      /** Load cart from Firestore when user logs in */
      loadFromFirestore: async (uid) => {
        if (!uid) return
        try {
          const snap = await getDoc(doc(db, 'carts', uid))
          if (snap.exists()) {
            const data = snap.data()
            set({
              items: data.items || [],
              wishlistItems: data.wishlistItems || [],
              _uid: uid,
            })
          } else {
            set({ _uid: uid })
            // If local cart has items, push them to Firestore
            const { items, wishlistItems } = get()
            if (items.length || wishlistItems.length) syncToFirestore(uid, items, wishlistItems)
          }
        } catch (e) { console.warn('Cart load failed:', e); set({ _uid: uid }) }
      },

      // Cart actions
      addToCart: (product, quantity = 1, selectedColor = null) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.id === product.id && item.selectedColor === selectedColor
          )

          let newItems
          if (existingItem) {
            newItems = state.items.map((item) =>
              item.id === product.id && item.selectedColor === selectedColor
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          } else {
            newItems = [...state.items, {
              ...product,
              quantity,
              selectedColor: selectedColor || product.colors?.[0] || '#8B6F47',
              addedAt: new Date().toISOString()
            }]
          }
          syncToFirestore(state._uid, newItems, state.wishlistItems)
          return { items: newItems }
        })
      },

      removeFromCart: (productId, selectedColor = null) =>
        set((state) => {
          const newItems = state.items.filter(
            (item) => !(item.id === productId && (selectedColor === null || item.selectedColor === selectedColor))
          )
          syncToFirestore(state._uid, newItems, state.wishlistItems)
          return { items: newItems }
        }),

      updateQuantity: (productId, quantityOrColor, maybeQuantity) => {
        let selectedColor = null
        let quantity = quantityOrColor
        if (maybeQuantity !== undefined) {
          selectedColor = quantityOrColor
          quantity = maybeQuantity
        }
        if (quantity <= 0) { get().removeFromCart(productId, selectedColor); return }
        set((state) => {
          const newItems = state.items.map((item) =>
            item.id === productId && (selectedColor === null || item.selectedColor === selectedColor)
              ? { ...item, quantity }
              : item
          )
          syncToFirestore(state._uid, newItems, state.wishlistItems)
          return { items: newItems }
        })
      },

      clearCart: () => set((state) => {
        syncToFirestore(state._uid, [], state.wishlistItems)
        return { items: [] }
      }),
      clearWishlist: () => set((state) => {
        syncToFirestore(state._uid, state.items, [])
        return { wishlistItems: [] }
      }),

      // Wishlist actions
      addToWishlist: (product) =>
        set((state) => {
          if (state.wishlistItems.some((item) => item.id === product.id)) return state
          const newWishlist = [...state.wishlistItems, { ...product, addedAt: new Date().toISOString() }]
          syncToFirestore(state._uid, state.items, newWishlist)
          return { wishlistItems: newWishlist }
        }),

      removeFromWishlist: (productId) =>
        set((state) => {
          const newWishlist = state.wishlistItems.filter((item) => item.id !== productId)
          syncToFirestore(state._uid, state.items, newWishlist)
          return { wishlistItems: newWishlist }
        }),

      moveToCart: (productId) => {
        const wishlistItem = get().wishlistItems.find((item) => item.id === productId)
        if (wishlistItem) {
          get().addToCart(wishlistItem, 1)
          get().removeFromWishlist(productId)
        }
      },

      isInWishlist: (productId) =>
        get().wishlistItems.some((item) => item.id === productId),

      // Cart UI
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      // Computed values
      getCartCount: () => get().items.reduce((total, item) => total + item.quantity, 0),
      getWishlistCount: () => get().wishlistItems.length,

      getCartTotal: () =>
        get().items.reduce((total, item) => total + (item.price * item.quantity), 0),

      getShippingCost: () => {
        const total = get().getCartTotal()
        return total > 500 ? 0 : 25
      },

      getFinalTotal: () => get().getCartTotal() + get().getShippingCost(),
    }),
    {
      name: 'Lee Roo-cart',
      partialize: (state) => ({ items: state.items, wishlistItems: state.wishlistItems }),
    }
  )
)

export default useCartStore
