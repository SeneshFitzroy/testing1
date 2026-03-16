import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  ShoppingCart,
  Heart,
  Moon,
  Sun,
  LogOut,
  Menu,
  X,
  ShoppingBag,
  User,
  UserPlus,
  Palette,
  Package,
  FolderOpen,
  ChevronDown,
  Settings,
  Shield,
  Globe,
  DollarSign,
  Layout,
  Users,
} from 'lucide-react'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import useAuthStore from '@/store/useAuthStore'
import useThemeStore from '@/store/useThemeStore'
import useCartStore from '@/store/useCartStore'
import { LANGUAGE_OPTIONS } from '@/i18n'
import { LogoIcon } from '@/components/Logo'

function DropdownMenu({ open, onClose, children, className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const handler = (e) => { if (open && ref.current && !ref.current.contains(e.target)) onClose() }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open, onClose])
  return (
    <div ref={ref} className="relative">
      <AnimatePresence>
        {open && (
          <motion.div
            className={`absolute top-full right-0 mt-2 rounded-xl shadow-2xl border overflow-hidden z-[100]
              bg-white/95 dark:bg-dark-card/95 backdrop-blur-xl border-warm-200/60 dark:border-dark-border/60 ${className}`}
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)
  const [isCurrOpen, setIsCurrOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const { user, userProfile, logout, isAdmin, isDesigner, isDesignerOnly } = useAuthStore()
  const designerOnly = isDesignerOnly()
  const { darkMode, toggleDarkMode, currency, setCurrency, currencies, language, setLanguage } = useThemeStore()
  const { getCartCount, getWishlistCount } = useCartStore()

  const isLandingPage = location.pathname === '/'

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    setIsMenuOpen(false)
    setIsProfileOpen(false)
    setIsLangOpen(false)
    setIsCurrOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handler = (e) => {
      if (isProfileOpen && !e.target.closest('[data-profile-menu]')) setIsProfileOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isProfileOpen])

  // Admins see admin nav; regular users see Home + Shop.
  const adminNavLinks = [
    { to: '/admin', label: t('admin.dashboard') || 'Dashboard', icon: Shield },
    { to: '/admin/products', label: t('admin.products') || 'Products', icon: Package },
    { to: '/designer-panel', label: 'Designer Panel', icon: Palette },
  ]
  const navLinks = [
    { to: '/', label: t('nav.home') || 'Home', icon: Home, public: true },
    { to: '/shop', label: t('nav.shop') || 'Shop', icon: ShoppingBag, public: true },
  ]
  const designerNavLinks = [
    { to: '/designer-panel', label: t('nav.designerPanel') || 'Designer Panel', icon: Palette },
    { to: '/editor', label: t('nav.editor') || 'Room Editor', icon: Layout },
    { to: '/my-designs', label: t('nav.myDesigns') || 'My Designs', icon: FolderOpen },
  ]
  const visibleNavLinks = isAdmin() ? adminNavLinks : (isDesignerOnly() ? designerNavLinks : (isDesigner() ? designerNavLinks : navLinks))

  const isActive = (p) => location.pathname === p
  const cartCount = getCartCount()
  const wishlistCount = getWishlistCount()
  const handleLogout = () => { logout(); setIsProfileOpen(false) }

  const handleLang = (code) => {
    setLanguage(code)
    i18n.changeLanguage(code)
    setIsLangOpen(false)
  }
  const handleCurrency = (code) => {
    setCurrency(code)
    setIsCurrOpen(false)
  }

  const currentLang = LANGUAGE_OPTIONS.find((l) => l.code === language) || LANGUAGE_OPTIONS[0]
  const currentCur = currencies[currency] || currencies.USD
  const currencyList = Object.values(currencies)

  const isShopSection = location.pathname === '/shop' || location.pathname.startsWith('/shop/')
  const navBg = isLandingPage && !isScrolled
    ? 'bg-black/30 dark:bg-black/40 backdrop-blur-md border-transparent'
    : isShopSection
      ? 'bg-white dark:bg-dark-bg border-b border-neutral-200 dark:border-dark-border'
      : 'bg-stone-50/95 dark:bg-dark-bg/95 backdrop-blur-2xl border-stone-200/60 dark:border-dark-border/40 shadow-sm'

  const textColor = isLandingPage && !isScrolled
    ? 'text-white hover:text-white'
    : 'text-charcoal dark:text-warm-400 hover:text-charcoal dark:hover:text-warm-100'

  return (
    <nav
      className={`${navBg} border-b sticky top-0 z-50 transition-all duration-300`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to={user ? (designerOnly ? '/designer-panel' : '/shop') : '/'} className="flex items-center gap-2.5 group shrink-0">
            <div className="group-hover:scale-110 transition-transform duration-200">
              <LogoIcon size={36} light={isLandingPage && !isScrolled} />
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className={`text-xl font-bold tracking-tight font-display transition-colors duration-300 ${
                isLandingPage && !isScrolled
                  ? 'text-white'
                  : 'bg-gradient-to-r from-darkwood to-clay dark:from-warm-100 dark:to-clay bg-clip-text text-transparent'
              }`}>
                Lee Roo
              </span>
              <span className={`text-[10px] -mt-0.5 transition-colors duration-300 ${
                isLandingPage && !isScrolled ? 'text-white/80' : 'text-darkwood/50 dark:text-warm-400'
              }`}>
                {String.fromCharCode(0x0DBD, 0x0DD3)} {String.fromCharCode(0x0DBB, 0x0DD6)} &middot; Wood Designs
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-0.5">
            {visibleNavLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(to)
                    ? 'bg-gradient-to-r from-clay to-clay-dark text-white shadow-md shadow-clay/25'
                    : isLandingPage && !isScrolled
                      ? 'text-white/90 hover:text-white hover:bg-white/20'
                      : 'text-darkwood/60 dark:text-warm-400 hover:bg-warm-100/80 dark:hover:bg-dark-surface/80 hover:text-darkwood dark:hover:text-warm-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1">

            {/* Language Selector */}
            <div className="relative hidden sm:block" data-lang-menu>
              <button
                onClick={() => { setIsLangOpen(!isLangOpen); setIsCurrOpen(false); setIsProfileOpen(false) }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${textColor}`}
                title="Language"
                aria-label={`Current language: ${currentLang.name}`}
                aria-expanded={isLangOpen}
              >
                <Globe className="h-3.5 w-3.5" />
                <span className="hidden xl:inline">{currentLang.code.toUpperCase()}</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>
              <DropdownMenu open={isLangOpen} onClose={() => setIsLangOpen(false)} className="w-44">
                <div className="py-1" role="listbox" aria-label="Language selection">
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLang(lang.code)}
                      role="option"
                      aria-selected={language === lang.code}
                      className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors ${
                        language === lang.code
                          ? 'bg-clay/10 dark:bg-clay/20 text-clay font-semibold'
                          : 'text-darkwood dark:text-warm-200 hover:bg-warm-50 dark:hover:bg-dark-surface'
                      }`}
                    >
                      <span className="w-6 h-6 rounded-full bg-warm-100 dark:bg-dark-surface flex items-center justify-center text-[10px] font-bold text-darkwood/70 dark:text-warm-300">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              </DropdownMenu>
            </div>

            {/* Currency Selector */}
            <div className="relative hidden sm:block" data-curr-menu>
              <button
                onClick={() => { setIsCurrOpen(!isCurrOpen); setIsLangOpen(false); setIsProfileOpen(false) }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${textColor}`}
                title="Currency"
                aria-label={`Current currency: ${currentCur.code}`}
                aria-expanded={isCurrOpen}
              >
                <DollarSign className="h-3.5 w-3.5" />
                <span>{currentCur.code}</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${isCurrOpen ? 'rotate-180' : ''}`} />
              </button>
              <DropdownMenu open={isCurrOpen} onClose={() => setIsCurrOpen(false)} className="w-52">
                <div className="py-1 max-h-64 overflow-y-auto" role="listbox" aria-label="Currency selection">
                  {currencyList.map((cur) => (
                    <button
                      key={cur.code}
                      onClick={() => handleCurrency(cur.code)}
                      role="option"
                      aria-selected={currency === cur.code}
                      className={`flex items-center justify-between w-full px-4 py-2.5 text-sm transition-colors ${
                        currency === cur.code
                          ? 'bg-clay/10 dark:bg-clay/20 text-clay font-semibold'
                          : 'text-darkwood dark:text-warm-200 hover:bg-warm-50 dark:hover:bg-dark-surface'
                      }`}
                    >
                      <span>{cur.symbol} {cur.code}</span>
                      <span className="text-xs text-darkwood/40 dark:text-warm-500">{cur.name}</span>
                    </button>
                  ))}
                </div>
              </DropdownMenu>
            </div>

            {/* Divider */}
            <div className={`hidden sm:block w-px h-6 mx-1 transition-colors duration-300 ${
              isLandingPage && !isScrolled ? 'bg-white/20' : 'bg-warm-200 dark:bg-dark-border'
            }`} />

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-xl transition-all duration-200 hover:scale-105 ${
                isLandingPage && !isScrolled
                  ? 'text-white/90 hover:text-white hover:bg-white/20'
                  : 'text-darkwood/50 dark:text-warm-400 hover:bg-warm-100 dark:hover:bg-dark-surface'
              }`}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={darkMode ? 'dark' : 'light'}
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  {darkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
                </motion.div>
              </AnimatePresence>
            </button>

            {/* Cart — hidden for designer-only users */}
            {!designerOnly && (
              <Link
                to="/cart"
                className={`relative p-2 rounded-xl transition-colors ${
                  isLandingPage && !isScrolled
                    ? 'text-white/70 hover:text-white hover:bg-white/10'
                    : 'text-darkwood/50 dark:text-warm-400 hover:bg-warm-100 dark:hover:bg-dark-surface'
                }`}
                aria-label={`Shopping cart${cartCount > 0 ? `, ${cartCount} items` : ', empty'}`}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <motion.span
                    className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-clay to-clay-dark text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>
            )}

            {user && (
              <>
                {/* Wishlist — hidden for designer-only users */}
                {!designerOnly && (
                  <Link
                    to="/wishlist"
                    className={`relative p-2 rounded-xl transition-colors ${
                      isLandingPage && !isScrolled
                        ? 'text-white/70 hover:text-white hover:bg-white/10'
                        : 'text-darkwood/50 dark:text-warm-400 hover:bg-warm-100 dark:hover:bg-dark-surface'
                    }`}
                    aria-label={`Wishlist${wishlistCount > 0 ? `, ${wishlistCount} items` : ', empty'}`}
                  >
                    <Heart className={`h-5 w-5 ${wishlistCount > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                )}

                {/* Profile Menu */}
                <div className="relative ml-1" data-profile-menu>
                  <button
                    onClick={() => { setIsProfileOpen(!isProfileOpen); setIsLangOpen(false); setIsCurrOpen(false) }}
                    className={`flex items-center gap-2 pl-2.5 pr-2 py-1.5 rounded-xl transition-colors ${
                      isLandingPage && !isScrolled
                        ? 'hover:bg-white/10'
                        : 'hover:bg-warm-100 dark:hover:bg-dark-surface'
                    }`}
                    aria-label="User menu"
                    aria-expanded={isProfileOpen}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-forest to-forest-light rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md shadow-forest/20">
                      {(userProfile?.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${
                      isLandingPage && !isScrolled ? 'text-white/50' : 'text-darkwood/40 dark:text-warm-500'
                    } ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        className="absolute top-full right-0 mt-2 w-60 bg-white/95 dark:bg-dark-card/95 backdrop-blur-xl rounded-xl shadow-2xl border border-warm-200/60 dark:border-dark-border/60 py-1 overflow-hidden z-[100]"
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        role="menu"
                      >
                        <div className="px-4 py-3.5 border-b border-warm-100 dark:border-dark-border bg-gradient-to-r from-forest/5 to-transparent dark:from-forest/10">
                          <p className="text-sm font-semibold text-darkwood dark:text-warm-100 truncate">
                            {userProfile?.name || 'User'}
                          </p>
                          <p className="text-xs text-darkwood/50 dark:text-warm-400 truncate mt-0.5">
                            {userProfile?.email}
                          </p>
                        </div>

                        <div className="py-1">
                          <Link
                            to="/settings"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-darkwood dark:text-warm-200 hover:bg-warm-50 dark:hover:bg-dark-surface transition-colors"
                            role="menuitem"
                          >
                            <Settings className="h-4 w-4" />
                            {t('nav.settings')}
                          </Link>
                          {!isAdmin() && (
                            <Link
                              to="/my-designs"
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-darkwood dark:text-warm-200 hover:bg-warm-50 dark:hover:bg-dark-surface transition-colors"
                              role="menuitem"
                            >
                              <FolderOpen className="h-4 w-4" />
                              {t('nav.myRoomDesigns') || 'Furniture Customization & Designs'}
                            </Link>
                          )}
                          {isAdmin() && (
                            <>
                              <Link
                                to="/designer-panel"
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-darkwood dark:text-warm-200 hover:bg-warm-50 dark:hover:bg-dark-surface transition-colors"
                                role="menuitem"
                              >
                                <Palette className="h-4 w-4" />
                                Designer Panel
                              </Link>
                              <Link
                                to="/admin"
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-forest dark:text-forest-light hover:bg-forest/5 dark:hover:bg-forest/10 transition-colors"
                                role="menuitem"
                              >
                                <Shield className="h-4 w-4" />
                                {t('nav.admin') || 'Admin Panel'}
                              </Link>
                            </>
                          )}
                        </div>

                        <div className="border-t border-warm-100 dark:border-dark-border py-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            role="menuitem"
                          >
                            <LogOut className="h-4 w-4" />
                            {t('nav.logout')}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}

            {!user && (
              <div className="flex items-center gap-2 ml-1">
                <Link
                  to="/login"
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-xl ${
                    isLandingPage && !isScrolled
                      ? 'text-white/80 hover:text-white hover:bg-white/10'
                      : 'text-darkwood dark:text-warm-200 hover:text-clay hover:bg-warm-100 dark:hover:bg-dark-surface'
                  }`}
                >
                  <User className="h-4 w-4" />
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-gradient-to-r from-clay to-clay-dark hover:from-clay-dark hover:to-clay text-white rounded-full transition-all shadow-md shadow-clay/25 hover:shadow-lg hover:shadow-clay/30 hover:scale-105"
                >
                  <UserPlus className="h-4 w-4" />
                  {t('auth.register.title') || 'Get Started'}
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl transition-colors ml-1 ${
                isLandingPage && !isScrolled
                  ? 'text-white/70 hover:text-white hover:bg-white/10'
                  : 'text-darkwood/50 dark:text-warm-400 hover:bg-warm-100 dark:hover:bg-dark-surface'
              }`}
              aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="lg:hidden border-t border-warm-200/50 dark:border-dark-border/40 bg-warm-50/95 dark:bg-dark-bg/95 backdrop-blur-xl"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 py-3 space-y-1">
              {visibleNavLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-xl text-sm font-medium transition-colors ${
                    isActive(to)
                      ? 'bg-gradient-to-r from-clay to-clay-dark text-white shadow-sm'
                      : 'text-darkwood dark:text-warm-200 hover:bg-warm-100 dark:hover:bg-dark-surface'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </Link>
              ))}

              <hr className="my-2 border-warm-200 dark:border-dark-border" />
              <div className="flex gap-2">
                <select
                  value={language}
                  onChange={(e) => handleLang(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl text-sm bg-warm-100 dark:bg-dark-surface text-darkwood dark:text-warm-200 border border-warm-200 dark:border-dark-border"
                  aria-label="Select language"
                >
                  {LANGUAGE_OPTIONS.map((l) => (
                    <option key={l.code} value={l.code}>{l.flag} - {l.name}</option>
                  ))}
                </select>
                <select
                  value={currency}
                  onChange={(e) => handleCurrency(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl text-sm bg-warm-100 dark:bg-dark-surface text-darkwood dark:text-warm-200 border border-warm-200 dark:border-dark-border"
                  aria-label="Select currency"
                >
                  {currencyList.map((c) => (
                    <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
                  ))}
                </select>
              </div>

              {user && (
                <>
                  <hr className="my-2 border-warm-200 dark:border-dark-border" />
                  {!isAdmin() && (
                    <Link to="/my-designs" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-darkwood dark:text-warm-200 hover:bg-warm-100 dark:hover:bg-dark-surface transition-colors">
                      <FolderOpen className="h-5 w-5" /> {t('nav.myRoomDesigns') || 'Furniture Customization & Designs'}
                    </Link>
                  )}
                  {isAdmin() && (
                    <>
                      <Link to="/designer-panel" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-darkwood dark:text-warm-200 hover:bg-warm-100 dark:hover:bg-dark-surface transition-colors">
                        <Palette className="h-5 w-5" /> Designer Panel
                      </Link>
                      <Link to="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-forest dark:text-forest-light hover:bg-forest/5 dark:hover:bg-forest/10 transition-colors">
                        <Shield className="h-5 w-5" /> {t('nav.admin') || 'Admin Panel'}
                      </Link>
                    </>
                  )}
                  <Link
                    to="/settings"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-darkwood dark:text-warm-200 hover:bg-warm-100 dark:hover:bg-dark-surface transition-colors"
                  >
                    <Settings className="h-5 w-5" />
                    {t('nav.settings')}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    {t('nav.logout')}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
