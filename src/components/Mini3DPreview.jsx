/**
 * Mini3DPreview — Lightweight 3D render of a furniture model.
 *
 * Uses IntersectionObserver to only mount the heavy <Canvas> when
 * the card scrolls into view, and unmounts it when it scrolls out.
 * This keeps the active WebGL context count well under the browser
 * limit (~16), eliminating "Context Lost" errors.
 *
 * Performance optimisations:
 *  - frameloop="demand" — renders only once + when props change
 *  - dpr={1} lower pixel ratio
 *  - No orbit controls (non-interactive preview)
 *  - IntersectionObserver lazy mount/unmount
 *  - powerPreference: 'low-power'
 */
import { Suspense, useState, useCallback, memo, useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
import FurnitureModel3D, { MODEL_TYPE_MAP } from './FurnitureModel3D'

/* Camera presets for different angle views */
const CAMERA_ANGLES = {
  front:   { position: [2.6, 1.8, 2.6],  fov: 36 },
  side:    { position: [3.5, 1.4, 0],     fov: 36 },
  top:     { position: [0, 4.5, 0.8],     fov: 36 },
  back:    { position: [-2.6, 1.8, -2.6], fov: 36 },
  default: { position: [2.6, 1.8, 2.6],   fov: 36 },
}

/* Tiny scene with fixed camera */
function PreviewScene({ productId, color }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 4]} intensity={1.0} castShadow />
      <directionalLight position={[-3, 3, -2]} intensity={0.3} />
      <Environment preset="apartment" />
      <ContactShadows position={[0, -0.01, 0]} opacity={0.25} scale={8} blur={2} far={4} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#f5f3f0" roughness={1} />
      </mesh>
      <FurnitureModel3D productId={productId} color={color} />
    </>
  )
}

/* Loading placeholder */
function Shimmer() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-warm-100 to-warm-50 dark:from-dark-surface dark:to-dark-card">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-clay/20 dark:border-clay/30" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-clay animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-4 h-4 text-clay" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 3 2 7l10 4 10-4-10-4z" />
            <path d="M2 17l10 4 10-4" />
            <path d="M2 12l10 4 10-4" />
          </svg>
        </div>
      </div>
    </div>
  )
}

/* ═══  Main component  ═══ */
const Mini3DPreview = memo(function Mini3DPreview({
  productId,
  color,
  angle = 'default',
  className = '',
  style,
}) {
  const [ready, setReady] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef(null)
  const cam = CAMERA_ANGLES[angle] || CAMERA_ANGLES.default
  const resolvedColor = color || '#8B6F47'

  const onCreated = useCallback(() => setReady(true), [])

  // Lazy mount: only render the Canvas when this element is in/near the viewport
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
        if (!entry.isIntersecting) setReady(false)   // reset shimmer on scroll-out
      },
      { rootMargin: '200px' }                         // pre-load 200px before visible
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`} style={style}>
      {(!ready || !isVisible) && <Shimmer />}
      {isVisible && (
        <Canvas
          camera={{ position: cam.position, fov: cam.fov, near: 0.1, far: 50 }}
          dpr={1}
          frameloop="demand"
          gl={{ antialias: true, alpha: false, powerPreference: 'low-power' }}
          shadows={false}
          onCreated={onCreated}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={null}>
            <PreviewScene productId={productId} color={resolvedColor} />
          </Suspense>
        </Canvas>
      )}
    </div>
  )
})

export default Mini3DPreview
