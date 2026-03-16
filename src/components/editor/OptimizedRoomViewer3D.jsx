import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { 
  OrbitControls, 
  Environment,
  ContactShadows,
  Box,
  Plane,
  Html
} from '@react-three/drei'
import useDesignStore from '@/store/useDesignStore'
import { useTranslation } from 'react-i18next'

// Performance Monitor Component
function PerformanceMonitor() {
  const [fps, setFps] = useState(60)
  const [memory, setMemory] = useState(0)
  const fpsRef = useRef({ frames: 0, time: Date.now() })

  useFrame(() => {
    fpsRef.current.frames++
    const now = Date.now()
    
    if (now - fpsRef.current.time >= 1000) {
      setFps(fpsRef.current.frames)
      fpsRef.current.frames = 0
      fpsRef.current.time = now
      
      // Memory usage (if available)
      if (performance.memory) {
        setMemory(Math.round(performance.memory.usedJSHeapSize / 1024 / 1024))
      }
    }
  })

  return (
    <Html position={[-4, 3, 0]} className="pointer-events-none">
      <div className="bg-black/50 text-white p-2 rounded text-xs font-mono">
        <div>FPS: {fps}</div>
        {memory > 0 && <div>Memory: {memory}MB</div>}
      </div>
    </Html>
  )
}

// Optimized Furniture Component
function OptimizedFurnitureItem({ item, isSelected, onClick }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current && isSelected) {
      meshRef.current.rotation.y += 0.005 // Slower rotation for better performance
    }
  })

  // Simplified geometry for better performance
  const getFurnitureGeometry = () => {
    const width = (item.scaleX || 1) * (item.width || 1)
    const height = item.height || 0.8
    const depth = (item.scaleY || 1) * (item.depth || 1)

    return (
      <group>
        <Box args={[width, height, depth]}>
          <meshStandardMaterial 
            color={item.color || '#8B6F47'}
            roughness={0.8}
            metalness={0.2}
          />
        </Box>
        
        {/* Simple label using Html for better performance */}
        {(isSelected || hovered) && (
          <Html position={[0, height + 0.5, 0]} center>
            <div className="bg-white/90 dark:bg-gray-900/90 px-2 py-1 rounded text-xs font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
              {item.name}
            </div>
          </Html>
        )}
      </group>
    )
  }

  return (
    <group
      ref={meshRef}
      position={[item.x || 0, 0, item.y || 0]}
      rotation={[0, (item.rotation || 0) * Math.PI / 180, 0]}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.(item.instanceId)
      }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {getFurnitureGeometry()}
      
      {/* Selection indicator */}
      {(isSelected || hovered) && (
        <Box 
          args={[
            (item.scaleX || 1) * (item.width || 1) + 0.1, 
            0.01, 
            (item.scaleY || 1) * (item.depth || 1) + 0.1
          ]} 
          position={[0, -0.005, 0]}
        >
          <meshStandardMaterial 
            color={isSelected ? "#3F5E45" : "#B66E41"} 
            transparent 
            opacity={0.6} 
          />
        </Box>
      )}
    </group>
  )
}

// Optimized Room Component
function OptimizedRoom({ roomSettings }) {
  const width = roomSettings?.width || 5
  const height = roomSettings?.height || 4
  const wallHeight = 2.5

  return (
    <group>
      {/* Floor */}
      <Plane 
        args={[width, height]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[width / 2, 0, height / 2]}
        receiveShadow
      >
        <meshStandardMaterial 
          color={roomSettings?.floorColor || '#D9C7B8'}
          roughness={0.8}
        />
      </Plane>

      {/* Simplified walls - only back and sides for better performance */}
      <Plane 
        args={[width, wallHeight]} 
        position={[width / 2, wallHeight / 2, 0]}
        receiveShadow
      >
        <meshStandardMaterial 
          color={roomSettings?.wallColor || '#F4EFEA'}
          roughness={0.9}
        />
      </Plane>

      <Plane 
        args={[height, wallHeight]} 
        rotation={[0, Math.PI / 2, 0]} 
        position={[width, wallHeight / 2, height / 2]}
        receiveShadow
      >
        <meshStandardMaterial 
          color={roomSettings?.wallColor || '#F4EFEA'}
          roughness={0.9}
        />
      </Plane>

      <Plane 
        args={[height, wallHeight]} 
        rotation={[0, -Math.PI / 2, 0]} 
        position={[0, wallHeight / 2, height / 2]}
        receiveShadow
      >
        <meshStandardMaterial 
          color={roomSettings?.wallColor || '#F4EFEA'}
          roughness={0.9}
        />
      </Plane>

      {/* Simplified contact shadows */}
      <ContactShadows 
        position={[width / 2, 0.01, height / 2]}
        resolution={256} // Lower resolution for better performance
        far={width}
        opacity={0.3}
        blur={1.5}
      />
    </group>
  )
}

