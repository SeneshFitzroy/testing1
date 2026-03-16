import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, Loader2, AlertCircle, Shield, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import useAuthStore from '@/store/useAuthStore'
import { useTranslation } from 'react-i18next'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { login, loading, error, clearError, user, userProfile, isAdmin } = useAuthStore()
  const { t } = useTranslation()

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const [authChecking, setAuthChecking] = useState(false)

  useEffect(() => {
    clearError()
    setValidationErrors({})
  }, [formData, clearError])

  // If user is already logged in as admin, redirect
  useEffect(() => {
    if (user && userProfile && isAdmin()) {
      navigate('/admin', { replace: true })
    }
  }, [user, userProfile, isAdmin, navigate])

  const validateForm = () => {
    const errors = {}
    if (!formData.email) {
      errors.email = t('admin.login.emailRequired')
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
    setAuthChecking(true)
    try {
      await login(formData.email, formData.password)
      // After login, check admin role from the store
      // We need a small delay for the store to update userProfile
      setTimeout(() => {
        const store = useAuthStore.getState()
        if (store.userProfile?.role === 'admin') {
          toast.success(t('admin.login.welcome'), {
            description: t('admin.login.signedIn'),
          })
          navigate('/admin', { replace: true })
        } else {
          toast.error(t('admin.login.accessDenied'), {
            description: t('admin.login.noPrivileges'),
            duration: 5000,
          })
          // Sign them out since they tried admin login without admin role
          store.logout()
          setAuthChecking(false)
        }
      }, 800)
    } catch (err) {
      const message = err?.friendlyMessage || t('admin.login.error')
      toast.error(t('admin.login.failed'), { description: message, duration: 5000 })
      setAuthChecking(false)
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
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-darkwood relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-clay/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-forest/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-darkwood-light/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        className="max-w-md w-full space-y-8 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Back to User Login */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-warm-300 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('admin.login.backToUser')}
        </Link>

        {/* Header */}
        <div className="text-center">
          <motion.div
            className="w-20 h-20 bg-clay rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-clay/30"
            initial={{ scale: 0, rotate: -12 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <Shield className="h-10 w-10 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white font-display">
            {t('admin.login.title')}
          </h2>
          <p className="mt-2 text-warm-400">
            {t('admin.login.subtitle')}
          </p>
        </div>

        {/* Security Badge */}
        <motion.div
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="w-8 h-8 bg-forest/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield className="h-4 w-4 text-forest-light" />
          </div>
          <p className="text-warm-400 text-xs">
            {t('admin.login.securityNote')}
          </p>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            className="bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-xl p-4 flex items-start space-x-3"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="flex-shrink-0 w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-red-300 leading-relaxed">{error}</p>
              </div>
            <button
              onClick={clearError}
              className="flex-shrink-0 text-red-400 hover:text-red-300 transition-colors p-1 rounded-lg hover:bg-red-500/10"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}

        {/* Login Form */}
        <motion.form
          className="space-y-6"
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-warm-200 mb-1.5">{t('admin.login.email')}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-warm-500" />
              </div>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`w-full px-4 py-3 pl-10 rounded-xl border bg-white/5 backdrop-blur-sm text-white placeholder:text-warm-500 focus:outline-none focus:ring-2 focus:ring-clay/40 focus:border-clay transition-all duration-200 ${
                  validationErrors.email
                    ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/40'
                    : 'border-white/10 hover:border-white/20'
                }`}
                placeholder="admin@Lee Roo.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading || authChecking}
              />
            </div>
            {validationErrors.email && (
              <motion.p className="mt-1 text-sm text-red-400" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                {validationErrors.email}
              </motion.p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-warm-200 mb-1.5">{t('auth.password')}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-warm-500" />
              </div>
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className={`w-full px-4 py-3 pl-10 pr-10 rounded-xl border bg-white/5 backdrop-blur-sm text-white placeholder:text-warm-500 focus:outline-none focus:ring-2 focus:ring-clay/40 focus:border-clay transition-all duration-200 ${
                  validationErrors.password
                    ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/40'
                    : 'border-white/10 hover:border-white/20'
                }`}
                placeholder={t('admin.login.passwordPlaceholder')}
                value={formData.password}
                onChange={handleChange}
                disabled={loading || authChecking}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading || authChecking}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-warm-500 hover:text-warm-300 transition-colors" />
                ) : (
                  <Eye className="h-5 w-5 text-warm-500 hover:text-warm-300 transition-colors" />
                )}
              </button>
            </div>
            {validationErrors.password && (
              <motion.p className="mt-1 text-sm text-red-400" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                {validationErrors.password}
              </motion.p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || authChecking}
            className="w-full bg-clay text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-clay-dark hover:shadow-lg hover:shadow-clay/25 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-clay focus:ring-offset-2 focus:ring-offset-darkwood active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading || authChecking ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>{authChecking ? t('admin.login.verifying') : t('admin.login.signingIn')}</span>
              </>
            ) : (
              <>
                <Shield className="h-5 w-5" />
                <span>{t('admin.login.submit')}</span>
              </>
            )}
          </button>
        </motion.form>

        {/* Footer */}
        <div className="text-center">
          <p className="text-warm-500 text-sm">
            {t('admin.login.footer')}
          </p>
        </div>
      </motion.div>
    </div>
  )
}
