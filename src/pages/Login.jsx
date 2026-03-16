import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, Loader2, AlertCircle, Palette, ArrowRight, Home } from 'lucide-react'
import { LogoIcon } from '@/components/Logo'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import useAuthStore from '@/store/useAuthStore'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()

  const { user, login, loginWithGoogle, loading, error, clearError } = useAuthStore()

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})

  useEffect(() => {
    clearError()
    setValidationErrors({})
  }, [formData, clearError])

  // Redirect when user lands after Google sign-in redirect
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/shop'
      navigate(from, { replace: true })
    }
  }, [user, navigate, location.state])

  const validateForm = () => {
    const errors = {}
    if (!formData.email) {
      errors.email = t('auth.validation.emailRequired')
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = t('auth.validation.emailInvalid')
    }
    if (!formData.password) {
      errors.password = t('auth.validation.passwordRequired')
    } else if (formData.password.length < 6) {
      errors.password = t('auth.validation.passwordMin')
    }
    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }
    try {
      await login(formData.email, formData.password)
      toast.success(t('auth.welcomeBack'), {
        description: t('auth.signInSuccess'),
      })
      const from = location.state?.from?.pathname || '/shop'
      navigate(from, { replace: true })
    } catch (err) {
      const message = err?.friendlyMessage || t('auth.signInError')
      toast.error(t('auth.signInFailed'), { description: message, duration: 5000 })
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const result = await loginWithGoogle()
      if (!result) return
      toast.success(t('auth.welcomeBack'), { description: t('auth.signInSuccess'), duration: 1800 })
      const from = location.state?.from?.pathname || '/shop'
      navigate(from, { replace: true })
    } catch (err) {
      const message = err?.friendlyMessage || t('auth.googleError')
      toast.error(t('auth.googleFailed'), { description: message, duration: 5000 })
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div id="main-content" className="min-h-screen flex bg-warm-50 dark:bg-dark-bg">
      {/* Back to Home — visible on mobile and desktop */}
      <Link
        to="/"
        className="absolute top-4 left-4 z-20 flex items-center gap-2 text-darkwood/70 dark:text-warm-400 hover:text-clay dark:hover:text-clay transition-colors text-sm font-medium"
        aria-label="Back to homepage"
      >
        <LogoIcon size={24} />
        <span className="hidden sm:inline">Back to Home</span>
      </Link>
      {/* Left Panel — Decorative Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-darkwood via-[#2e1c12] to-[#1a120b]" />

        {/* Ambient orbs */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(182,110,65,0.12) 0%, transparent 70%)', top: '10%', right: '-10%' }}
            animate={{ scale: [1, 1.15, 1], x: [0, 20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(63,94,69,0.1) 0%, transparent 70%)', bottom: '10%', left: '-5%' }}
            animate={{ scale: [1, 1.2, 1], y: [0, -15, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-forest to-forest-light rounded-2xl flex items-center justify-center shadow-lg">
                <Palette className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-white font-display block">Lee Roo</span>
                <span className="text-xs text-warm-400">{String.fromCharCode(0x0DBD, 0x0DD3)} {String.fromCharCode(0x0DBB, 0x0DD6)} &middot; Wood Designs</span>
              </div>
            </div>

            <h1 className="text-4xl xl:text-5xl font-bold text-white font-display leading-tight mb-6">
              Find your perfect<br />
              <span className="bg-gradient-to-r from-clay to-clay-dark bg-clip-text text-transparent">furniture</span>
            </h1>

            <p className="text-warm-400 text-base leading-relaxed max-w-md mb-10">
              Browse our handcrafted furniture collection, add to cart, and enjoy fast delivery. Preview pieces in 2D/3D.
            </p>

            {/* Feature highlights — 90% furniture, 10% 2D/3D */}
            <div className="space-y-4">
              {[
                'Browse & shop premium furniture',
                'Secure checkout & fast delivery',
                '2D/3D preview · Multi-language & currency',
              ].map((feature, i) => (
                <motion.div
                  key={feature}
                  className="flex items-center gap-3 text-warm-300 text-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <div className="w-6 h-6 bg-forest/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <ArrowRight className="h-3 w-3 text-forest-light" />
                  </div>
                  {feature}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div id="main-content" className="w-full lg:w-1/2 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" role="main">
        <motion.div
          className="max-w-md w-full space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center">
            <motion.div
              className="w-16 h-16 bg-gradient-to-br from-clay to-clay-dark rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-clay/25"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <Lock className="h-8 w-8 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-darkwood dark:text-warm-100 font-display">
              {t('auth.signIn')}
            </h2>
            <p className="mt-2 text-darkwood/50 dark:text-warm-400">
              {t('auth.signIn.subtitle')}
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <motion.div
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start space-x-3"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              role="alert"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-red-800 dark:text-red-300 leading-relaxed">{error}</p>
              </div>
              <button
                onClick={clearError}
                className="flex-shrink-0 text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30"
                aria-label="Dismiss error"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          )}

          {/* Login Form */}
          <motion.form
            className="space-y-5"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            noValidate
          >
            {/* Email */}
            <div>
              <label htmlFor="email" className="label">{t('auth.email')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-warm-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`input-field pl-10 ${validationErrors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder={t('auth.email.placeholder')}
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  aria-invalid={!!validationErrors.email}
                  aria-describedby={validationErrors.email ? 'email-error' : undefined}
                />
              </div>
              {validationErrors.email && (
                <motion.p id="email-error" className="mt-1 text-sm text-red-600 dark:text-red-400" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} role="alert">
                  {validationErrors.email}
                </motion.p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="label">{t('auth.password')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-warm-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className={`input-field pl-10 pr-10 ${validationErrors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder={t('auth.password.placeholder')}
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  aria-invalid={!!validationErrors.password}
                  aria-describedby={validationErrors.password ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-warm-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-warm-400" />
                  )}
                </button>
              </div>
              {validationErrors.password && (
                <motion.p id="password-error" className="mt-1 text-sm text-red-600 dark:text-red-400" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} role="alert">
                  {validationErrors.password}
                </motion.p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="flex items-center justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-clay hover:text-clay-dark dark:text-clay font-medium transition-colors"
              >
                {t('auth.forgotPassword')}
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed h-12 text-base"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <span>{t('auth.signIn')}</span>
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-warm-200 dark:border-dark-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-warm-50 dark:bg-dark-bg text-darkwood/50 dark:text-warm-400">
                  {t('auth.or')}
                </span>
              </div>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 h-12 rounded-xl border border-warm-200 dark:border-dark-border bg-white dark:bg-dark-surface text-darkwood dark:text-warm-200 font-medium hover:bg-warm-50 dark:hover:bg-dark-card transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>{t('auth.google')}</span>
            </button>
          </motion.form>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-darkwood/50 dark:text-warm-400">
              {t('auth.noAccount')}{' '}
              <Link
                to="/register"
                className="font-semibold text-clay hover:text-clay-dark dark:text-clay transition-colors"
              >
                {t('auth.createAccount')}
              </Link>
            </p>
          </div>

          {/* Security Note */}
          <p className="text-center text-xs text-darkwood/30 dark:text-warm-500">
            Your data is encrypted and secure.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
