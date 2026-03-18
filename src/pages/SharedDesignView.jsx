/**
 * Public view-only page for shared designs — Figma-style public link.
 * No login required. Clients see the design presentation, not the editor.
 */
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, LayoutGrid, Layers, ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import useDesignStore from '@/store/useDesignStore'
import { fetchDesignById } from '@/lib/designService'
import RoomCanvas2D from '@/components/editor/RoomCanvas2D'
import RoomViewer3D from '@/components/editor/RoomViewer3D'

export default function SharedDesignView() {
  const { designId } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('3d') // 2d | 3d
  const loadDesign = useDesignStore((s) => s.loadDesign)
  const setReadOnlyMode = useDesignStore((s) => s.setReadOnlyMode)

  useEffect(() => {
    if (!designId) {
      setError('Invalid link')
      setLoading(false)
      return
    }

    const load = async () => {
      setLoading(true)
      setError(null)
      setReadOnlyMode(true)
      try {
        const design = await fetchDesignById(designId)
        if (!design) {
          setError('Design not found or link has expired')
          setLoading(false)
          return
        }
        loadDesign(design)
      } catch (err) {
        console.error('Shared design load failed:', err)
        setError('Could not load design')
      } finally {
        setLoading(false)
      }
    }

    load()
    return () => setReadOnlyMode(false)
  }, [designId, loadDesign, setReadOnlyMode])

  const designName = useDesignStore((s) => s.currentDesign?.name)
  const furnitureItems = useDesignStore((s) => s.furnitureItems)
  const roomWidth = useDesignStore((s) => s.roomWidth)
  const roomDepth = useDesignStore((s) => s.roomDepth)

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-warm-50 to-warm-100 dark:from-dark-bg dark:to-dark-surface">
        <Loader2 className="h-12 w-12 animate-spin text-clay mb-4" />
        <p className="text-darkwood dark:text-white font-medium">Loading shared design...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-warm-50 to-warm-100 dark:from-dark-bg dark:to-dark-surface px-4">
        <div className="max-w-md text-center">
          <AlertCircle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-darkwood dark:text-white mb-2">Design not found</h1>
          <p className="text-darkwood/70 dark:text-white mb-6">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-clay hover:bg-clay-dark text-white font-semibold rounded-xl transition-colors"
          >
            Go to Home <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-warm-50 dark:bg-dark-bg">
      {/* Header — minimal, brand + design name + view toggle */}
      <header className="flex-shrink-0 border-b border-warm-200 dark:border-dark-border bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 text-darkwood dark:text-white font-display font-bold text-lg sm:text-xl hover:opacity-80 shrink-0">
            Lee Roo Wood Designs
          </Link>
          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 sm:gap-3">
            <h2 className="text-base sm:text-lg font-semibold text-darkwood dark:text-white truncate max-w-[180px] sm:max-w-none">
              {designName || 'Shared Design'}
            </h2>
            <span className="text-xs text-darkwood/50 dark:text-white px-2 py-1 rounded-lg bg-warm-100 dark:bg-dark-surface shrink-0">
              View only
            </span>
            <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setViewMode('2d')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                viewMode === '2d'
                  ? 'bg-clay text-white'
                  : 'bg-warm-100 dark:bg-dark-surface text-darkwood dark:text-white hover:bg-warm-200 dark:hover:bg-dark-border'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              2D Plan
            </button>
            <button
              onClick={() => setViewMode('3d')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                viewMode === '3d'
                  ? 'bg-clay text-white'
                  : 'bg-warm-100 dark:bg-dark-surface text-darkwood dark:text-white hover:bg-warm-200 dark:hover:bg-dark-border'
              }`}
            >
              <Layers className="h-4 w-4" />
              3D View
            </button>
            </div>
          </div>
        </div>
      </header>

      {/* Design info bar */}
      <div className="flex-shrink-0 px-4 py-2 bg-white/50 dark:bg-dark-card/50 border-b border-warm-200/50 dark:border-dark-border/50">
        <div className="max-w-[1600px] mx-auto flex items-center gap-4 text-sm text-darkwood/70 dark:text-white">
          <span>Room: {roomWidth || 5}m × {roomDepth || 4}m</span>
          <span>Items: {furnitureItems?.length || 0}</span>
        </div>
      </div>

      {/* Viewer area */}
      <main className="flex-1 min-h-0 relative">
        <motion.div
          key={viewMode}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {viewMode === '2d' && <RoomCanvas2D />}
          {viewMode === '3d' && <RoomViewer3D />}
        </motion.div>
      </main>

      {/* Footer CTA */}
      <footer className="flex-shrink-0 border-t border-warm-200 dark:border-dark-border bg-white/80 dark:bg-dark-card/80 py-4 px-4">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-darkwood/60 dark:text-white">
            Shared by your designer — view only. Create your own design?
          </p>
          <Link
            to="/editor"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-clay hover:bg-clay-dark text-white font-semibold rounded-xl text-sm transition-colors"
          >
            <Eye className="h-4 w-4" />
            Start designing
          </Link>
        </div>
      </footer>
    </div>
  )
}
