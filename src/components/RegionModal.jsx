import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, DollarSign, Globe } from 'lucide-react'
import useThemeStore from '@/store/useThemeStore'
import { useTranslation } from 'react-i18next'
import { LANGUAGE_OPTIONS } from '@/i18n'

export default function RegionModal() {
  const { t, i18n } = useTranslation()
  const { hasSetRegion, countries, currencies, setRegionPreferences, language, setLanguage } = useThemeStore()
  const [isOpen, setIsOpen] = useState(!hasSetRegion)
  const [selectedCountry, setSelectedCountry] = useState('LK')
  const [selectedCurrency, setSelectedCurrency] = useState('LKR')
  const [selectedLanguage, setSelectedLanguage] = useState(language)

  const handleCountryChange = (code) => {
    setSelectedCountry(code)
    const country = countries.find(c => c.code === code)
    if (country) {
      setSelectedCurrency(country.defaultCurrency)
    }
  }

  const handleConfirm = () => {
    setLanguage(selectedLanguage)
    i18n.changeLanguage(selectedLanguage)
    setRegionPreferences(selectedCountry, selectedCurrency)
    setIsOpen(false)
  }

  const handleSkip = () => {
    setRegionPreferences('LK', 'LKR')
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-md bg-white dark:bg-dark-card rounded-2xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.1 }}
        >
          {/* Close button */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-warm-100 dark:hover:bg-dark-surface text-darkwood/40 dark:text-warm-500 transition-colors z-10"
            aria-label="Close and use default settings"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Content */}
          <div className="p-8">
            {/* Icon */}
            <div className="w-14 h-14 bg-gradient-to-br from-clay to-clay-dark rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-clay/20">
              <MapPin className="h-7 w-7 text-white" />
            </div>

            <h2 className="text-2xl font-bold text-center text-darkwood dark:text-warm-100 font-display mb-2">
              Welcome to Lee Roo
            </h2>
            <p className="text-sm text-center text-darkwood/60 dark:text-warm-400 mb-6 max-w-xs mx-auto">
              Choose your language, country, and currency for the best experience.
            </p>

            {/* Language Dropdown */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-darkwood/60 dark:text-warm-400 uppercase tracking-wider mb-2">
                Language
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-darkwood/30 dark:text-warm-500" />
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-warm-200 dark:border-dark-border bg-warm-50 dark:bg-dark-surface text-darkwood dark:text-warm-100 text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:border-clay focus:ring-2 focus:ring-clay/20 transition-colors"
                  aria-label="Select language"
                >
                  {LANGUAGE_OPTIONS.map(l => (
                    <option key={l.code} value={l.code}>{l.name}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="h-4 w-4 text-darkwood/30 dark:text-warm-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Country Dropdown */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-darkwood/60 dark:text-warm-400 uppercase tracking-wider mb-2">
                Shipping Country
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-darkwood/30 dark:text-warm-500" />
                <select
                  value={selectedCountry}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-warm-200 dark:border-dark-border bg-warm-50 dark:bg-dark-surface text-darkwood dark:text-warm-100 text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:border-clay focus:ring-2 focus:ring-clay/20 transition-colors"
                  aria-label="Select shipping country"
                >
                  {countries.map(c => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="h-4 w-4 text-darkwood/30 dark:text-warm-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Currency Dropdown */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-darkwood/60 dark:text-warm-400 uppercase tracking-wider mb-2">
                Preferred Currency
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-darkwood/30 dark:text-warm-500" />
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-warm-200 dark:border-dark-border bg-warm-50 dark:bg-dark-surface text-darkwood dark:text-warm-100 text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:border-clay focus:ring-2 focus:ring-clay/20 transition-colors"
                  aria-label="Select preferred currency"
                >
                  {Object.values(currencies).map(c => (
                    <option key={c.code} value={c.code}>{c.symbol} {c.code} - {c.name}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="h-4 w-4 text-darkwood/30 dark:text-warm-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleConfirm}
              className="w-full py-4 bg-darkwood dark:bg-warm-100 text-white dark:text-darkwood font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-darkwood/90 dark:hover:bg-warm-200 transition-colors shadow-lg"
            >
              CONFIRM
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
