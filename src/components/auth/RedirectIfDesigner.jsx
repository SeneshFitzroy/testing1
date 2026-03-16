import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '@/store/useAuthStore'

/**
 * When a designer-only user visits / or /shop (or /shop/*), redirect to Designer Panel.
 * Designers should not see the home page or shop — only designer tools.
 * Waits for auth to finish loading to avoid race conditions (e.g. redirect→login flash).
 */
export default function RedirectIfDesigner({ children }) {
  const location = useLocation()
  const user = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)
  const isDesignerOnly = useAuthStore((s) => s.isDesignerOnly)

  const shouldRedirect =
    location.pathname === '/' ||
    location.pathname === '/shop' ||
    location.pathname.startsWith('/shop/') ||
    location.pathname === '/cart' ||
    location.pathname === '/checkout' ||
    location.pathname === '/meet-designer'

  // Only redirect when auth has finished loading to prevent flash/redirect loops
  if (!loading && user && isDesignerOnly() && shouldRedirect) {
    return <Navigate to="/designer-panel" replace />
  }

  return children
}
