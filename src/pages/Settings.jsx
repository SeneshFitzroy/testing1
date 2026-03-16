import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings as SettingsIcon, User, Palette, Globe, DollarSign, Bell, Shield, Camera,
  Sun, Moon, Check, ChevronRight, Save, Loader2, Lock, Trash2, LogOut, Eye, EyeOff,
  Mail, Phone, MapPin, Languages, CreditCard, Volume2, VolumeX,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider, deleteUser } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'
import { db, auth } from '@/lib/firebase'
import useAuthStore from '@/store/useAuthStore'
import useThemeStore from '@/store/useThemeStore'

const tabs = [
  { id: 'profile', icon: User },
  { id: 'appearance', icon: Palette },
  { id: 'language', icon: Globe },
  { id: 'notifications', icon: Bell },
  { id: 'security', icon: Shield },
]

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'si', name: 'සිංහල', flag: '🇱🇰' },
  { code: 'ta', name: 'தமிழ்', flag: '🇱🇰' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
]

export default function Settings() {
  const { t, i18n } = useTranslation()
  const { user, userProfile, refreshProfile } = useAuthStore()
  const { darkMode, toggleDarkMode, language, setLanguage, currency, setCurrency, currencies } = useThemeStore()

  const [active, setActive] = useState('profile')
  const [saving, setSaving] = useState(false)

  const [profile, setProfile] = useState({
    displayName: userProfile?.displayName || user?.displayName || '',
    phone: userProfile?.phone || '',
    address: userProfile?.address || '',
    bio: userProfile?.bio || '',
  })

  const [pwd, setPwd] = useState({ current: '', newPwd: '', confirm: '' })
  const [showPwd, setShowPwd] = useState({ current: false, newPwd: false, confirm: false })
  const [notifs, setNotifs] = useState({
    orderUpdates: true, promotions: false, newsletter: true, designTips: true, sounds: true,
  })

  useEffect(() => {
    if (userProfile) {
      setProfile({
        displayName: userProfile.displayName || user?.displayName || '',
        phone: userProfile.phone || '',
        address: userProfile.address || '',
        bio: userProfile.bio || '',
      })
    }
  }, [userProfile, user])

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      if (auth.currentUser) await updateProfile(auth.currentUser, { displayName: profile.displayName })
      if (user?.uid) await updateDoc(doc(db, 'users', user.uid), { displayName: profile.displayName, phone: profile.phone, address: profile.address, bio: profile.bio })
      await refreshProfile()
      toast.success(t('settings.profileSaved'))
    } catch (err) { console.error(err); toast.error(t('settings.saveFailed')) }
    finally { setSaving(false) }
  }

  const handleChangePassword = async () => {
    if (pwd.newPwd !== pwd.confirm) { toast.error(t('settings.passwordMismatch')); return }
    if (pwd.newPwd.length < 6) { toast.error(t('settings.passwordTooShort')); return }
    setSaving(true)
    try {
      const cred = EmailAuthProvider.credential(user.email, pwd.current)
      await reauthenticateWithCredential(auth.currentUser, cred)
      await updatePassword(auth.currentUser, pwd.newPwd)
      setPwd({ current: '', newPwd: '', confirm: '' })
      toast.success(t('settings.passwordChanged'))
    } catch (err) {
      if (err.code === 'auth/wrong-password') toast.error(t('settings.wrongPassword'))
      else toast.error(t('settings.passwordFailed'))
    } finally { setSaving(false) }
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm(t('settings.confirmDelete'))) return
    try { await deleteUser(auth.currentUser); toast.success(t('settings.accountDeleted')) }
    catch { toast.error(t('settings.deleteFailed')) }
  }

  const changeLang = (code) => { setLanguage(code); i18n.changeLanguage(code); toast.success(t('settings.languageChanged')) }

  const Card = ({ children, className = '' }) => (
    <motion.div className={`bg-white dark:bg-dark-card rounded-2xl border border-warm-100 dark:border-dark-border p-5 sm:p-6 ${className}`}
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {children}
    </motion.div>
  )

  const PwdInput = ({ label, name, value, onChange, show, onToggle }) => (
    <div>
      <label className="block text-sm font-semibold text-darkwood dark:text-white mb-1.5">{label}</label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warm-400" />
        <input type={show ? 'text' : 'password'} name={name} value={value} onChange={onChange}
          className="w-full pl-10 pr-10 py-3 rounded-xl border border-warm-200 dark:border-dark-border bg-white dark:bg-dark-surface text-darkwood dark:text-white placeholder:text-warm-400 focus:ring-2 focus:ring-clay/40 focus:border-clay text-sm transition-all" />
        <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-400 hover:text-darkwood dark:hover:text-warm-200">
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-warm-50 dark:bg-dark-bg">
      <div className="bg-white dark:bg-dark-card border-b border-warm-100 dark:border-dark-border">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-clay rounded-xl flex items-center justify-center shadow-lg shadow-clay/20">
              <SettingsIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-darkwood dark:text-white font-display">{t('settings.title')}</h1>
              <p className="text-darkwood/50 dark:text-white text-sm">{t('settings.subtitle')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-dark-card rounded-2xl border border-warm-100 dark:border-dark-border p-2 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActive(tab.id)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${active === tab.id ? 'bg-clay text-white shadow-md shadow-clay/20' : 'text-darkwood/60 dark:text-white hover:bg-warm-50 dark:hover:bg-dark-surface'}`}>
                  <tab.icon className="h-4 w-4 flex-shrink-0" />
                  <span className="hidden sm:inline">{t(`settings.${tab.id}`)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {active === 'profile' && (
                <Card key="profile">
                  <h2 className="text-lg font-bold text-darkwood dark:text-white mb-6 flex items-center gap-2"><User className="h-5 w-5 text-clay" />{t('settings.profileInfo')}</h2>
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-warm-100 dark:border-dark-border">
                    <div className="relative">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-clay to-forest flex items-center justify-center text-white text-2xl font-bold">
                        {(profile.displayName || 'U')[0]?.toUpperCase()}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-clay rounded-full flex items-center justify-center cursor-pointer hover:bg-clay-dark transition-all shadow-lg">
                        <Camera className="h-3.5 w-3.5 text-white" />
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-darkwood dark:text-white">{profile.displayName || t('settings.noName')}</p>
                      <p className="text-sm text-darkwood/50 dark:text-white">{user?.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-darkwood dark:text-white mb-1.5">{t('checkout.fullName')}</label>
                      <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warm-400" />
                        <input value={profile.displayName} onChange={e => setProfile({...profile, displayName: e.target.value})}
                          className="w-full pl-10 py-3 rounded-xl border border-warm-200 dark:border-dark-border bg-white dark:bg-dark-surface text-darkwood dark:text-white focus:ring-2 focus:ring-clay/40 focus:border-clay text-sm transition-all" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-darkwood dark:text-white mb-1.5">{t('auth.email')}</label>
                      <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warm-400" />
                        <input value={user?.email || ''} disabled
                          className="w-full pl-10 py-3 rounded-xl border border-warm-200 dark:border-dark-border bg-warm-50 dark:bg-dark-surface text-darkwood/50 dark:text-white text-sm cursor-not-allowed" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-darkwood dark:text-white mb-1.5">{t('checkout.phone')}</label>
                      <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warm-400" />
                        <input value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} placeholder="+44 7123 456789"
                          className="w-full pl-10 py-3 rounded-xl border border-warm-200 dark:border-dark-border bg-white dark:bg-dark-surface text-darkwood dark:text-white placeholder:text-warm-400 focus:ring-2 focus:ring-clay/40 focus:border-clay text-sm transition-all" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-darkwood dark:text-white mb-1.5">{t('checkout.address')}</label>
                      <div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warm-400" />
                        <input value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})} placeholder="123 Baker Street"
                          className="w-full pl-10 py-3 rounded-xl border border-warm-200 dark:border-dark-border bg-white dark:bg-dark-surface text-darkwood dark:text-white placeholder:text-warm-400 focus:ring-2 focus:ring-clay/40 focus:border-clay text-sm transition-all" />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-darkwood dark:text-white mb-1.5">{t('settings.bio')}</label>
                      <textarea value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} rows={3} placeholder={t('settings.bioPlaceholder')}
                        className="w-full px-4 py-3 rounded-xl border border-warm-200 dark:border-dark-border bg-white dark:bg-dark-surface text-darkwood dark:text-white placeholder:text-warm-400 focus:ring-2 focus:ring-clay/40 focus:border-clay text-sm transition-all resize-none" />
                    </div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <button onClick={handleSaveProfile} disabled={saving}
                      className="flex items-center gap-2 bg-clay text-white font-semibold px-6 py-3 rounded-xl hover:bg-clay-dark hover:shadow-lg hover:shadow-clay/25 transition-all disabled:opacity-50 text-sm">
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} {t('settings.saveProfile')}
                    </button>
                  </div>
                </Card>
              )}

              {active === 'appearance' && (
                <Card key="appearance">
                  <h2 className="text-lg font-bold text-darkwood dark:text-white mb-6 flex items-center gap-2"><Palette className="h-5 w-5 text-clay" />{t('settings.appearance')}</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-darkwood dark:text-white mb-3">{t('settings.theme')}</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { mode: false, label: t('settings.lightMode'), icon: Sun, desc: t('settings.lightDesc') },
                          { mode: true, label: t('settings.darkMode'), icon: Moon, desc: t('settings.darkDesc') },
                        ].map(opt => (
                          <button key={opt.label} onClick={() => { if (darkMode !== opt.mode) toggleDarkMode() }}
                            className={`flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all ${darkMode === opt.mode ? 'border-clay bg-clay/5' : 'border-warm-200 dark:border-dark-border hover:border-warm-300'}`}>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${darkMode === opt.mode ? 'bg-clay text-white' : 'bg-warm-100 dark:bg-dark-surface text-warm-400'}`}>
                              <opt.icon className="h-6 w-6" />
                            </div>
                            <div className="text-center">
                              <p className={`text-sm font-semibold ${darkMode === opt.mode ? 'text-clay' : 'text-darkwood dark:text-white'}`}>{opt.label}</p>
                              <p className="text-[10px] text-darkwood/50 dark:text-white mt-0.5">{opt.desc}</p>
                            </div>
                            {darkMode === opt.mode && <Check className="h-4 w-4 text-clay" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-darkwood dark:text-white mb-3">{t('settings.currency')}</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {Object.values(currencies).map(cur => (
                          <button key={cur.code} onClick={() => setCurrency(cur.code)}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${currency === cur.code ? 'border-clay bg-clay/5 text-clay' : 'border-warm-200 dark:border-dark-border text-darkwood/60 dark:text-white hover:border-warm-300'}`}>
                            <span className="font-bold">{cur.symbol}</span> {cur.code}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {active === 'language' && (
                <Card key="language">
                  <h2 className="text-lg font-bold text-darkwood dark:text-white mb-6 flex items-center gap-2"><Languages className="h-5 w-5 text-clay" />{t('settings.language')}</h2>
                  <div className="space-y-2">
                    {LANGUAGES.map(lang => (
                      <button key={lang.code} onClick={() => changeLang(lang.code)}
                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all ${language === lang.code ? 'border-clay bg-clay/5' : 'border-warm-200 dark:border-dark-border hover:border-warm-300 dark:hover:border-dark-border/80'}`}>
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{lang.flag}</span>
                          <div className="text-left">
                            <p className={`text-sm font-semibold ${language === lang.code ? 'text-clay' : 'text-darkwood dark:text-white'}`}>{lang.name}</p>
                            <p className="text-[10px] text-darkwood/50 dark:text-white uppercase">{lang.code}</p>
                          </div>
                        </div>
                        {language === lang.code && <div className="w-6 h-6 bg-clay rounded-full flex items-center justify-center"><Check className="h-3.5 w-3.5 text-white" /></div>}
                      </button>
                    ))}
                  </div>
                </Card>
              )}

              {active === 'notifications' && (
                <Card key="notifications">
                  <h2 className="text-lg font-bold text-darkwood dark:text-white mb-6 flex items-center gap-2"><Bell className="h-5 w-5 text-clay" />{t('settings.notifications')}</h2>
                  <div className="space-y-1">
                    {[
                      { key: 'orderUpdates', icon: CreditCard, label: t('settings.orderUpdates'), desc: t('settings.orderUpdatesDesc') },
                      { key: 'promotions', icon: DollarSign, label: t('settings.promotions'), desc: t('settings.promotionsDesc') },
                      { key: 'newsletter', icon: Mail, label: t('settings.newsletter'), desc: t('settings.newsletterDesc') },
                      { key: 'designTips', icon: Palette, label: t('settings.designTips'), desc: t('settings.designTipsDesc') },
                      { key: 'sounds', icon: notifs.sounds ? Volume2 : VolumeX, label: t('settings.sounds'), desc: t('settings.soundsDesc') },
                    ].map(n => (
                      <div key={n.key} className="flex items-center justify-between px-4 py-3.5 rounded-xl hover:bg-warm-50 dark:hover:bg-dark-surface transition-all">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-9 h-9 bg-warm-100 dark:bg-dark-surface rounded-lg flex items-center justify-center flex-shrink-0">
                            <n.icon className="h-4 w-4 text-clay" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-darkwood dark:text-white">{n.label}</p>
                            <p className="text-[10px] text-darkwood/50 dark:text-white truncate">{n.desc}</p>
                          </div>
                        </div>
                        <button onClick={() => setNotifs({...notifs, [n.key]: !notifs[n.key]})}
                          className={`relative w-11 h-6 rounded-full transition-all flex-shrink-0 ml-3 ${notifs[n.key] ? 'bg-clay' : 'bg-warm-200 dark:bg-dark-border'}`}>
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${notifs[n.key] ? 'left-6' : 'left-1'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {active === 'security' && (
                <div key="security" className="space-y-6">
                  <Card>
                    <h2 className="text-lg font-bold text-darkwood dark:text-white mb-6 flex items-center gap-2"><Lock className="h-5 w-5 text-clay" />{t('settings.changePassword')}</h2>
                    <div className="space-y-4">
                      <PwdInput label={t('settings.currentPassword')} name="current" value={pwd.current} onChange={e => setPwd({...pwd, current: e.target.value})} show={showPwd.current} onToggle={() => setShowPwd({...showPwd, current: !showPwd.current})} />
                      <PwdInput label={t('settings.newPassword')} name="newPwd" value={pwd.newPwd} onChange={e => setPwd({...pwd, newPwd: e.target.value})} show={showPwd.newPwd} onToggle={() => setShowPwd({...showPwd, newPwd: !showPwd.newPwd})} />
                      <PwdInput label={t('settings.confirmPassword')} name="confirm" value={pwd.confirm} onChange={e => setPwd({...pwd, confirm: e.target.value})} show={showPwd.confirm} onToggle={() => setShowPwd({...showPwd, confirm: !showPwd.confirm})} />
                    </div>
                    <div className="flex justify-end mt-6">
                      <button onClick={handleChangePassword} disabled={saving || !pwd.current || !pwd.newPwd || !pwd.confirm}
                        className="flex items-center gap-2 bg-clay text-white font-semibold px-6 py-3 rounded-xl hover:bg-clay-dark transition-all disabled:opacity-50 text-sm">
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />} {t('settings.updatePassword')}
                      </button>
                    </div>
                  </Card>
                  <Card className="border-red-200 dark:border-red-500/30">
                    <h2 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2"><Trash2 className="h-5 w-5" />{t('settings.dangerZone')}</h2>
                    <p className="text-sm text-darkwood/50 dark:text-white mb-4">{t('settings.deleteWarning')}</p>
                    <button onClick={handleDeleteAccount}
                      className="flex items-center gap-2 bg-red-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-red-600 transition-all text-sm">
                      <Trash2 className="h-4 w-4" /> {t('settings.deleteAccount')}
                    </button>
                  </Card>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}