import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout() {
  return (
    <div className="min-h-screen bg-warm-50 dark:bg-dark-bg flex flex-col">
      {/* Skip to main content — accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:px-4 focus:py-2 focus:bg-clay focus:text-white focus:rounded-lg focus:text-sm focus:font-semibold focus:outline-none"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1" role="main" aria-label="Main content">
        <Outlet />
      </main>
      <Footer />
      <Toaster 
        position="bottom-right" 
        richColors
        toastOptions={{
          style: {
            fontFamily: 'Inter, sans-serif',
          },
        }}
      />
    </div>
  )
}