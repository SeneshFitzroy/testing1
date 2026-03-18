import { describe, it, expect } from 'vitest'
import {
  ROOM_TEMPLATES,
  FURNITURE_ITEMS,
  FURNITURE_CATEGORIES,
  FREE_SHIPPING_THRESHOLD,
  FREE_SHIPPING_DISPLAY,
  STANDARD_SHIPPING_COST,
  WARRANTY_YEARS,
  RETURNS_DAYS,
  SHOP_PRODUCTS,
} from '../../src/lib/constants'

describe('ROOM_TEMPLATES', () => {
  it('has required fields', () => {
    ROOM_TEMPLATES.forEach((room) => {
      expect(room).toHaveProperty('id')
      expect(room).toHaveProperty('name')
      expect(room).toHaveProperty('width')
      expect(room).toHaveProperty('depth')
      expect(room).toHaveProperty('height')
      expect(room).toHaveProperty('shape')
      expect(room).toHaveProperty('wallColor')
      expect(room).toHaveProperty('floorColor')
    })
  })

  it('has valid dimensions', () => {
    ROOM_TEMPLATES.forEach((room) => {
      expect(room.width).toBeGreaterThan(0)
      expect(room.depth).toBeGreaterThan(0)
      expect(room.height).toBeGreaterThan(0)
    })
  })
})

describe('FURNITURE_ITEMS', () => {
  it('has required fields', () => {
    FURNITURE_ITEMS.forEach((item) => {
      expect(item).toHaveProperty('id')
      expect(item).toHaveProperty('name')
      expect(item).toHaveProperty('category')
      expect(item).toHaveProperty('width')
      expect(item).toHaveProperty('depth')
      expect(item).toHaveProperty('height')
      expect(item).toHaveProperty('color')
    })
  })
})

describe('FURNITURE_CATEGORIES', () => {
  it('contains all category', () => {
    const all = FURNITURE_CATEGORIES.find((c) => c.id === 'all')
    expect(all).toBeDefined()
  })
})

describe('Policy constants', () => {
  it('FREE_SHIPPING_THRESHOLD is a number', () => {
    expect(typeof FREE_SHIPPING_THRESHOLD).toBe('number')
  })

  it('FREE_SHIPPING_DISPLAY is Rs 14,950.00', () => {
    expect(FREE_SHIPPING_DISPLAY).toBe('Rs 14,950.00')
  })

  it('STANDARD_SHIPPING_COST is positive', () => {
    expect(STANDARD_SHIPPING_COST).toBeGreaterThan(0)
  })

  it('WARRANTY_YEARS is positive', () => {
    expect(WARRANTY_YEARS).toBeGreaterThan(0)
  })

  it('RETURNS_DAYS is positive', () => {
    expect(RETURNS_DAYS).toBeGreaterThan(0)
  })
})

describe('SHOP_PRODUCTS', () => {
  it('has products with required fields', () => {
    expect(SHOP_PRODUCTS.length).toBeGreaterThan(0)
    SHOP_PRODUCTS.forEach((p) => {
      expect(p).toHaveProperty('id')
      expect(p).toHaveProperty('name')
      expect(p).toHaveProperty('price')
      expect(p).toHaveProperty('category')
    })
  })
})
