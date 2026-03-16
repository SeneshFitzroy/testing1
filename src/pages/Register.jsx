import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Loader2, AlertCircle, CheckCircle, Palette, ArrowRight, Shield } from 'lucide-react'
import { toast } from 'sonner'
import useAuthStore from '@/store/useAuthStore'
import { useTranslation } from 'react-i18next'

export default function Register() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const { register, loginWithGoogle, loading, error, clearError } = useAuthStore()

  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: [] })
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  useEffect(() => {
    clearError()
    setValidationErrors({})
  }, [formData.displayName, formData.email, clearError])

  useEffect(() => {
    const password = formData.password
    if (!password) {
      setPasswordStrength({ score: 0, feedback: [] })
      return
    }
    let score = 0
    const feedback = []
    if (password.length >= 8) score += 1; else feedback.push(t('auth.pw.min8'))
    if (/[A-Z]/.test(password)) score += 1; else feedback.push(t('auth.pw.uppercase'))
    if (/[a-z]/.test(password)) score += 1; else feedback.push(t('auth.pw.lowercase'))
    if (/\d/.test(password)) score += 1; else feedback.push(t('auth.pw.number'))
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1; else feedback.push(t('auth.pw.special'))
    setPasswordStrength({ score, feedback })
  }, [formData.password, t])

  const validateForm = () => {
    const errors = {}
    if (!formData.displayName.trim()) errors.displayName = t('auth.validation.nameRequired')
    else if (formData.displayName.trim().length < 2) errors.displayName = t('auth.validation.nameMin')
    if (!formData.email) errors.email = t('auth.validation.emailRequired')
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = t('auth.validation.emailInvalid')
    if (!formData.password) errors.password = t('auth.validation.passwordRequired')
    else if (formData.password.length < 6) errors.password = t('auth.validation.passwordMin')
    if (!formData.confirmPassword) errors.confirmPassword = t('auth.validation.confirmRequired')
    else if (formData.password !== formData.confirmPassword) errors.confirmPassword = t('auth.validation.passwordMismatch')
    if (!agreedToTerms) errors.terms = 'You must agree to the terms to continue'
    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errors = validateForm()
    if (Object.keys(errors).length > 0) { setValidationErrors(errors); return }
    try {
      await register(formData.email, formData.password, formData.displayName)
      toast.success(t('auth.accountCreated'), {
        description: t('auth.welcomeTo', { name: formData.displayName }),
        duration: 5000,
      })
      navigate('/shop', { replace: true })
    } catch (err) {
      const message = err?.friendlyMessage || t('auth.registerError')
      toast.error(t('auth.registerFailed'), { description: message, duration: 5000 })
    }
  }

  const handleGoogleSignUp = async () => {
    try {
      const result = await loginWithGoogle()
      if (!result) return
      toast.success(t('auth.welcomeGoogle'), {
        description: t('auth.googleSetup'),
        duration: 1800,
      })
      navigate('/shop', { replace: true })
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

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score < 2) return 'bg-red-400'
    if (passwordStrength.score < 4) return 'bg-yellow-400'
    return 'bg-green-400'
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength.score < 2) return t('auth.weak')
    if (passwordStrength.score < 4) return t('auth.good')
    return t('auth.strong')
  }

  return (
    <div className="min-h-screen flex bg-warm-50 dark:bg-dark-bg">
      {/* Right Panel — Form (main content for skip link) */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-darkwood via-[#2e1c12] to-[#1a120b]" />

        {/* Ambient orbs */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(63,94,69,0.12) 0%, transparent 70%)', top: '5%', left: '-10%' }}
            animate={{ scale: [1, 1.15, 1], y: [0, 20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(182,110,65,0.1) 0%, transparent 70%)', bottom: '5%', right: '-5%' }}
            animate={{ scale: [1, 1.2, 1], x: [0, -15, 0] }}
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
              Join Lee Roo<br />
              <span className="bg-gradient-to-r from-clay to-clay-dark bg-clip-text text-transparent">Furniture</span>
            </h1>

            <p className="text-warm-400 text-base leading-relaxed max-w-md mb-10">
              Create an account to browse furniture, save favorites, track orders, and shop our handcrafted collection. Plan rooms in 2D/3D.
            </p>

            {/* Benefits — 90% furniture, 10% 2D/3D */}
            <div className="space-y-4">
              {[
                'Browse & shop handcrafted furniture',
                'Save favorites & track orders',
                'Fast checkout & order tracking',
                '2D/3D room planner · Multi-language',
              ].map((benefit, i) => (
                <motion.div
                  key={benefit}
                  className="flex items-center gap-3 text-warm-300 text-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <div className="w-6 h-6 bg-clay/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-3 w-3 text-clay" />
                  </div>
                  {benefit}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel — Registration Form (main content for skip link) */}
      <div id="main-content" className="w-full lg:w-7/12 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8" role="main">
        <motion.div
          className="max-w-lg w-full space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center">
            <motion.div
              className="w-14 h-14 bg-gradient-to-br from-clay to-clay-dark rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-clay/25"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <User className="h-7 w-7 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-darkwood dark:text-warm-100 font-display">
              {t('auth.createAccount')}
            </h2>
            <p className="mt-2 text-darkwood/50 dark:text-warm-400 text-sm">
              {t('auth.register.subtitle')}
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
                <p className="text-sm font-semibold text-red-800 dark:text-red-300">{t('auth.registerError')}</p>
                <p className="text-sm text-red-600 dark:text-red-400 mt-0.5 leading-relaxed">{error}</p>
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

          {/* Registration Form */}
          <motion.form
            className="space-y-4"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            noValidate
          >
            {/* Two column for name and email on larger screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label htmlFor="displayName" className="label">{t('auth.fullName')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-warm-400" />
                  </div>
                  <input
                    id="displayName"
                    name="displayName"
                    type="text"
                    autoComplete="name"
                    required
                    className={`input-field pl-10 ${validationErrors.displayName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder={t('auth.fullName.placeholder')}
                    value={formData.displayName}
                    onChange={handleChange}
                    disabled={loading}
                    aria-invalid={!!validationErrors.displayName}
                    aria-describedby={validationErrors.displayName ? 'name-error' : undefined}
                  />
                </div>
                {validationErrors.displayName && (
                  <motion.p id="name-error" className="mt-1 text-sm text-red-600 dark:text-red-400" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} role="alert">
                    {validationErrors.displayName}
                  </motion.p>
                )}
              </div>

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
                  autoComplete="new-password"
                  required
                  className={`input-field pl-10 pr-10 ${validationErrors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder={t('auth.password.createPlaceholder')}
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  aria-invalid={!!validationErrors.password}
                  aria-describedby="password-strength"
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

              {/* Password Strength */}
              {formData.password && (
                <div className="mt-2" id="password-strength">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="flex-1 h-1.5 bg-warm-100 dark:bg-dark-surface rounded-full overflow-hidden flex gap-0.5">
                      {[0, 1, 2, 3, 4].map(i => (
                        <div
                          key={i}
                          className={`flex-1 rounded-full transition-all duration-300 ${
                            i < passwordStrength.score ? getPasswordStrengthColor() : 'bg-transparent'
                          }`}
                        />
                      ))}
                    </div>
                    <span className={`text-xs font-medium min-w-[3rem] text-right ${
                      passwordStrength.score < 2 ? 'text-red-500' :
                      passwordStrength.score < 4 ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  {passwordStrength.feedback.length > 0 && (
                    <p className="text-xs text-darkwood/50 dark:text-warm-400">
                      {t('auth.missing')}: {passwordStrength.feedback.join(', ')}
                    </p>
                  )}
                </div>
              )}

              {validationErrors.password && (
                <motion.p className="mt-1 text-sm text-red-600 dark:text-red-400" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} role="alert">
                  {validationErrors.password}
                </motion.p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="label">{t('auth.confirmPassword')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-warm-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className={`input-field pl-10 pr-10 ${validationErrors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder={t('auth.confirmPassword.placeholder')}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                  aria-invalid={!!validationErrors.confirmPassword}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-warm-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-warm-400" />
                  )}
                </button>
              </div>

              {/* Match Indicator — show only one message; validation error only when passwords don't match */}
              {formData.confirmPassword && (
                <div className="mt-1 flex items-center space-x-1">
                  {formData.password === formData.confirmPassword ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-green-600 dark:text-green-400">{t('auth.passwordsMatch')}</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span className="text-xs text-red-600 dark:text-red-400">
                        {validationErrors.confirmPassword || t('auth.passwordsDontMatch')}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Terms & Conditions */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => {
                      setAgreedToTerms(e.target.checked)
                      if (validationErrors.terms) {
                        setValidationErrors(prev => ({ ...prev, terms: '' }))
                      }
                    }}
                    className="sr-only peer"
                    aria-describedby={validationErrors.terms ? 'terms-error' : undefined}
                  />
                  <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${
                    agreedToTerms
                      ? 'bg-clay border-clay'
                      : validationErrors.terms
                        ? 'border-red-400 bg-red-50 dark:bg-red-900/20'
                        : 'border-warm-300 dark:border-dark-border group-hover:border-clay/50'
                  }`}>
                    {agreedToTerms && (
                      <motion.svg
                        className="w-3 h-3 text-white"
                        viewBox="0 0 12 10"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <path d="M1 5l3 3 7-7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </motion.svg>
                    )}
                  </div>
                </div>
                <span className="text-xs text-darkwood/60 dark:text-warm-400 leading-relaxed">
                  I agree to the{' '}
                  <button type="button" className="text-clay hover:text-clay-dark font-medium underline underline-offset-2">Terms of Service</button>
                  {' '}and{' '}
                  <button type="button" className="text-clay hover:text-clay-dark font-medium underline underline-offset-2">Privacy Policy</button>
                </span>
              </label>
              {validationErrors.terms && (
                <motion.p id="terms-error" className="mt-1 text-sm text-red-600 dark:text-red-400 pl-8" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} role="alert">
                  {validationErrors.terms}
                </motion.p>
              )}
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
                <span>{t('auth.createAccount')}</span>
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

            {/* Google Sign Up */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
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

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-darkwood/50 dark:text-warm-400 text-sm">
              {t('auth.haveAccount')}{' '}
              <Link
                to="/login"
                className="font-semibold text-clay hover:text-clay-dark dark:text-clay transition-colors"
              >
                {t('auth.signIn')}
              </Link>
            </p>
          </div>

          {/* Security Note */}
          <div className="flex items-center justify-center gap-2 text-xs text-darkwood/30 dark:text-warm-500">
            <Shield className="h-3.5 w-3.5" />
            <span>Your data is encrypted and secure.</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
