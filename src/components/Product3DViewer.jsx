import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCw, Maximize2, Minimize2, Package } from 'lucide-react'

/**
 * Product3DViewer — Interactive 3D product image viewer
 *
 * Features:
 *  • Parallax 3D tilt on mouse hover (rotateX + rotateY)
 *  • Drag left/right to rotate between gallery views
 *  • Auto-rotate toggle (cycles views)
 *  • Fullscreen mode (Esc to close)
 *  • Color-change overlay (mix-blend-mode: color)
 *  • Dynamic lighting & shadow that shift with tilt
 *  • Rotation dot indicator + "drag to rotate" hint
 */
export default function Product3DViewer({
  images = [],
  name = '',
  selectedColor,
  defaultColor,
  originalPrice,
  price,
  discountPercent,
  currentView: externalView,
  onViewChange,
}) {
  const containerRef = useRef(null)
  const [internalView, setInternalView] = useState(0)
  const currentView = externalView ?? internalView
  const setCurrentView = onViewChange ?? setInternalView

  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [isAutoRotating, setIsAutoRotating] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showHint, setShowHint] = useState(true)
  const [loaded, setLoaded] = useState({})

  const dragRef = useRef({ startX: 0, startView: 0 })
  const autoRef = useRef(null)
  const viewCount = images.length || 1

  // Show color overlay when a non-default color is selected
  const showOverlay = selectedColor && defaultColor && selectedColor !== defaultColor

  /* -------- parallax tilt on hover -------- */
  const handleMouseMove = useCallback(
    (e) => {
      if (isDragging) return
      const r = containerRef.current?.getBoundingClientRect()
      if (!r) return
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      setTilt({ x: y * -18, y: x * 18 })
    },
    [isDragging],
  )
  const handleMouseLeave = useCallback(() => {
    if (!isDragging) setTilt({ x: 0, y: 0 })
  }, [isDragging])

  /* -------- drag to rotate between views -------- */
  const handlePointerDown = useCallback(
    (e) => {
      setIsDragging(true)
      setIsAutoRotating(false)
      setShowHint(false)
      const cx = e.clientX ?? e.touches?.[0]?.clientX ?? 0
      dragRef.current = { startX: cx, startView: currentView }
      e.preventDefault?.()
    },
    [currentView],
  )

  const handlePointerMove = useCallback(
    (e) => {
      if (!isDragging) return
      const cx = e.clientX ?? e.touches?.[0]?.clientX ?? 0
      const r = containerRef.current?.getBoundingClientRect()
      if (!r) return
      const delta = cx - dragRef.current.startX
      const shift = Math.round(delta / (r.width / viewCount))
      const nv = ((dragRef.current.startView - shift) % viewCount + viewCount) % viewCount
      if (nv !== currentView) setCurrentView(nv)
      // live tilt while dragging
      setTilt({ x: 0, y: Math.max(-22, Math.min(22, (delta / r.width) * 60)) })
    },
    [isDragging, currentView, viewCount, setCurrentView],
  )

  const handlePointerUp = useCallback(() => {
    setIsDragging(false)
    setTilt({ x: 0, y: 0 })
  }, [])

  /* -------- auto-rotate -------- */
  useEffect(() => {
    if (!isAutoRotating) {
      if (autoRef.current) clearInterval(autoRef.current)
      return
    }
    autoRef.current = setInterval(() => {
      setCurrentView((prev) => (prev + 1) % viewCount)
    }, 1400)
    return () => clearInterval(autoRef.current)
  }, [isAutoRotating, viewCount, setCurrentView])

  /* -------- global drag listeners -------- */
  useEffect(() => {
    if (!isDragging) return
    const mv = (e) => handlePointerMove(e)
    const up = () => handlePointerUp()
    window.addEventListener('pointermove', mv)
    window.addEventListener('pointerup', up)
    window.addEventListener('touchmove', mv, { passive: false })
    window.addEventListener('touchend', up)
    return () => {
      window.removeEventListener('pointermove', mv)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('touchmove', mv)
      window.removeEventListener('touchend', up)
    }
  }, [isDragging, handlePointerMove, handlePointerUp])

  /* -------- auto-hide hint after 4 s -------- */
  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 4000)
    return () => clearTimeout(t)
  }, [])

  /* -------- Esc closes fullscreen + lock body scroll -------- */
  useEffect(() => {
    if (!isFullscreen) return
    document.body.style.overflow = 'hidden'
    const fn = (e) => e.key === 'Escape' && setIsFullscreen(false)
    window.addEventListener('keydown', fn)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', fn)
    }
  }, [isFullscreen])

  /* -------- computed helpers -------- */
  const lightAngle = 135 + tilt.y * 2
  const shadowX = -tilt.y * 0.8

  /* ================================================================ */
  /*  viewer JSX (shared between inline & fullscreen)                 */
  /* ================================================================ */
  const viewer = (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-2xl select-none ${
        isFullscreen ? 'w-[80vmin] h-[80vmin]' : 'aspect-square'
      } bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onPointerDown={handlePointerDown}
      onTouchStart={handlePointerDown}
      style={{ perspective: '1000px', cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* ---------- 3D-transformed image ---------- */}
      <motion.div
        className="w-full h-full relative"
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
          scale: isDragging ? 1.02 : 1,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30, mass: 0.5 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Image with cross-fade between views */}
        <AnimatePresence mode="wait">
          {images[currentView] ? (
            <motion.img
              key={currentView}
              src={images[currentView]}
              alt={`${name} — View ${currentView + 1}`}
              className="w-full h-full object-cover absolute inset-0"
              draggable={false}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35 }}
              onLoad={() => setLoaded((p) => ({ ...p, [currentView]: true }))}
              onError={(e) => {
                e.target.src = `https://placehold.co/800x800/e2e8f0/64748b?text=${encodeURIComponent(name)}`
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="h-20 w-20 text-gray-300 dark:text-gray-600" />
            </div>
          )}
        </AnimatePresence>

        {/* Color-change overlay */}
        <AnimatePresence>
          {showOverlay && (
            <motion.div
              key={selectedColor}
              className="absolute inset-0 pointer-events-none z-10"
              style={{ backgroundColor: selectedColor, mixBlendMode: 'color' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            />
          )}
        </AnimatePresence>

        {/* Dynamic lighting gradient */}
        <div
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            background: `linear-gradient(${lightAngle}deg, rgba(255,255,255,${
              0.07 + Math.abs(tilt.y) * 0.004
            }) 0%, transparent 55%, rgba(0,0,0,${
              0.03 + Math.abs(tilt.y) * 0.003
            }) 100%)`,
          }}
        />
      </motion.div>

      {/* ---------- 3D shadow beneath ---------- */}
      <div
        className="absolute -bottom-2 left-[10%] right-[10%] h-6 rounded-[50%] blur-xl -z-10 transition-all duration-300"
        style={{
          background: 'rgba(0,0,0,0.12)',
          transform: `translateX(${shadowX}px) scaleX(${1 - Math.abs(tilt.y) * 0.004})`,
        }}
      />

      {/* Shimmer while image loads */}
      {!loaded[currentView] && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse z-[5]" />
      )}

      {/* --------- 3D BADGE --------- */}
      <div className="absolute top-3 left-3 z-30">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold tracking-widest shadow-lg flex items-center gap-1.5">
          {/* Cube icon */}
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3 2 7l10 4 10-4-10-4z" />
            <path d="M2 17l10 4 10-4" />
            <path d="M2 12l10 4 10-4" />
          </svg>
          3D VIEW
        </div>
      </div>

      {/* --------- Sale badge — use discountPercent when available for sync across pages --------- */}
      {((discountPercent != null && discountPercent > 0) || (originalPrice && price && originalPrice > price)) && (
        <div className="absolute top-3 right-16 z-30">
          <span className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg">
            {discountPercent != null ? discountPercent : Math.round((1 - price / originalPrice) * 100)}% OFF
          </span>
        </div>
      )}

      {/* --------- Drag hint --------- */}
      <AnimatePresence>
        {showHint && !isDragging && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-black/60 backdrop-blur-sm rounded-full px-5 py-2.5 flex items-center gap-3 text-white text-sm font-medium shadow-xl">
              <RotateCw className="h-4 w-4 animate-spin" style={{ animationDuration: '3s' }} />
              Drag to rotate &bull; Hover for 3D
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --------- View indicator dots --------- */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30">
        <div className="flex gap-1.5 bg-black/30 backdrop-blur-sm rounded-full px-2.5 py-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation()
                setCurrentView(i)
              }}
              className={`rounded-full transition-all duration-300 ${
                i === currentView
                  ? 'bg-white w-5 h-2'
                  : 'bg-white/40 w-2 h-2 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>

      {/* --------- Controls --------- */}
      <div className="absolute top-14 right-3 flex flex-col gap-2 z-30">
        <motion.button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation()
            setIsAutoRotating((p) => !p)
          }}
          className={`p-2 rounded-full backdrop-blur-sm shadow-md transition-colors ${
            isAutoRotating
              ? 'bg-blue-600 text-white'
              : 'bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-white hover:bg-white dark:hover:bg-gray-800'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Auto-rotate"
        >
          <RotateCw
            className={`h-4 w-4 ${isAutoRotating ? 'animate-spin' : ''}`}
            style={isAutoRotating ? { animationDuration: '2s' } : {}}
          />
        </motion.button>

        <motion.button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation()
            setIsFullscreen((p) => !p)
          }}
          className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full backdrop-blur-sm shadow-md text-gray-700 dark:text-white hover:bg-white dark:hover:bg-gray-800"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Fullscreen"
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </motion.button>
      </div>
    </div>
  )

  /* -------- fullscreen portal wrapper -------- */
  if (isFullscreen) {
    return (
      <motion.div
        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsFullscreen(false)}
      >
        <div onClick={(e) => e.stopPropagation()}>{viewer}</div>
      </motion.div>
    )
  }

  return viewer
}
