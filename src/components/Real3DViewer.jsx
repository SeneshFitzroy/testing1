/**
 * Real3DViewer — Full WebGL 3D product viewer powered by React Three Fiber.
 *
 * Features
 *  • True 360° orbit rotation (mouse drag / touch)
 *  • Scroll / pinch to zoom
 *  • Real-time material color changes on the 3D model
 *  • Auto-rotate toggle
 *  • Zoom via scroll/pinch (no maximize)
 *  • Professional studio lighting + environment reflections
 *  • Contact shadows on ground plane
 *  • Loading state with shimmer
 */
import { Suspense, useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Center } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCw, Move3D, Hand, ZoomIn } from 'lucide-react'
import FurnitureModel3D from './FurnitureModel3D'

/* ─── Preset angle map: front | side | top | back → [azimuthal, polar] ─── */
const PRESET_ANGLES = {
  front: [0, 0.6],
  side: [Math.PI / 2, 0.6],
  top: [0, 0.1],
  back: [Math.PI, 0.6],
}

/* ─── Three.js Scene (runs inside Canvas) ─── */
function Scene({ modelType, productId, color, autoRotate, presetAngle }) {
  const controlsRef = useRef(null)

  useEffect(() => {
    if (!presetAngle) return
    const preset = PRESET_ANGLES[presetAngle.toLowerCase()]
    if (!preset) return

    const applyPreset = () => {
      if (controlsRef.current?.setAzimuthalAngle) {
        controlsRef.current.setAzimuthalAngle(preset[0])
        controlsRef.current.setPolarAngle(preset[1])
        return true
      }
      return false
    }

    if (!applyPreset()) {
      const t = setTimeout(() => applyPreset(), 100)
      return () => clearTimeout(t)
    }
  }, [presetAngle])

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
      />
      <directionalLight position={[-4, 4, -3]} intensity={0.4} />
      <pointLight position={[0, 4, 3]} intensity={0.3} color="#FFF5E6" />

      {/* Environment map for realistic reflections */}
      <Environment preset="apartment" />

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#f5f3f0" roughness={1} />
      </mesh>

      {/* Soft contact shadow */}
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.35}
        scale={12}
        blur={2.5}
        far={4}
        color="#000000"
      />

      {/* 3D Furniture Model */}
      <group position={[0, 0, 0]}>
        <FurnitureModel3D type={modelType} productId={productId} color={color} />
      </group>

      {/* Orbit controls */}
      <OrbitControls
        ref={controlsRef}
        autoRotate={autoRotate}
        autoRotateSpeed={1.8}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={1.2}
        maxDistance={7}
        minPolarAngle={0.15}
        maxPolarAngle={Math.PI / 2 - 0.05}
        target={[0, 0.55, 0]}
        enableDamping
        dampingFactor={0.08}
      />
    </>
  )
}

/* ─── Loading fallback shown inside Canvas while scene loads ─── */
function SceneLoader() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshBasicMaterial color="#e2e8f0" wireframe />
    </mesh>
  )
}

/* ─── HTML shimmer overlay while Canvas initialises ─── */
function LoadingOverlay() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl">
      <div className="relative w-20 h-20 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-800" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3 2 7l10 4 10-4-10-4z" />
            <path d="M2 17l10 4 10-4" />
            <path d="M2 12l10 4 10-4" />
          </svg>
        </div>
      </div>
      <p className="text-sm font-medium text-gray-600 dark:text-white">Loading 3D Model...</p>
    </div>
  )
}

/* ═══════════════════════════════════════
   MAIN EXPORTED COMPONENT
   ═══════════════════════════════════════ */
export default function Real3DViewer({
  productId,
  modelType = 'sofa',
  color = '#8B6F47',
  name = '',
  originalPrice,
  price,
  discountPercent,
  presetAngle,
}) {
  const [autoRotate, setAutoRotate] = useState(true)
  const [canvasReady, setCanvasReady] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)
  const containerRef = useRef(null)

  // Hide instructions after 5s
  useEffect(() => {
    const t = setTimeout(() => setShowInstructions(false), 5000)
    return () => clearTimeout(t)
  }, [])

  /* ── viewer content ── */
  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-2xl select-none aspect-square w-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700"
    >
      {/* Loading overlay — hides once canvas fires onCreated */}
      {!canvasReady && <LoadingOverlay />}

      {/* Three.js Canvas */}
      <Canvas
        camera={{ position: [2.8, 2.2, 3.2], fov: 38, near: 0.1, far: 100 }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
        onCreated={() => setCanvasReady(true)}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={<SceneLoader />}>
          <Scene
            modelType={modelType}
            productId={productId}
            color={color}
            autoRotate={autoRotate}
            presetAngle={presetAngle}
          />
        </Suspense>
      </Canvas>

      {/* ─── 3D BADGE ─── */}
      <div className="absolute top-3 left-3 z-20">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold tracking-widest shadow-lg flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3 2 7l10 4 10-4-10-4z" />
            <path d="M2 17l10 4 10-4" />
            <path d="M2 12l10 4 10-4" />
          </svg>
          REAL 3D
        </div>
      </div>

      {/* ─── Sale badge — uses discountPercent for 100% sync across pages ─── */}
      {(discountPercent != null || (originalPrice && price && originalPrice > price)) && (
        <div className="absolute top-3 right-16 z-20">
          <span className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg">
            {discountPercent != null ? discountPercent : Math.round((1 - price / originalPrice) * 100)}% OFF
          </span>
        </div>
      )}

      {/* ─── Instructions overlay ─── */}
      <AnimatePresence>
        {showInstructions && canvasReady && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-black/60 backdrop-blur-sm rounded-2xl px-6 py-4 text-white text-center shadow-xl max-w-xs">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Move3D className="h-5 w-5" />
                <span className="font-semibold">Interactive 3D Model</span>
              </div>
              <div className="text-xs space-y-1 text-gray-200">
                <p><Hand className="inline h-3 w-3 -mt-0.5 mr-1" />Drag to rotate 360°</p>
                <p><ZoomIn className="inline h-3 w-3 -mt-0.5 mr-1" />Scroll to zoom in/out</p>
                <p>Right-drag to pan</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Control buttons (no maximize - zoom via scroll only) ─── */}
      <div className="absolute top-14 right-3 flex flex-col gap-2 z-20">
        <motion.button
          onClick={() => setAutoRotate((p) => !p)}
          className={`p-2.5 rounded-full backdrop-blur-sm shadow-md transition-colors ${
            autoRotate
              ? 'bg-[#5C3A2A] text-white'
              : 'bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-white hover:bg-white dark:hover:bg-gray-800'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Toggle auto-rotate"
        >
          <RotateCw className={`h-4 w-4 ${autoRotate ? 'animate-spin' : ''}`} style={autoRotate ? { animationDuration: '2.5s' } : {}} />
        </motion.button>
      </div>

      {/* ─── Lee Roo Watermark ─── */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none opacity-40">
        <span className="text-[10px] font-semibold text-[#5C3A2A] tracking-widest">LEE ROO · WOOD DESIGNS</span>
      </div>

      {/* ─── Bottom info bar ─── */}
      <div className="absolute bottom-3 left-3 right-3 z-20">
        <div className="flex justify-between items-center">
          <div className="bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5 text-white text-[10px] font-medium flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            360° Interactive
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5 text-white text-[10px] font-medium">
            Drag • Scroll • Pinch
          </div>
        </div>
      </div>
    </div>
  )
}
