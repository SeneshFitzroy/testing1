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
import * as THREE from 'three'
import useDesignStore from '@/store/useDesignStore'
import { useTranslation } from 'react-i18next'

// Floor plane for 3D drag raycasting
const FLOOR_PLANE = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
const INTERSECTION = new THREE.Vector3()

// Furniture Component
function FurnitureItem({ item, isSelected, onClick }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const setDragging3D = useDesignStore((s) => s.setDragging3D)
  const readOnlyMode = useDesignStore((s) => s.readOnlyMode)

  useFrame((state) => {
    if (meshRef.current && isSelected) {
      meshRef.current.rotation.y += 0.01
    }
  })

  // Generate simple geometry based on furniture type
  const getFurnitureGeometry = () => {
    const width = (item.scaleX || 1) * (item.width || 1)
    const height = item.height || 0.8
    const depth = (item.scaleY || 1) * (item.depth || 1)

    switch (item.category) {
      case 'seating':
        return (
          <group>
            {/* Seat */}
            <Box 
              args={[width, 0.1, depth]} 
              position={[0, height * 0.6, 0]}
            >
              <meshStandardMaterial color={item.color || '#8B6F47'} />
            </Box>
            {/* Backrest */}
            <Box 
              args={[width, height * 0.6, 0.1]} 
              position={[0, height * 0.8, -depth * 0.45]}
            >
              <meshStandardMaterial color={item.color || '#8B6F47'} />
            </Box>
            {/* Legs */}
            {[
              [-width * 0.4, 0, -depth * 0.4],
              [width * 0.4, 0, -depth * 0.4],
              [-width * 0.4, 0, depth * 0.4],
              [width * 0.4, 0, depth * 0.4]
            ].map((pos, i) => (
              <Box key={i} args={[0.05, height * 0.6, 0.05]} position={[pos[0], height * 0.3, pos[2]]}>
                <meshStandardMaterial color="#4A2F21" />
              </Box>
            ))}
          </group>
        )
      
      case 'tables':
        return (
          <group>
            {/* Table top */}
            <Box 
              args={[width, 0.08, depth]} 
              position={[0, height - 0.04, 0]}
            >
              <meshStandardMaterial color={item.color || '#8B6F47'} />
            </Box>
            {/* Legs */}
            {[
              [-width * 0.45, 0, -depth * 0.45],
              [width * 0.45, 0, -depth * 0.45],
              [-width * 0.45, 0, depth * 0.45],
              [width * 0.45, 0, depth * 0.45]
            ].map((pos, i) => (
              <Box key={i} args={[0.06, height - 0.08, 0.06]} position={[pos[0], (height - 0.08) / 2, pos[2]]}>
                <meshStandardMaterial color="#4A2F21" />
              </Box>
            ))}
          </group>
        )

      case 'storage':
        return (
          <Box args={[width, height, depth]}>
            <meshStandardMaterial color={item.color || '#8B6F47'} />
          </Box>
        )

      case 'beds':
        return (
          <group>
            {/* Mattress */}
            <Box 
              args={[width, 0.3, depth]} 
              position={[0, height * 0.6, 0]}
            >
              <meshStandardMaterial color={item.color || '#F4EFEA'} />
            </Box>
            {/* Bed frame */}
            <Box 
              args={[width + 0.1, 0.3, depth + 0.1]} 
              position={[0, height * 0.4, 0]}
            >
              <meshStandardMaterial color="#4A2F21" />
            </Box>
            {/* Headboard */}
            <Box 
              args={[width, height * 0.6, 0.1]} 
              position={[0, height * 0.7, -depth * 0.55]}
            >
              <meshStandardMaterial color={item.color || '#8B6F47'} />
            </Box>
          </group>
        )

      case 'lighting':
        return (
          <group>
            {item.name.toLowerCase().includes('table') ? (
              // Table lamp
              <group>
                <Box args={[0.15, 0.05, 0.15]} position={[0, 0.025, 0]}>
                  <meshStandardMaterial color="#4A2F21" />
                </Box>
                <Box args={[0.03, 0.4, 0.03]} position={[0, 0.225, 0]}>
                  <meshStandardMaterial color="#4A2F21" />
                </Box>
                <Box args={[0.3, 0.2, 0.3]} position={[0, 0.5, 0]}>
                  <meshStandardMaterial color={item.color || '#F4EFEA'} transparent opacity={0.8} />
                </Box>
              </group>
            ) : (
              // Floor lamp
              <group>
                <Box args={[0.2, 0.05, 0.2]} position={[0, 0.025, 0]}>
                  <meshStandardMaterial color="#4A2F21" />
                </Box>
                <Box args={[0.03, height * 0.8, 0.03]} position={[0, height * 0.4, 0]}>
                  <meshStandardMaterial color="#4A2F21" />
                </Box>
                <Box args={[0.4, 0.3, 0.4]} position={[0, height * 0.85, 0]}>
                  <meshStandardMaterial color={item.color || '#F4EFEA'} transparent opacity={0.8} />
                </Box>
              </group>
            )}
          </group>
        )

      case 'decor':
        return (
          <group>
            {item.name.toLowerCase().includes('plant') ? (
              // Plant
              <group>
                <Box args={[0.25, 0.3, 0.25]} position={[0, 0.15, 0]}>
                  <meshStandardMaterial color="#8B6F47" />
                </Box>
                <Box args={[0.6, 0.8, 0.6]} position={[0, 0.7, 0]}>
                  <meshStandardMaterial color="#3F5E45" />
                </Box>
              </group>
            ) : (
              // Generic decor
              <Box args={[width, height, depth]}>
                <meshStandardMaterial color={item.color || '#B66E41'} />
              </Box>
            )}
          </group>
        )

      default:
        return (
          <Box args={[width, height, depth]}>
            <meshStandardMaterial 
              color={item.color || '#8B6F47'}
              roughness={0.8}
              metalness={0.2}
            />
          </Box>
        )
    }
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
      onPointerDown={(e) => {
        if (!readOnlyMode && isSelected) {
          e.stopPropagation()
          setDragging3D(true)
        }
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

      {/* Item label */}
      {(isSelected || hovered) && (
        <Html position={[0, (item.height || 0.8) + 0.3, 0]} center>
          <div className="bg-white/90 dark:bg-gray-900/90 px-2 py-1 rounded text-xs font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap shadow-sm">
            {item.name}
          </div>
        </Html>
      )}
    </group>
  )
}

// Room Component
function Room({ roomSettings }) {
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

      {/* Walls */}
      {/* Back wall */}
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

      {/* Right wall */}
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

      {/* Left wall */}
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

      {/* Front wall (partial for visibility) */}
      <group>
        <Plane 
          args={[width * 0.3, wallHeight]} 
          position={[width * 0.15, wallHeight / 2, height]}
          receiveShadow
        >
          <meshStandardMaterial 
            color={roomSettings?.wallColor || '#F4EFEA'}
            roughness={0.9}
          />
        </Plane>
        <Plane 
          args={[width * 0.3, wallHeight]} 
          position={[width * 0.85, wallHeight / 2, height]}
          receiveShadow
        >
          <meshStandardMaterial 
            color={roomSettings?.wallColor || '#F4EFEA'}
            roughness={0.9}
          />
        </Plane>
      </group>

      {/* Contact shadows */}
      <ContactShadows 
        position={[width / 2, 0.01, height / 2]}
        resolution={512}
        far={width}
        opacity={0.4}
        blur={2}
      />
    </group>
  )
}

// Camera Controller — frame room fully (avoid cut-off)
function CameraController() {
  const { camera } = useThree()
  const { roomWidth, roomDepth } = useDesignStore()

  useEffect(() => {
    const width = roomWidth || 5
    const height = roomDepth || 4
    const distance = Math.max(width, height) * 0.9

    camera.position.set(distance, distance * 0.7, distance)
    camera.lookAt(width / 2, 0, height / 2)
  }, [camera, roomWidth, roomDepth])

  return null
}

// Reset camera helper (called from Reset View button)
function useResetCamera() {
  const { camera } = useThree()
  const { roomWidth, roomDepth } = useDesignStore()
  return () => {
    const width = roomWidth || 5
    const height = roomDepth || 4
    const distance = Math.max(width, height) * 0.9
    camera.position.set(distance, distance * 0.7, distance)
    camera.lookAt(width / 2, 0, height / 2)
  }
}

// Invisible floor mesh for 3D drag — raycast on pointer move
function FloorDragPlane({ roomSettings, onDrag, onDragEnd }) {
  const meshRef = useRef()
  const { gl, camera, raycaster, pointer } = useThree()
  const dragging = useDesignStore((s) => s.dragging3D)
  const selectedId = useDesignStore((s) => s.selectedItemId)
  const setDragging = useDesignStore((s) => s.setDragging3D)
  const readOnlyMode = useDesignStore((s) => s.readOnlyMode)

  const w = roomSettings?.width || 5
  const h = roomSettings?.height || 4

  useEffect(() => {
    if (readOnlyMode || !dragging || !selectedId) return
    const onMove = (e) => {
      if (!meshRef.current) return
      const rect = gl.domElement.getBoundingClientRect()
      pointer.x = (e.clientX - rect.left) / rect.width * 2 - 1
      pointer.y = -(e.clientY - rect.top) / rect.height * 2 + 1
      raycaster.setFromCamera(pointer, camera)
      const hits = raycaster.intersectObject(meshRef.current)
      if (hits.length > 0) {
        const p = hits[0].point
        const x = Math.max(0, Math.min(w - 0.5, p.x))
        const z = Math.max(0, Math.min(h - 0.5, p.z))
        onDrag(selectedId, x, z)
      }
    }
    const onUp = () => {
      setDragging(false)
      onDragEnd?.()
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [readOnlyMode, dragging, selectedId, gl, camera, raycaster, pointer, w, h, onDrag, onDragEnd, setDragging])

  return (
    <mesh
      ref={meshRef}
      position={[w / 2, 0, h / 2]}
      rotation={[-Math.PI / 2, 0, 0]}
      visible={false}
    >
      <planeGeometry args={[w * 2, h * 2]} />
    </mesh>
  )
}

// Loading Component
function LoadingSpinner() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <div className="text-gray-900 dark:text-gray-100 font-medium">
          Loading 3D View...
        </div>
      </div>
    </div>
  )
}

// Reset camera when Reset View is clicked
function ResetCameraHandler() {
  const orbitRef = useRef()
  const reset3DViewRequest = useDesignStore((s) => s.reset3DViewRequest)
  useEffect(() => {
    if (reset3DViewRequest > 0 && orbitRef.current?.reset) orbitRef.current.reset()
  }, [reset3DViewRequest])
  return <OrbitControls ref={orbitRef} enablePan enableZoom enableRotate={!useDesignStore.getState().dragging3D}
    minDistance={2} maxDistance={20} maxPolarAngle={Math.PI / 2.2}
    target={[(useDesignStore.getState().roomWidth || 5) / 2, 0, (useDesignStore.getState().roomDepth || 4) / 2]} />
}

// Main Component
export default function RoomViewer3D() {
  const { t } = useTranslation()
  const { 
    furnitureItems, 
    selectedItemId, 
    roomWidth: storeRoomWidth,
    roomDepth: storeRoomDepth,
    wallColor,
    floorColor,
    ambientLight,
    sunlightDirection,
    selectFurniture
  } = useDesignStore()

  // Build roomSettings for sub-components
  const roomSettings = {
    width: storeRoomWidth || 5,
    height: storeRoomDepth || 4,
    wallColor: wallColor || '#F4EFEA',
    floorColor: floorColor || '#D9C7B8',
    ambientLight: ambientLight || 0.6,
    sunlightDirection: sunlightDirection || 'top-left',
  }

  const [cameraPosition, setCameraPosition] = useState([5, 4, 5])
  const [showWireframe, setShowWireframe] = useState(false)

  // Sunlight position from direction (realistic angles)
  const w = roomSettings?.width || 5
  const d = roomSettings?.height || 4
  const dist = Math.max(w, d) * 2.5
  const sunPosMap = {
    'top-left': [-dist, dist * 0.9, -dist],
    'top-right': [dist, dist * 0.9, -dist],
    'bottom-left': [-dist, dist * 0.9, dist],
    'bottom-right': [dist, dist * 0.9, dist],
    overhead: [w / 2, dist * 1.2, d / 2],
  }
  const sunPos = sunPosMap[roomSettings?.sunlightDirection || 'top-left'] || sunPosMap['top-left']

  return (
    <div className="w-full h-full relative">
      {/* 3D Scene Info + Controls — top-left, always visible with high contrast */}
      <div className="absolute top-4 left-4 z-[60] flex flex-col gap-2 pointer-events-auto">
        <div className="bg-white dark:bg-gray-900 backdrop-blur-md rounded-xl p-3 text-sm border-2 border-warm-200 dark:border-dark-border shadow-xl">
          <div className="text-gray-900 dark:text-gray-100 font-semibold">3D Room View</div>
          <div className="text-gray-500 dark:text-white text-xs mt-1">Items: {furnitureItems.length} · Selected: {selectedItemId ? 'Yes' : 'None'}</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowWireframe(!showWireframe)}
            className={`px-4 py-2.5 text-sm font-semibold rounded-xl shadow-lg transition-all whitespace-nowrap border-2 ${
              showWireframe
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-dark-card text-darkwood dark:text-white border-darkwood/30 dark:border-dark-border hover:border-clay'
            }`}
            title="Toggle wireframe mode"
          >
            Wireframe
          </button>
          <button
            onClick={() => useDesignStore.getState().requestReset3DView?.()}
            className="px-4 py-2.5 text-sm font-semibold bg-clay text-white rounded-xl shadow-lg hover:bg-clay-dark transition-all whitespace-nowrap border-2 border-clay-dark"
            title="Reset camera to default angle"
          >
            Reset View
          </button>
        </div>
      </div>

      {/* Rotation indicator — visible overlay so users know they can rotate */}
      <div className="absolute bottom-4 right-4 z-[60] bg-clay/95 dark:bg-clay/90 backdrop-blur-md rounded-xl px-4 py-3 flex items-center gap-3 shadow-xl border-2 border-white/30">
        <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center">
          <svg className="w-6 h-6 text-white animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <div>
          <div className="text-white font-semibold text-sm">Drag to rotate</div>
          <div className="text-white/80 text-xs">Orbit the 3D view with mouse</div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 z-[60] bg-white dark:bg-gray-900 backdrop-blur-md rounded-xl p-3 text-xs text-gray-600 dark:text-white border-2 border-warm-200 dark:border-dark-border shadow-lg">
        <div>Orbit: drag · Zoom: wheel · Select: click · <span className="font-medium text-clay">Move: select item, then drag</span></div>
      </div>

      {/* Canvas */}
      <Canvas
        shadows
        className="w-full h-full"
        gl={{ 
          antialias: true, 
          alpha: false,
          preserveDrawingBuffer: true,
          powerPreference: "high-performance",
          pixelRatio: Math.min(window.devicePixelRatio, 2)
        }}
        dpr={Math.min(window.devicePixelRatio, 2)}
      >
        <CameraController />
        
        {/* Lighting */}
        <ambientLight intensity={roomSettings?.ambientLight || 0.6} color="#FFFBF5" />
        <directionalLight
          position={sunPos}
          intensity={1.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={50}
          shadow-camera-left={-w}
          shadow-camera-right={w}
          shadow-camera-top={d}
          shadow-camera-bottom={-d}
          color="#FFF8E7"
        />
        <pointLight 
          position={[(roomSettings?.width || 5) / 2, 2, (roomSettings?.height || 4) / 2]} 
          intensity={0.5} 
          color="#FFF8DC"
        />

        <Suspense fallback={null}>
          {/* Environment */}
          <Environment preset="apartment" background={false} />
          
          {/* Room */}
          <Room roomSettings={roomSettings} />

          {/* Invisible floor plane for 3D drag raycast */}
          <FloorDragPlane
            roomSettings={roomSettings}
            onDrag={(id, x, z) => useDesignStore.getState().updateFurniturePosition(id, x, z)}
            onDragEnd={() => useDesignStore.getState().commitFurnitureUpdate()}
          />

          {/* Furniture */}
          {furnitureItems.map((item) => (
            <FurnitureItem
              key={item.instanceId}
              item={item}
              isSelected={selectedItemId === item.instanceId}
              onClick={selectFurniture}
            />
          ))}

          {/* OrbitControls + Reset handler */}
          <ResetCameraHandler roomSettings={roomSettings} />
        </Suspense>
      </Canvas>
    </div>
  )
}