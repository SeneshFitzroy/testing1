import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '@/store/useAuthStore'
import { Loader2 } from 'lucide-react'

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading, isAdmin, isDesignerOnly } = useAuthStore()
  const location = useLocation()

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50 dark:bg-dark-bg">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-clay" />
          <p className="text-darkwood dark:text-white">Loading...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, redirect to dashboard (/) — never force login page after splash/setup
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  // If admin required but user is not admin, redirect appropriately
  if (requireAdmin && !isAdmin()) {
    return <Navigate to={isDesignerOnly() ? '/designer-panel' : '/shop'} replace />
  }

  // User is authenticated (and admin if required), render children
  return children
}