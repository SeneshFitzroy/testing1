import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { hasCookieConsentResponse } from './CookieConsent'

const STORAGE_KEY = 'Lee Roo-justInTimeDismissed'

export default function JustInTimePopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY)
    const hasResponded = hasCookieConsentResponse()
    if (!dismissed && hasResponded) {
      const t = setTimeout(() => setIsOpen(true), 2500)
      return () => clearTimeout(t)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem(STORAGE_KEY, 'true')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email && /\S+@\S+\.\S+/.test(email)) {
      setSubmitted(true)
      setEmail('')
      setTimeout(handleClose, 2000)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[199] flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={handleClose}
        />
        <motion.div
          className="relative w-full max-w-md bg-white dark:bg-dark-card rounded-2xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-warm-100 dark:hover:bg-dark-surface text-darkwood/50 transition-colors z-10"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="p-8 pt-10">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-darkwood dark:text-white font-display">
                Just in Time
              </h2>
              <p className="text-darkwood/70 dark:text-white mt-2 text-sm">
                Sale is on. Be first to know about sales, new arrivals, and exclusive offers.
              </p>
            </div>

            {submitted ? (
              <p className="text-center text-forest font-medium py-4">
                Thanks for joining! Check your inbox for updates.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full px-4 py-3 rounded-xl border border-warm-200 dark:border-dark-border bg-warm-50 dark:bg-dark-surface text-darkwood dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-clay/30 focus:border-clay"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#5C3A2A] hover:bg-[#4A2F21] text-white font-semibold rounded-xl transition-colors"
                >
                  Join the List
                </button>
              </form>
            )}

            <p className="text-[10px] text-darkwood/50 dark:text-white mt-4 text-center">
              By joining, you agree to receive promotional messages. No purchase necessary. Reply HELP for help, STOP to unsubscribe. <Link to="/settings" className="underline hover:text-clay">View Terms & Privacy</Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
