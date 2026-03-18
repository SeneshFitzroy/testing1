import { create } from 'zustand'
import { SHOP_PRODUCTS, PRODUCTS_TO_EXCLUDE } from '@/lib/constants'
import { getProductsFromFirestore, saveProductToFirestore, deleteProductFromFirestore } from '@/lib/seedProducts'

const exclude = (list) => (list || []).filter(p => !PRODUCTS_TO_EXCLUDE.includes(p?.name || ''))

/**
 * Shared products store for Admin (CRUD) and Shop (read).
 * Loads from Firestore on init; falls back to SHOP_PRODUCTS if empty.
 * Excluded products (Arc Floor Lamp, Round Wall Mirror, Globe Pendant Light) are never shown.
 */
const useProductsStore = create((set, get) => ({
  products: [],
  loaded: false,

  loadProducts: async () => {
    try {
      const fromFirestore = await getProductsFromFirestore()
      if (fromFirestore && fromFirestore.length > 0) {
        set({ products: exclude(fromFirestore), loaded: true })
        return
      }
      set({ products: exclude([...SHOP_PRODUCTS]), loaded: true })
    } catch (err) {
      console.warn('[Products] Load failed, using constants:', err)
      set({ products: exclude([...SHOP_PRODUCTS]), loaded: true })
    }
  },

  setProducts: (products) => set({ products }),

  addProduct: async (product) => {
    if (PRODUCTS_TO_EXCLUDE.includes(product?.name || '')) return null
    const id = product.id?.startsWith('new-') ? `sp-${Date.now()}` : product.id
    const toSave = { ...product, id }
    const ok = await saveProductToFirestore(toSave)
    if (ok) {
      set((s) => ({ products: [...s.products.filter(p => p.id !== id), toSave] }))
      return toSave
    }
    return null
  },

  updateProduct: async (product) => {
    const ok = await saveProductToFirestore(product)
    if (ok) {
      set((s) => ({
        products: s.products.map(p => p.id === product.id ? product : p)
      }))
      return product
    }
    return null
  },

  deleteProduct: async (productId) => {
    const ok = await deleteProductFromFirestore(productId)
    if (ok) {
      set((s) => ({ products: s.products.filter(p => p.id !== productId) }))
      return true
    }
    return false
  },

  getProducts: () => get().products,
}))

export default useProductsStore
