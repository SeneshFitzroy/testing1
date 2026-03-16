import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, MapPin, Shield } from 'lucide-react'
import useThemeStore from '@/store/useThemeStore'
import { reverseGeocode } from '@/lib/geolocation'

const STORAGE_KEY = 'Lee Roo-cookieConsent'

/** Check if user has already responded to cookie consent */
export function hasCookieConsentResponse() {
  const v = localStorage.getItem(STORAGE_KEY)
  return v === 'accepted' || v === 'declined'
}

/** Check if user accepted cookies (for analytics/preferences) */
export function hasAcceptedCookies() {
  return localStorage.getItem(STORAGE_KEY) === 'accepted'
}

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(!hasCookieConsentResponse())
  const [loading, setLoading] = useState(false)
  const setRegionPreferences = useThemeStore((s) => s.setRegionPreferences)

  const requestGeolocationAndSetRegion = useCallback(async () => {
    if (!navigator.geolocation) return
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const code = await reverseGeocode(pos.coords.latitude, pos.coords.longitude)
          if (code) {
            const countries = useThemeStore.getState().countries
            const country = countries.find((c) => c.code === code)
            if (country) {
              setRegionPreferences(country.code, country.defaultCurrency)
            }
          }
        } catch {
          /* ignore */
        } finally {
          setLoading(false)
        }
      },
      () => setLoading(false),
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 86400000 }
    )
  }, [setRegionPreferences])

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setIsVisible(false)
    requestGeolocationAndSetRegion()
  }

  const handleDecline = () => {
    localStorage.setItem(STORAGE_KEY, 'declined')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-[210] px-4 pb-4 pt-2 safe-area-pb"
        initial={{ y: 120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 120, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="max-w-2xl mx-auto rounded-2xl shadow-2xl border border-warm-200 dark:border-dark-border bg-white dark:bg-dark-card p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="flex gap-3 flex-1">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-clay/10 dark:bg-clay/20 flex items-center justify-center">
                <Cookie className="h-5 w-5 text-clay" />
              </div>
              <div>
                <h3 className="font-bold text-darkwood dark:text-warm-100 text-sm sm:text-base mb-1">
                  Cookie & Location
                </h3>
                <p className="text-xs sm:text-sm text-darkwood/70 dark:text-warm-400">
                  We use cookies for preferences and personalization. Accept to allow optional location detection so
                  we can suggest your region, currency, and language automatically.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleDecline}
                className="px-4 py-2.5 rounded-xl text-sm font-medium border border-warm-200 dark:border-dark-border text-darkwood dark:text-warm-300 hover:bg-warm-50 dark:hover:bg-dark-surface transition-colors"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl text-sm font-medium bg-clay text-white hover:bg-clay-dark disabled:opacity-70 transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                    Detecting...
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4" />
                    Accept
                  </>
                )}
              </button>
            </div>
          </div>
          <p className="mt-3 text-[10px] text-darkwood/50 dark:text-warm-500 flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 flex-shrink-0" />
            Your data stays local. No tracking without consent. Location is optional and used only to customize your experience.
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