// Optimized Camera Controller
function OptimizedCameraController() {
  const { camera } = useThree()
  const { roomWidth, roomDepth } = useDesignStore()
  
  useEffect(() => {
    const width = roomWidth || 5
    const height = roomDepth || 4
    const distance = Math.max(width, height) * 1.2

    camera.position.set(distance, distance * 0.6, distance)
    camera.lookAt(width / 2, 0, height / 2)
  }, [camera, roomWidth, roomDepth])

  return null
}

// Main Optimized Component
export default function OptimizedRoomViewer3D() {
  const { t } = useTranslation()
  const { 
    furnitureItems, 
    selectedItemId, 
    roomWidth: storeRoomWidth,
    roomDepth: storeRoomDepth,
    wallColor,
    floorColor,
    ambientLight,
    selectFurniture
  } = useDesignStore()

  // Build roomSettings for sub-components
  const roomSettings = {
    width: storeRoomWidth || 5,
    height: storeRoomDepth || 4,
    wallColor: wallColor || '#F4EFEA',
    floorColor: floorColor || '#D9C7B8',
    ambientLight: ambientLight || 0.6,
  }

  const [showPerformance, setShowPerformance] = useState(false)
  const [quality, setQuality] = useState('medium') // low, medium, high

  // Auto-adjust quality based on performance
  const [frameRate, setFrameRate] = useState(60)
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (frameRate < 25) {
        setQuality('low')
      } else if (frameRate < 45) {
        setQuality('medium')
      } else {
        setQuality('high')
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [frameRate])

  const getCanvasSettings = () => {
    switch (quality) {
      case 'low':
        return {
          antialias: false,
          powerPreference: "default",
          pixelRatio: Math.min(window.devicePixelRatio, 1),
          shadows: false
        }
      case 'high':
        return {
          antialias: true,
          powerPreference: "high-performance",
          pixelRatio: Math.min(window.devicePixelRatio, 2),
          shadows: true
        }
      case 'medium':
      default:
        return {
          antialias: true,
          powerPreference: "high-performance",
          pixelRatio: Math.min(window.devicePixelRatio, 1.5),
          shadows: true
        }
    }
  }

  const canvasSettings = getCanvasSettings()

  return (
    <div className="w-full h-full relative">
      {/* 3D Scene Info Overlay */}
      <div className="absolute top-4 left-4 z-20 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 text-sm">
        <div className="text-gray-900 dark:text-gray-100 font-medium">
          3D Room View
        </div>
        <div className="text-gray-500 dark:text-white text-xs mt-1">
          Items: {furnitureItems.length} • Quality: {quality}
        </div>
        <button
          onClick={() => setShowPerformance(!showPerformance)}
          className="text-xs text-blue-600 hover:underline"
        >
          {showPerformance ? 'Hide' : 'Show'} Performance
        </button>
      </div>

      {/* View Controls */}
      <div className="absolute top-4 right-4 z-20 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-3">
        <div className="flex flex-col space-y-2">
          <select
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
            className="text-xs px-2 py-1 rounded border"
          >
            <option value="low">Low Quality</option>
            <option value="medium">Medium Quality</option>
            <option value="high">High Quality</option>
          </select>
          
          <button
            onClick={() => {
              const width = roomSettings?.width || 5
              const height = roomSettings?.height || 4
              // Reset camera to default position
            }}
            className="px-3 py-1 text-xs bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
          >
            Reset View
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 z-20 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 text-xs text-gray-500 dark:text-white">
        <div>Mouse: Orbit • Wheel: Zoom • Click: Select • Mobile: Touch to rotate</div>
      </div>

      {/* Canvas */}
      <Canvas
        shadows={canvasSettings.shadows}
        className="w-full h-full touch-none"
        gl={canvasSettings}
      >
        <OptimizedCameraController />
        
        {/* Optimized Lighting */}
        <ambientLight intensity={roomSettings?.ambientLight || 0.6} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={0.6}
          castShadow={canvasSettings.shadows}
          shadow-mapSize={quality === 'high' ? [2048, 2048] : [1024, 1024]}
          shadow-camera-far={30}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        
        {quality === 'high' && (
          <pointLight 
            position={[(roomSettings?.width || 5) / 2, 2, (roomSettings?.height || 4) / 2]} 
            intensity={0.3} 
            color="#FFF8DC"
          />
        )}

        <Suspense fallback={null}>
          {/* Environment - only for medium/high quality */}
          {quality !== 'low' && (
            <Environment preset="apartment" background={false} />
          )}
          
          {/* Room */}
          <OptimizedRoom roomSettings={roomSettings} />

          {/* Furniture */}
          {furnitureItems.map((item) => (
            <OptimizedFurnitureItem
              key={item.instanceId}
              item={item}
              isSelected={selectedItemId === item.instanceId}
              onClick={selectFurniture}
            />
          ))}

          {/* Performance Monitor */}
          {showPerformance && <PerformanceMonitor />}

          {/* Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={20}
            maxPolarAngle={Math.PI / 2.2}
            target={[
              (roomSettings?.width || 5) / 2, 
              0, 
              (roomSettings?.height || 4) / 2
            ]}
            touchAction="none"
            enableDamping={quality !== 'low'}
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}