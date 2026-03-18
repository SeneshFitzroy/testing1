/**
 * ARFurnitureViewer — Export furniture to GLB and display in model-viewer for AR "View in your space".
 * Always shows the actual furniture. If procedural export fails, creates a minimal furniture-shaped
 * placeholder (box) with the product color — never shows unrelated models.
 */
import { useEffect, useRef, useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import FurnitureModel3D from './FurnitureModel3D'
import { X } from 'lucide-react'
import ARLogoIcon from './ARLogoIcon'

/** Parse "220 x 95 x 82 cm" -> { w, d, h } in meters */
function parseDimensions(str) {
  if (!str || typeof str !== 'string') return { w: 1, d: 0.8, h: 0.8 }
  const nums = str.match(/\d+(?:\.\d+)?/g)
  if (!nums || nums.length < 3) return { w: 1, d: 0.8, h: 0.8 }
  const w = Math.min(8, Math.max(0.3, parseFloat(nums[0]) / 100))
  const d = Math.min(8, Math.max(0.2, parseFloat(nums[1]) / 100))
  const h = Math.min(3, Math.max(0.2, parseFloat(nums[2]) / 100))
  return { w, d, h }
}

function exportSimpleFurniturePlaceholder(color, onGlbReady, dimensionsStr = '') {
  const { w, d, h } = parseDimensions(dimensionsStr)
  const geo = new THREE.BoxGeometry(w, h, d)
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0 })
  const mesh = new THREE.Mesh(geo, mat)
  const scene = new THREE.Scene()
  scene.add(mesh)
  const exporter = new GLTFExporter()
  exporter.parse(scene, (result) => {
    const blob = new Blob([result], { type: 'model/gltf-binary' })
    onGlbReady(URL.createObjectURL(blob))
  }, () => {}, { binary: true })
  geo.dispose()
  mat.dispose()
}

function ExportScene({ modelType, productId, color, onGlbReady, dimensions }) {
  const groupRef = useRef(null)
  const doneRef = useRef(false)

  useEffect(() => {
    if (doneRef.current) return
    let cancelled = false
    const dimensionsStr = dimensions || ''
    const doPlaceholder = () => {
      if (cancelled) return
      exportSimpleFurniturePlaceholder(color, (url) => onGlbReady(url, true), dimensionsStr)
    }
    const runExport = () => {
      if (cancelled) return
      if (!groupRef.current) {
        requestAnimationFrame(runExport)
        return
      }
      doneRef.current = true
      try {
        const group = groupRef.current
        const clone = group.clone(true)
        clone.traverse((child) => {
          if (child.isMesh && child.geometry) {
            child.geometry = child.geometry.clone()
            if (child.material?.clone) child.material = child.material.clone()
          }
        })
        const scene = new THREE.Scene()
        scene.add(clone)
        const exporter = new GLTFExporter()
        exporter.parse(
          scene,
          (result) => {
            if (cancelled) return
            const blob = new Blob([result], { type: 'model/gltf-binary' })
            onGlbReady(URL.createObjectURL(blob), false)
          },
          doPlaceholder,
          { binary: true }
        )
      } catch (err) {
        doPlaceholder()
      }
    }
    const t = setTimeout(runExport, 800)
    return () => { cancelled = true; clearTimeout(t) }
  }, [modelType, productId, color, onGlbReady, dimensions])

  return (
    <group ref={groupRef}>
      <FurnitureModel3D type={modelType} productId={productId} color={color} />
    </group>
  )
}

