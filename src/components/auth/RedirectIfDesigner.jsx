import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '@/store/useAuthStore'

/**
 * When a designer-only user visits / or /shop (or /shop/*), redirect to Designer Panel.
 * Designers should not see the home page or shop — only designer tools.
 */
export default function RedirectIfDesigner({ children }) {
  const location = useLocation()
  const user = useAuthStore((s) => s.user)
  const isDesignerOnly = useAuthStore((s) => s.isDesignerOnly)

  const shouldRedirect =
    location.pathname === '/' ||
    location.pathname === '/shop' ||
    location.pathname.startsWith('/shop/') ||
    location.pathname === '/cart' ||
    location.pathname === '/checkout' ||
    location.pathname === '/meet-designer'

  if (user && isDesignerOnly() && shouldRedirect) {
    return <Navigate to="/designer-panel" replace />
  }

  return children
}
