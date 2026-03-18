import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, UserPlus, Users, Mail, Lock, Shield, Loader2, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import useAuthStore from '@/store/useAuthStore'
import { auth, db } from '@/lib/firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth'
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore'

export default function AdminUsers() {
  const { user } = useAuthStore()
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAddDesigner = async (e) => {
    e.preventDefault()
    if (!email || !password || !adminPassword) {
      toast.error('Please fill all required fields')
      return
    }
    if (password.length < 6) {
      toast.error('Designer password must be at least 6 characters')
      return
    }
    const adminEmail = user?.email
    if (!adminEmail) {
      toast.error('Admin session lost')
      return
    }
    setLoading(true)
    try {
      await signOut(auth)
      const credential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(credential.user, { displayName: displayName || 'Designer' })
      await setDoc(doc(db, 'users', credential.user.uid), {
        uid: credential.user.uid,
        email,
        displayName: displayName || 'Designer',
        name: displayName || 'Designer',
        role: 'designer',
        createdAt: new Date().toISOString(),
        designs: [],
        wishlist: [],
      }, { merge: true })
      await signOut(auth)
      await signInWithEmailAndPassword(auth, adminEmail, adminPassword)
      toast.success(`Designer ${email} added successfully`)
      setEmail('')
      setPassword('')
      setDisplayName('')
      setAdminPassword('')
    } catch (err) {
      const adminEmail = user?.email
      const msg = err.code === 'auth/email-already-in-use'
        ? 'Email already in use. Use Firebase Console to add existing user as designer.'
        : err.message
      toast.error(msg)
      try {
        if (adminEmail) await signInWithEmailAndPassword(auth, adminEmail, adminPassword)
      } catch (_) {}
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="min-h-screen bg-warm-50 dark:bg-dark-bg">
      <div className="bg-white dark:bg-dark-card border-b border-warm-100 dark:border-dark-border">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="p-2 rounded-xl bg-warm-100 dark:bg-dark-surface text-darkwood dark:text-white hover:bg-warm-200 dark:hover:bg-dark-border transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-darkwood dark:text-white font-display flex items-center gap-2">
                <Users className="h-7 w-7 text-clay" />
                {t('admin.team') || 'Team Management'}
              </h1>
              <p className="text-darkwood/50 dark:text-white text-sm">{t('admin.addDesignerDesc') || 'Add designers to give them access to the Designer Panel'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          className="bg-white dark:bg-dark-card rounded-2xl border border-warm-100 dark:border-dark-border p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-lg font-bold text-darkwood dark:text-white mb-4 flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-clay" />
            {t('admin.addDesigner') || 'Add New Designer'}
          </h2>
          <form onSubmit={handleAddDesigner} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-darkwood dark:text-white mb-1.5">{t('auth.email')}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warm-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="designer@leeroo.com" required
                  className="input-field pl-10" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-darkwood dark:text-white mb-1.5">{t('auth.password')} (min 6 chars)</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warm-400" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6}
                  className="input-field pl-10" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-darkwood dark:text-white mb-1.5">{t('checkout.fullName')} (optional)</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warm-400" />
                <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Designer Name"
                  className="input-field pl-10" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-darkwood dark:text-white mb-1.5">Your password (to verify)</label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warm-400" />
                <input type="password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} placeholder="••••••••" required
                  className="input-field pl-10" />
              </div>
              <p className="text-xs text-darkwood/50 dark:text-white mt-1">Required to restore your admin session after creating the designer</p>
            </div>
            <button type="submit" disabled={loading}
              className="inline-flex items-center gap-2 bg-clay text-white px-6 py-3 rounded-xl font-semibold hover:bg-clay-dark disabled:opacity-50 transition-all">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <UserPlus className="h-5 w-5" />}
              {loading ? 'Adding...' : (t('admin.addDesigner') || 'Add Designer')}
            </button>
          </form>
        </motion.div>

        <motion.div
          className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-start gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <CheckCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800 dark:text-amber-200">
            <p className="font-semibold mb-1">Admin & Demo Credentials</p>
            <p className="text-amber-700 dark:text-amber-300">Admin: <code className="bg-amber-100 dark:bg-amber-900/40 px-1 rounded">admin@leeroo.com</code> / use the password you set in <code className="bg-amber-100 dark:bg-amber-900/40 px-1 rounded">.env.local</code> (VITE_DEMO_ADMIN_PASSWORD). If using demo provision, all accounts (admin, designer, user) share that password.</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
