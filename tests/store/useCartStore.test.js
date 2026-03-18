import { describe, it, expect, vi, beforeEach } from 'vitest'
import useCartStore from '../../src/store/useCartStore'

vi.mock('@/lib/firebase', () => ({
  db: {},
  auth: {},
}))

vi.mock('firebase/firestore', () => ({
  doc: () => ({}),
  setDoc: () => Promise.resolve(),
  getDoc: () => Promise.resolve({ exists: () => false }),
  serverTimestamp: () => ({}),
}))

const mockProduct = {
  id: 'p1',
  name: 'Test Product',
  price: 99.99,
  category: 'Living Room',
  image: '/test.jpg',
}

describe('useCartStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useCartStore.setState({
      items: [],
      wishlistItems: [],
      _uid: null,
    })
  })

  it('adds item to cart', () => {
    const { addToCart, getCartCount } = useCartStore.getState()
    addToCart(mockProduct, 2)
    expect(getCartCount()).toBe(2)
    expect(useCartStore.getState().items).toHaveLength(1)
    expect(useCartStore.getState().items[0].quantity).toBe(2)
  })

  it('increments quantity when adding same product with same color', () => {
    const { addToCart, getCartCount } = useCartStore.getState()
    addToCart(mockProduct, 1)
    addToCart(mockProduct, 2)
    expect(getCartCount()).toBe(3)
  })

  it('removes item from cart', () => {
    const { addToCart, removeFromCart, getCartCount } = useCartStore.getState()
    addToCart(mockProduct, 1)
    expect(getCartCount()).toBe(1)
    removeFromCart('p1')
    expect(getCartCount()).toBe(0)
  })

  it('getCartTotal returns correct sum', () => {
    const { addToCart, getCartTotal } = useCartStore.getState()
    addToCart(mockProduct, 2)
    expect(getCartTotal()).toBeCloseTo(199.98)
  })

  it('getShippingCost returns 0 when above threshold', () => {
    const { addToCart, getShippingCost } = useCartStore.getState()
    addToCart({ ...mockProduct, price: 100 }, 1)
    expect(getShippingCost()).toBe(0)
  })

  it('getShippingCost returns STANDARD_SHIPPING_COST when below threshold', () => {
    const { addToCart, getShippingCost } = useCartStore.getState()
    addToCart({ ...mockProduct, price: 10 }, 1)
    expect(getShippingCost()).toBe(9.99)
  })

  it('addToWishlist adds product', () => {
    const { addToWishlist, getWishlistCount } = useCartStore.getState()
    addToWishlist(mockProduct)
    expect(getWishlistCount()).toBe(1)
  })

  it('addToWishlist does not duplicate', () => {
    const { addToWishlist, getWishlistCount } = useCartStore.getState()
    addToWishlist(mockProduct)
    addToWishlist(mockProduct)
    expect(getWishlistCount()).toBe(1)
  })

  it('removeFromWishlist removes product', () => {
    const { addToWishlist, removeFromWishlist, getWishlistCount } = useCartStore.getState()
    addToWishlist(mockProduct)
    removeFromWishlist('p1')
    expect(getWishlistCount()).toBe(0)
  })

  it('clearCart empties cart', () => {
    const { addToCart, clearCart, getCartCount } = useCartStore.getState()
    addToCart(mockProduct, 1)
    clearCart()
    expect(getCartCount()).toBe(0)
  })
})
