import { create } from 'zustand'

const CURRENCIES = {
  USD: { code: 'USD', symbol: '$',  name: 'US Dollar',        rate: 1 },
  EUR: { code: 'EUR', symbol: '\u20AC', name: 'Euro',         rate: 0.92 },
  GBP: { code: 'GBP', symbol: '\u00A3', name: 'British Pound', rate: 0.79 },
  LKR: { code: 'LKR', symbol: 'Rs', name: 'Sri Lankan Rupee', rate: 325 },
  JPY: { code: 'JPY', symbol: '\u00A5', name: 'Japanese Yen', rate: 149 },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 1.53 },
  INR: { code: 'INR', symbol: '\u20B9', name: 'Indian Rupee', rate: 83 },
  CNY: { code: 'CNY', symbol: '\u00A5', name: 'Chinese Yuan',  rate: 7.24 },
}

const COUNTRIES = [
  { code: 'LK', name: 'Sri Lanka',      defaultCurrency: 'LKR' },
  { code: 'US', name: 'United States',   defaultCurrency: 'USD' },
  { code: 'GB', name: 'United Kingdom',  defaultCurrency: 'GBP' },
  { code: 'AU', name: 'Australia',       defaultCurrency: 'AUD' },
  { code: 'JP', name: 'Japan',           defaultCurrency: 'JPY' },
  { code: 'IN', name: 'India',           defaultCurrency: 'INR' },
  { code: 'DE', name: 'Germany',         defaultCurrency: 'EUR' },
  { code: 'FR', name: 'France',          defaultCurrency: 'EUR' },
  { code: 'CN', name: 'China',           defaultCurrency: 'CNY' },
]

const useThemeStore = create((set, get) => ({
  darkMode: localStorage.getItem('Lee Roo-darkMode') === 'true',
  language: localStorage.getItem('Lee Roo-language') || 'en',
  currency: localStorage.getItem('Lee Roo-currency') || 'USD',
  country: localStorage.getItem('Lee Roo-country') || '',
  currencies: CURRENCIES,
  countries: COUNTRIES,

  hasSetRegion: localStorage.getItem('Lee Roo-hasSetRegion') === 'true',

  // Accessibility state
  a11y: {
    highContrast: localStorage.getItem('Lee Roo-a11y-highContrast') === 'true',
    largeText: localStorage.getItem('Lee Roo-a11y-largeText') === 'true',
    colorBlindMode: localStorage.getItem('Lee Roo-a11y-colorBlind') || 'none',
  },

  // Audio state - default unmuted so music plays when file exists
  audioMuted: localStorage.getItem('Lee Roo-audioMuted') === 'true',
  audioUnlocked: false,
  setAudioUnlocked: () => set({ audioUnlocked: true }),

  toggleDarkMode: () =>
    set((state) => {
      const next = !state.darkMode
      localStorage.setItem('Lee Roo-darkMode', String(next))
      if (next) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      return { darkMode: next }
    }),

  setLanguage: (lang) => {
    localStorage.setItem('Lee Roo-language', lang)
    set({ language: lang })
  },

  setCurrency: (code) => {
    localStorage.setItem('Lee Roo-currency', code)
    set({ currency: code })
  },

  setCountry: (code) => {
    localStorage.setItem('Lee Roo-country', code)
    const country = COUNTRIES.find(c => c.code === code)
    if (country) {
      localStorage.setItem('Lee Roo-currency', country.defaultCurrency)
      set({ country: code, currency: country.defaultCurrency })
    } else {
      set({ country: code })
    }
  },

  setRegionPreferences: (countryCode, currencyCode) => {
    localStorage.setItem('Lee Roo-country', countryCode)
    localStorage.setItem('Lee Roo-currency', currencyCode)
    localStorage.setItem('Lee Roo-hasSetRegion', 'true')
    set({ country: countryCode, currency: currencyCode, hasSetRegion: true })
  },

  formatPrice: (usdPrice) => {
    const { currency, currencies } = get()
    const cur = currencies[currency] || currencies.USD
    const converted = usdPrice * cur.rate
    if (cur.code === 'JPY') return `${cur.symbol}${Math.round(converted).toLocaleString()}`
    return `${cur.symbol}${converted.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
  },

  setA11y: (key, value) => {
    const prefix = 'Lee Roo-a11y-'
    const storageKey = key === 'colorBlindMode' ? `${prefix}colorBlind` : `${prefix}${key}`
    localStorage.setItem(storageKey, String(value))
    set((state) => ({
      a11y: { ...state.a11y, [key]: value }
    }))
  },

  setAudioMuted: (muted) => {
    localStorage.setItem('Lee Roo-audioMuted', String(muted))
    set({ audioMuted: muted })
  },

  initTheme: () => {
    const dark = localStorage.getItem('Lee Roo-darkMode') === 'true'
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  },
}))

export default useThemeStore
