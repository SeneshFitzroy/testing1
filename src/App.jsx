import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import useAuthStore from './store/useAuthStore'
import useThemeStore from './store/useThemeStore'
import useCartStore from './store/useCartStore'
import { useEffect, useState, useRef, lazy, Suspense } from 'react'
import { seedProductsToFirestore } from './lib/seedProducts'
import { seedDemoDesignsToFirestore } from './lib/designService'
import { ensureDefaultAccounts } from './lib/setupAdmin'
import SplashScreen from './components/SplashScreen'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import RedirectIfDesigner from './components/auth/RedirectIfDesigner'
import AudioManager from './components/AudioManager'
import AccessibilityToggle from './components/AccessibilityToggle'
import RegionModal from './components/RegionModal'
import JustInTimePopup from './components/JustInTimePopup'
import CookieConsent from './components/CookieConsent'

const Landing = lazy(() => import('./pages/Landing'))
const Login = lazy(() => import('./pages/Login'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const Register = lazy(() => import('./pages/Register'))
const RoomEditor = lazy(() => import('./pages/RoomEditor'))
const MyDesigns = lazy(() => import('./pages/MyDesigns'))
const Shop = lazy(() => import('./pages/Shop'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Cart = lazy(() => import('./pages/Cart'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const Checkout = lazy(() => import('./pages/Checkout'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const AdminProducts = lazy(() => import('./pages/AdminProducts'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const Settings = lazy(() => import('./pages/Settings'))
const MeetDesigner = lazy(() => import('./pages/MeetDesigner'))
const DesignerPanel = lazy(() => import('./pages/DesignerPanel'))
const TrackDelivery = lazy(() => import('./pages/TrackDelivery'))
const SharedDesignView = lazy(() => import('./pages/SharedDesignView'))
const WoodInfo = lazy(() => import('./pages/WoodInfo'))

// Preload critical pages so navigation is instant
const preloadPages = () => { import('./pages/Shop'); import('./pages/ProductDetail'); import('./pages/Cart') }
setTimeout(preloadPages, 1000)

/** Redirect /dashboard: designers → designer-panel, others → shop */
function DashboardRedirect() {
  const isDesignerOnly = useAuthStore((s) => s.isDesignerOnly)
  return <Navigate to={isDesignerOnly() ? '/designer-panel' : '/shop'} replace />
}

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center" role="status" aria-label="Loading page">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-warm-200 dark:border-dark-border" />
          <div className="absolute inset-0 rounded-full border-2 border-clay border-t-transparent animate-spin" />
        </div>
        <p className="text-sm text-darkwood/40 dark:text-white font-medium">Loading...</p>
      </div>
    </div>
  )
}

const AUTH_PAGES = ['/login', '/register', '/forgot-password', '/admin/login']

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const { darkMode } = useThemeStore()
  const initAuth = useAuthStore((s) => s.initAuth)
  const user = useAuthStore((s) => s.user)
  const loadFromFirestore = useCartStore((s) => s.loadFromFirestore)
  const setUid = useCartStore((s) => s.setUid)
  const pathname = (location.pathname || '/').replace(/\/$/, '') || '/'
  const skipSplash = AUTH_PAGES.includes(pathname) || pathname.startsWith('/shared/')
  const [showSplash, setShowSplash] = useState(!skipSplash)
  const splashJustCompleted = useRef(false)

  // Scroll to top on every route change for snappy navigation feel
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  // Never show splash on auth pages (direct visit or navigation to /login, etc.)
  useEffect(() => {
    if (skipSplash) setShowSplash(false)
  }, [skipSplash])

  // Safeguard: after splash, if we ever land on auth page within 3s, force back to dashboard
  useEffect(() => {
    if (!splashJustCompleted.current) return
    if (AUTH_PAGES.includes(pathname)) {
      navigate('/', { replace: true })
    }
  }, [pathname, navigate])

  useEffect(() => {
    if (!showSplash && splashJustCompleted.current) {
      const t = setTimeout(() => { splashJustCompleted.current = false }, 3000)
      return () => clearTimeout(t)
    }
  }, [showSplash])

  useEffect(() => {
    import('./pages/Landing')
  }, [])

  useEffect(() => {
    initAuth()
  }, [initAuth])

  useEffect(() => {
    if (user?.uid) {
      loadFromFirestore(user.uid)
    } else {
      setUid(null)
    }
  }, [user?.uid])

  // Defer default account provisioning so it doesn't interfere with auth init or splash.
  // Runs after splash + delay; failures (e.g. 403) won't disrupt UX.
  useEffect(() => {
    const t = setTimeout(() => {
      ensureDefaultAccounts()
        .then(() => initAuth())
        .catch(() => {})
    }, 5000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const sync = async () => {
      try {
        await seedProductsToFirestore()
        await seedDemoDesignsToFirestore()
      } catch (err) {
        console.error('[App] Seed failed:', err)
      }
    }
    sync()
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return (
    <div className={darkMode ? 'dark' : ''}>
      {showSplash && !skipSplash && (
        <SplashScreen
          onComplete={() => {
            splashJustCompleted.current = true
            setShowSplash(false)
            // Don't redirect away from shared design links — stay on /shared/:id
            const path = location.pathname || '/'
            if (!path.startsWith('/shared/')) {
              setTimeout(() => navigate('/', { replace: true }), 0)
            }
          }}
        />
      )}

      <Toaster
        position="top-right"
        theme={darkMode ? 'dark' : 'light'}
        richColors
        toastOptions={{
          style: {
            fontFamily: 'DM Sans, system-ui, sans-serif',
            background: darkMode ? '#1f2937' : undefined,
            color: darkMode ? '#f9fafb' : undefined,
            border: darkMode ? '1px solid rgba(255,255,255,0.1)' : undefined,
          },
        }}
      />

      {/* Cookie consent first (required before personalization) */}
      {!showSplash && <CookieConsent />}
      {/* Region Modal (permission-style: language & currency) */}
      {!showSplash && <RegionModal />}
      {/* Just in Time — sale/newsletter popup (shows after cookie response) */}
      {!showSplash && <JustInTimePopup />}

      {/* Audio starts during splash so it auto-plays 100% */}
      <AudioManager />
      {!showSplash && <AccessibilityToggle />}

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/shared/:designId" element={<SharedDesignView />} />

          <Route element={<Layout />}>
            <Route path="/" element={<RedirectIfDesigner><Landing /></RedirectIfDesigner>} />
            <Route path="/shop" element={<RedirectIfDesigner><Shop /></RedirectIfDesigner>} />
            <Route path="/shop/:productId" element={<RedirectIfDesigner><ProductDetail /></RedirectIfDesigner>} />
            <Route path="/cart" element={<RedirectIfDesigner><Cart /></RedirectIfDesigner>} />
            <Route path="/track-delivery" element={<RedirectIfDesigner><TrackDelivery /></RedirectIfDesigner>} />
            <Route path="/wood/:woodSlug" element={<RedirectIfDesigner><WoodInfo /></RedirectIfDesigner>} />
          </Route>

          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/editor" element={<RoomEditor />} />
            <Route path="/editor/:designId" element={<RoomEditor />} />
            <Route path="/my-designs" element={<MyDesigns />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<RedirectIfDesigner><Checkout /></RedirectIfDesigner>} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/meet-designer" element={<RedirectIfDesigner><MeetDesigner /></RedirectIfDesigner>} />
            <Route path="/designer-panel" element={<DesignerPanel />} />
          </Route>

          <Route element={<ProtectedRoute requireAdmin><Layout /></ProtectedRoute>}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
          </Route>

          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