export default function ARFurnitureViewer({ productId, modelType, color, productName, dimensions, onClose }) {
  const [glbUrl, setGlbUrl] = useState(null)
  const [error, setError] = useState(null)
  const [usingPlaceholder, setUsingPlaceholder] = useState(false)
  const [modelViewerReady, setModelViewerReady] = useState(false)
  const [retryKey, setRetryKey] = useState(0)
  const urlRef = useRef(null)

  useEffect(() => {
    if (customElements?.get?.('model-viewer')) {
      setModelViewerReady(true)
      return
    }
    const existing = document.querySelector('script[src*="model-viewer"]')
    if (!existing) {
      const s = document.createElement('script')
      s.type = 'module'
      s.src = 'https://cdn.jsdelivr.net/npm/@google/model-viewer@3.4.0/dist/model-viewer.min.js'
      document.head.appendChild(s)
    }
    const check = setInterval(() => {
      if (customElements?.get?.('model-viewer')) { setModelViewerReady(true); clearInterval(check) }
    }, 200)
    const timeout = setTimeout(() => { setModelViewerReady(true); clearInterval(check) }, 5000)
    return () => { clearInterval(check); clearTimeout(timeout) }
  }, [])

  const handleGlbReady = useCallback((url, isPlaceholder = false) => {
    urlRef.current = url
    setGlbUrl(url)
    setError(null)
    setUsingPlaceholder(isPlaceholder)
  }, [])

  const handleRetry = useCallback(() => {
    if (urlRef.current?.startsWith('blob:')) URL.revokeObjectURL(urlRef.current)
    urlRef.current = null
    setGlbUrl(null)
    setError(null)
    setUsingPlaceholder(false)
    setRetryKey((k) => k + 1)
  }, [])

  useEffect(() => {
    return () => {
      const url = urlRef.current
      if (url && url.startsWith('blob:')) URL.revokeObjectURL(url)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-white dark:bg-dark-bg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-warm-200 dark:border-dark-border shrink-0">
        <h2 className="text-lg font-bold text-darkwood dark:text-white">{productName} — View in AR</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-warm-100 dark:hover:bg-dark-surface text-darkwood dark:text-white"
          aria-label="Close AR view"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Hidden canvas for export — off-screen render; key forces remount on retry */}
        <div key={retryKey} className="absolute left-[-9999px] top-0 w-1 h-1 overflow-hidden">
          <Canvas gl={{ antialias: false }} camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={1} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <ExportScene
              modelType={modelType}
              productId={productId}
              color={color}
              onGlbReady={handleGlbReady}
              dimensions={dimensions}
            />
          </Canvas>
        </div>

        {error && (
          <div className="p-4 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {!glbUrl && !error && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-clay/30 border-t-clay rounded-full animate-spin mx-auto mb-4" />
              <p className="text-darkwood dark:text-white font-medium">Preparing 3D model for AR...</p>
              <p className="text-sm text-darkwood/60 dark:text-white/70 mt-1">Exporting furniture</p>
            </div>
          </div>
        )}

        {glbUrl && modelViewerReady && (
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="flex-1 min-h-0 relative">
              <model-viewer
                src={glbUrl}
                ar
                ar-modes="webxr scene-viewer quick-look"
                camera-controls
                touch-action="pan-y"
                style={{ width: '100%', height: '100%', minHeight: '400px' }}
                alt={productName}
                ar-scale="fixed"
                environment-image="neutral"
              >
                <button
                  slot="ar-button"
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-forest text-white font-semibold rounded-xl shadow-lg hover:bg-forest-light transition-colors flex items-center gap-2"
                >
                  <ARLogoIcon className="h-8 w-8" invert />
                  View in your space
                </button>
              </model-viewer>
            </div>
            <div className="p-4 border-t border-warm-200 dark:border-dark-border bg-warm-50 dark:bg-dark-card">
              {usingPlaceholder && (
                <p className="text-sm text-amber-700 dark:text-amber-300 text-center mb-2">
                  Simplified preview — full 3D export unavailable. Your product color is preserved. <button type="button" onClick={handleRetry} className="underline font-medium">Retry</button>
                </p>
              )}
              <p className="text-sm text-darkwood/80 dark:text-white/90 text-center">
                <strong>Tap &quot;View in your space&quot;</strong> to place {productName} in your room using your phone camera.
              </p>
              <p className="text-xs text-darkwood/50 dark:text-white/70 text-center mt-2">
                Works on iOS 12+ (Quick Look) and Android 8+ (ARCore). Best on mobile.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
