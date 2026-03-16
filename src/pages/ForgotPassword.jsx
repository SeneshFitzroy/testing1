import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Loader2, ArrowLeft, CheckCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { LogoIcon } from '@/components/Logo'

export default function ForgotPassword() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) {
      toast.error(t('auth.forgotPasswordError'), {
        description: t('auth.validation.emailRequired'),
      })
      return
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error(t('auth.forgotPasswordError'), {
        description: t('auth.validation.emailInvalid'),
      })
      return
    }
    setLoading(true)
    try {
      await sendPasswordResetEmail(auth, email.trim())
      setSent(true)
      toast.success(t('auth.forgotPasswordSuccess'), {
        description: t('auth.forgotPasswordCheckEmail'),
      })
    } catch (err) {
      console.error('[ForgotPassword]', err)
      const code = err?.code || ''
      let message = t('auth.forgotPasswordFailed')
      if (code === 'auth/user-not-found') {
        message = t('auth.forgotPasswordUserNotFound')
      } else if (code === 'auth/invalid-email') {
        message = t('auth.validation.emailInvalid')
      } else if (code === 'auth/too-many-requests') {
        message = t('auth.forgotPasswordTooMany')
      }
      toast.error(t('auth.forgotPasswordError'), { description: message, duration: 5000 })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div id="main-content" className="min-h-screen bg-warm-50 dark:bg-dark-bg flex flex-col items-center justify-center px-4 py-10" role="main">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link to="/" className="inline-flex items-center gap-2 mb-8 text-darkwood/60 dark:text-white hover:text-clay dark:hover:text-clay transition-colors">
          <LogoIcon size={32} />
          <span className="font-display font-bold text-darkwood dark:text-white">Lee Roo</span>
        </Link>

        <div className="bg-white dark:bg-dark-card rounded-2xl border border-warm-200 dark:border-dark-border shadow-xl p-8">
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-2xl font-bold text-darkwood dark:text-white mb-2 font-display">
                {t('auth.forgotPasswordCheckInbox')}
              </h1>
              <p className="text-darkwood/60 dark:text-white mb-6">
                {t('auth.forgotPasswordCheckEmail')}
              </p>
              <p className="text-sm text-darkwood/50 dark:text-white mb-6">
                {t('auth.forgotPasswordSpamNote')}
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-clay hover:text-clay-dark font-semibold"
              >
                <ArrowLeft className="h-4 w-4" />
                {t('auth.backToLogin')}
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-darkwood dark:text-white mb-2 font-display">
                {t('auth.forgotPasswordTitle')}
              </h1>
              <p className="text-darkwood/60 dark:text-white mb-8">
                {t('auth.forgotPasswordDesc')}
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-darkwood dark:text-white mb-2">
                    {t('auth.email')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-warm-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('auth.email.placeholder')}
                      autoComplete="email"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-warm-200 dark:border-dark-border bg-white dark:bg-dark-surface text-darkwood dark:text-white placeholder:text-warm-400 focus:ring-2 focus:ring-clay/40 focus:border-clay transition-all"
                      disabled={loading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-clay hover:bg-clay-dark text-white font-semibold transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      {t('auth.forgotPasswordSending')}
                    </>
                  ) : (
                    t('auth.forgotPasswordSend')
                  )}
                </button>
              </form>

              <Link
                to="/login"
                className="mt-6 flex items-center justify-center gap-2 text-darkwood/60 dark:text-white hover:text-clay dark:hover:text-clay transition-colors text-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                {t('auth.backToLogin')}
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
