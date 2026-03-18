import { describe, it, expect, beforeEach, vi } from 'vitest'
import useThemeStore from '../../src/store/useThemeStore'

const storageMock = (() => {
  let store = {}
  return {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => { store[key] = String(value) },
    removeItem: (key) => { delete store[key] },
    clear: () => { store = {} },
    get length() { return Object.keys(store).length },
    key: (i) => Object.keys(store)[i] ?? null,
  }
})()

describe('useThemeStore', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', storageMock)
    storageMock.clear()
    useThemeStore.setState({
      darkMode: false,
      language: 'en',
      currency: 'USD',
      country: '',
      hasSetRegion: false,
    })
  })

  it('has initial state', () => {
    const state = useThemeStore.getState()
    expect(state).toHaveProperty('darkMode')
    expect(state).toHaveProperty('language')
    expect(state).toHaveProperty('currency')
    expect(state).toHaveProperty('currencies')
    expect(state).toHaveProperty('countries')
    expect(state).toHaveProperty('formatPrice')
  })

  it('formatPrice returns formatted string for USD', () => {
    const { formatPrice } = useThemeStore.getState()
    const result = formatPrice(99.99)
    expect(typeof result).toBe('string')
    expect(result).toContain('99')
  })

  it('setLanguage updates language', () => {
    const { setLanguage } = useThemeStore.getState()
    setLanguage('ja')
    expect(useThemeStore.getState().language).toBe('ja')
    expect(localStorage.getItem('Lee Roo-language')).toBe('ja')
  })

  it('setCurrency updates currency', () => {
    const { setCurrency } = useThemeStore.getState()
    setCurrency('GBP')
    expect(useThemeStore.getState().currency).toBe('GBP')
    expect(localStorage.getItem('Lee Roo-currency')).toBe('GBP')
  })

  it('currencies has expected structure', () => {
    const { currencies } = useThemeStore.getState()
    expect(currencies.USD).toHaveProperty('code', 'USD')
    expect(currencies.USD).toHaveProperty('symbol')
    expect(currencies.USD).toHaveProperty('rate')
    expect(currencies.GBP).toBeDefined()
    expect(currencies.EUR).toBeDefined()
  })

  it('countries has entries with code and defaultCurrency', () => {
    const { countries } = useThemeStore.getState()
    expect(Array.isArray(countries)).toBe(true)
    expect(countries.length).toBeGreaterThan(0)
    countries.forEach((c) => {
      expect(c).toHaveProperty('code')
      expect(c).toHaveProperty('name')
      expect(c).toHaveProperty('defaultCurrency')
    })
  })
})
