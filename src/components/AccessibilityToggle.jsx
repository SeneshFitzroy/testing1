import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Accessibility, X, Eye, Type, Palette } from 'lucide-react'
import useThemeStore from '@/store/useThemeStore'

const COLOR_BLIND_MODES = [
  { value: 'none', label: 'Normal Vision' },
  { value: 'protanopia', label: 'Protanopia (Red)' },
  { value: 'deuteranopia', label: 'Deuteranopia (Green)' },
  { value: 'tritanopia', label: 'Tritanopia (Blue)' },
]

export default function AccessibilityToggle() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { a11y, setA11y } = useThemeStore()

  const handleOpen = () => {
    if (!isOpen) {
      setIsLoading(true)
      setIsOpen(true)
      setTimeout(() => setIsLoading(false), 400)
    } else {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('a11y-high-contrast', a11y.highContrast)
    root.classList.toggle('a11y-large-text', a11y.largeText)

    root.classList.remove('a11y-protanopia', 'a11y-deuteranopia', 'a11y-tritanopia')
    if (a11y.colorBlindMode !== 'none') {
      root.classList.add(`a11y-${a11y.colorBlindMode}`)
    }
  }, [a11y])

  const anyActive = a11y.highContrast || a11y.largeText || a11y.colorBlindMode !== 'none'

  return (
    <>
      {/* Floating trigger */}
      <motion.button
        onClick={handleOpen}
        className={`fixed bottom-6 left-6 z-40 w-11 h-11 rounded-full backdrop-blur-xl border shadow-lg flex items-center justify-center transition-all hover:scale-110 ${
          anyActive
            ? 'bg-forest/90 border-forest-light/60 text-white'
            : 'bg-white/90 dark:bg-dark-card/90 border-warm-200/60 dark:border-dark-border/60 text-darkwood/60 dark:text-warm-400 hover:text-forest dark:hover:text-forest-light'
        }`}
        aria-label="Accessibility settings"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.2, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Accessibility className="h-5 w-5" />
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[90]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="fixed bottom-20 left-6 z-[91] w-80 bg-white dark:bg-dark-card rounded-2xl shadow-2xl border border-warm-200/60 dark:border-dark-border/60 overflow-hidden"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* Header - Rosewood-style loading state */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-warm-100 dark:border-dark-border">
                {isLoading ? (
                  <div className="flex items-center gap-2.5 text-darkwood/60 dark:text-warm-400">
                    <div className="w-5 h-5 border-2 border-forest/40 border-t-forest rounded-full animate-spin" />
                    <span className="text-sm font-medium">Loading Accessibility Mode...</span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-forest/10 dark:bg-forest/20 rounded-lg flex items-center justify-center">
                        <Accessibility className="h-4 w-4 text-forest dark:text-forest-light" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-darkwood dark:text-warm-100">Accessibility</h3>
                        <p className="text-[10px] text-darkwood/40 dark:text-warm-500">Customize your experience</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-1.5 rounded-lg hover:bg-warm-100 dark:hover:bg-dark-surface text-darkwood/40 dark:text-warm-500 transition-colors"
                      aria-label="Close accessibility panel"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Options */}
              <div className="p-4 space-y-3">
                {/* High Contrast */}
                <button
                  onClick={() => setA11y('highContrast', !a11y.highContrast)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                    a11y.highContrast
                      ? 'bg-forest/10 dark:bg-forest/20 border-forest/30 dark:border-forest/40'
                      : 'bg-warm-50 dark:bg-dark-surface border-warm-100 dark:border-dark-border hover:border-forest/30'
                  }`}
                  aria-pressed={a11y.highContrast}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    a11y.highContrast ? 'bg-forest text-white' : 'bg-warm-100 dark:bg-dark-border text-darkwood/40 dark:text-warm-500'
                  }`}>
                    <Eye className="h-4 w-4" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-medium text-darkwood dark:text-warm-100">High Contrast</p>
                    <p className="text-[10px] text-darkwood/40 dark:text-warm-500">Enhanced visibility</p>
                  </div>
                  <div className={`w-10 h-6 rounded-full transition-colors ${
                    a11y.highContrast ? 'bg-forest' : 'bg-warm-200 dark:bg-dark-border'
                  }`}>
                    <motion.div
                      className="w-5 h-5 bg-white rounded-full shadow-sm mt-0.5"
                      animate={{ x: a11y.highContrast ? 18 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </div>
                </button>

                {/* Large Text */}
                <button
                  onClick={() => setA11y('largeText', !a11y.largeText)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                    a11y.largeText
                      ? 'bg-forest/10 dark:bg-forest/20 border-forest/30 dark:border-forest/40'
                      : 'bg-warm-50 dark:bg-dark-surface border-warm-100 dark:border-dark-border hover:border-forest/30'
                  }`}
                  aria-pressed={a11y.largeText}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    a11y.largeText ? 'bg-forest text-white' : 'bg-warm-100 dark:bg-dark-border text-darkwood/40 dark:text-warm-500'
                  }`}>
                    <Type className="h-4 w-4" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-medium text-darkwood dark:text-warm-100">Large Text</p>
                    <p className="text-[10px] text-darkwood/40 dark:text-warm-500">Bigger readable fonts</p>
                  </div>
                  <div className={`w-10 h-6 rounded-full transition-colors ${
                    a11y.largeText ? 'bg-forest' : 'bg-warm-200 dark:bg-dark-border'
                  }`}>
                    <motion.div
                      className="w-5 h-5 bg-white rounded-full shadow-sm mt-0.5"
                      animate={{ x: a11y.largeText ? 18 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </div>
                </button>

                {/* Color Blindness Filter */}
                <div className="px-4 py-3 rounded-xl border bg-warm-50 dark:bg-dark-surface border-warm-100 dark:border-dark-border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-warm-100 dark:bg-dark-border text-darkwood/40 dark:text-warm-500">
                      <Palette className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-darkwood dark:text-warm-100">Color Vision</p>
                      <p className="text-[10px] text-darkwood/40 dark:text-warm-500">Adjust for color blindness</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {COLOR_BLIND_MODES.map(mode => (
                      <button
                        key={mode.value}
                        onClick={() => setA11y('colorBlindMode', mode.value)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          a11y.colorBlindMode === mode.value
                            ? 'bg-forest text-white'
                            : 'bg-white dark:bg-dark-card text-darkwood/60 dark:text-warm-400 hover:bg-warm-100 dark:hover:bg-dark-border'
                        }`}
                        aria-pressed={a11y.colorBlindMode === mode.value}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reset */}
              {anyActive && (
                <div className="px-4 pb-4">
                  <button
                    onClick={() => {
                      setA11y('highContrast', false)
                      setA11y('largeText', false)
                      setA11y('colorBlindMode', 'none')
                    }}
                    className="w-full py-2.5 rounded-xl text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  >
                    Reset All to Default
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
