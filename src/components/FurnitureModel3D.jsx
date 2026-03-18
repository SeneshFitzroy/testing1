/**
 * FurnitureModel3D — Procedural 3D furniture models built from Three.js geometry.
 *
 * Each product gets a unique, recognisable model rendered in WebGL.
 * The `color` prop updates the primary material in real-time so users
 * can preview different finishes / upholstery colours.
 */
import { useMemo } from 'react'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

/* ───────── reusable micro-components ───────── */

function Bx({ s, p = [0, 0, 0], rot, color, roughness = 0.5, metalness = 0 }) {
  return (
    <mesh position={p} rotation={rot} castShadow receiveShadow>
      <boxGeometry args={s} />
      <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
    </mesh>
  )
}

function Cy({ a, p = [0, 0, 0], rot, color, roughness = 0.5, metalness = 0 }) {
  return (
    <mesh position={p} rotation={rot} castShadow receiveShadow>
      <cylinderGeometry args={a} />
      <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
    </mesh>
  )
}

function Sp({ a, p = [0, 0, 0], color, roughness = 0.4, metalness = 0, transparent, opacity }) {
  return (
    <mesh position={p} castShadow receiveShadow>
      <sphereGeometry args={a} />
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
        transparent={transparent}
        opacity={opacity}
      />
    </mesh>
  )
}

function RB({ s, p = [0, 0, 0], rad = 0.04, color, roughness = 0.85, metalness = 0 }) {
  return (
    <RoundedBox args={s} radius={rad} smoothness={4} position={p} castShadow receiveShadow>
      <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
    </RoundedBox>
  )
}

const BRASS = '#B8860B'
const CHROME = '#C0C0C0'
const BLK_METAL = '#1a1a1a'
const DARK_WOOD = '#3E2723'
const MARBLE = '#E8E0D8'

/* ═══════════════════════════════════════════════
   1. SOFA — sp-1 (Velvet) & sp-12 (Chesterfield)
   ═══════════════════════════════════════════════ */
function SofaModel({ color }) {
  return (
    <group>
      {/* seat base */}
      <RB s={[2.1, 0.14, 0.88]} p={[0, 0.24, 0]} color={color} />
      {/* seat cushions (3) */}
      {[-0.62, 0, 0.62].map((x, i) => (
        <RB key={i} s={[0.6, 0.16, 0.68]} p={[x, 0.4, 0.05]} rad={0.06} color={color} roughness={0.92} />
      ))}
      {/* back frame */}
      <RB s={[1.9, 0.5, 0.14]} p={[0, 0.67, -0.36]} rad={0.05} color={color} />
      {/* back cushions (3) */}
      {[-0.55, 0, 0.55].map((x, i) => (
        <RB key={`bc${i}`} s={[0.5, 0.36, 0.13]} p={[x, 0.65, -0.22]} rad={0.05} color={color} roughness={0.94} />
      ))}
      {/* left arm */}
      <RB s={[0.16, 0.34, 0.82]} p={[-0.97, 0.5, 0]} rad={0.06} color={color} />
      {/* right arm */}
      <RB s={[0.16, 0.34, 0.82]} p={[0.97, 0.5, 0]} rad={0.06} color={color} />
      {/* legs (brass) */}
      {[[-0.88, 0.075, -0.36], [0.88, 0.075, -0.36], [-0.88, 0.075, 0.36], [0.88, 0.075, 0.36]].map((pos, i) => (
        <Cy key={i} a={[0.024, 0.02, 0.15, 8]} p={pos} color={BRASS} metalness={0.7} roughness={0.25} />
      ))}
    </group>
  )
}

/* ═══════════════════════════════
   2. DINING CHAIR — sp-2
   ═══════════════════════════════ */
function DiningChairModel({ color }) {
  const legColor = color
  return (
    <group>
      {/* seat */}
      <RB s={[0.44, 0.05, 0.42]} p={[0, 0.44, 0]} rad={0.02} color={color} roughness={0.5} />
      {/* seat cushion */}
      <RB s={[0.38, 0.04, 0.36]} p={[0, 0.49, 0]} rad={0.02} color={color} roughness={0.9} />
      {/* back frame */}
      <Bx s={[0.42, 0.04, 0.025]} p={[0, 0.82, -0.19]} color={legColor} roughness={0.45} />
      <Bx s={[0.42, 0.04, 0.025]} p={[0, 0.62, -0.19]} color={legColor} roughness={0.45} />
      {/* spindles */}
      {[-0.14, -0.07, 0, 0.07, 0.14].map((x, i) => (
        <Cy key={i} a={[0.012, 0.012, 0.2, 6]} p={[x, 0.72, -0.19]} color={legColor} roughness={0.45} />
      ))}
      {/* back legs (extend up) */}
      <Cy a={[0.018, 0.016, 0.86, 8]} p={[-0.18, 0.43, -0.18]} color={legColor} roughness={0.45} />
      <Cy a={[0.018, 0.016, 0.86, 8]} p={[0.18, 0.43, -0.18]} color={legColor} roughness={0.45} />
      {/* front legs */}
      <Cy a={[0.018, 0.016, 0.44, 8]} p={[-0.18, 0.22, 0.17]} color={legColor} roughness={0.45} />
      <Cy a={[0.018, 0.016, 0.44, 8]} p={[0.18, 0.22, 0.17]} color={legColor} roughness={0.45} />
    </group>
  )
}

/* ═══════════════════════════════════
   3. OVAL COFFEE TABLE — sp-3
   ═══════════════════════════════════ */
function CoffeeTableModel({ color }) {
  return (
    <group>
      {/* oval top (stretched cylinder) */}
      <mesh position={[0, 0.44, 0]} scale={[1.6, 1, 1]} castShadow receiveShadow>
        <cylinderGeometry args={[0.38, 0.38, 0.04, 32]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      {/* lower shelf */}
      <mesh position={[0, 0.16, 0]} scale={[1.4, 1, 1]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.025, 32]} />
        <meshStandardMaterial color={color} roughness={0.45} />
      </mesh>
      {/* hairpin legs (4 sets) */}
      {[
        [-0.38, 0, -0.2], [0.38, 0, -0.2],
        [-0.38, 0, 0.2], [0.38, 0, 0.2],
      ].map((pos, i) => (
        <group key={i} position={pos}>
          <Cy a={[0.008, 0.008, 0.44, 6]} p={[-0.02, 0.22, 0]} color={BLK_METAL} metalness={0.6} roughness={0.3} />
          <Cy a={[0.008, 0.008, 0.44, 6]} p={[0.02, 0.22, 0]} color={BLK_METAL} metalness={0.6} roughness={0.3} />
        </group>
      ))}
    </group>
  )
}

/* ═══════════════════════════════════
   4. PLATFORM BED — sp-4
   ═══════════════════════════════════ */
function BedModel({ color }) {
  return (
    <group>
      {/* frame */}
      <Bx s={[1.8, 0.12, 1.95]} p={[0, 0.18, 0]} color={DARK_WOOD} roughness={0.5} />
      {/* mattress */}
      <RB s={[1.7, 0.22, 1.85]} p={[0, 0.38, 0.02]} rad={0.06} color={color} roughness={0.92} />
      {/* headboard */}
      <RB s={[1.8, 0.85, 0.08]} p={[0, 0.72, -0.94]} rad={0.03} color={color} roughness={0.88} />
      {/* headboard channel tufting (horizontal lines) */}
      {[0.42, 0.58, 0.74, 0.9].map((y, i) => (
        <Bx key={i} s={[1.65, 0.008, 0.09]} p={[0, y, -0.898]} color={color} roughness={0.95} />
      ))}
      {/* pillows (2) */}
      {[-0.42, 0.42].map((x, i) => (
        <RB key={`pl${i}`} s={[0.52, 0.14, 0.35]} p={[x, 0.56, -0.62]} rad={0.06} color={'#FFFFFF'} roughness={0.95} />
      ))}
      {/* legs */}
      {[[-0.82, 0.06, -0.9], [0.82, 0.06, -0.9], [-0.82, 0.06, 0.9], [0.82, 0.06, 0.9]].map((pos, i) => (
        <Cy key={i} a={[0.03, 0.025, 0.12, 8]} p={pos} color={DARK_WOOD} roughness={0.45} />
      ))}
    </group>
  )
}

/* ═══════════════════════════════════
   5. BOOKSHELF — sp-5
   ═══════════════════════════════════ */
function BookshelfModel({ color }) {
  const shelfCount = 5
  return (
    <group>
      {/* left upright (iron) */}
      <Bx s={[0.04, 1.8, 0.3]} p={[-0.38, 0.9, 0]} color={BLK_METAL} metalness={0.5} roughness={0.35} />
      {/* right upright */}
      <Bx s={[0.04, 1.8, 0.3]} p={[0.38, 0.9, 0]} color={BLK_METAL} metalness={0.5} roughness={0.35} />
      {/* shelves (wood) */}
      {Array.from({ length: shelfCount }, (_, i) => {
        const y = 0.06 + i * 0.36
        return (
          <Bx key={i} s={[0.72, 0.035, 0.3]} p={[0, y, 0]} color={color} roughness={0.5} />
        )
      })}
      {/* top shelf */}
      <Bx s={[0.72, 0.035, 0.3]} p={[0, 1.8, 0]} color={color} roughness={0.5} />
      {/* decorative books on shelf 3 */}
      {[
        { x: -0.2, w: 0.06, h: 0.22, c: '#4A90D9' },
        { x: -0.1, w: 0.05, h: 0.2, c: '#D94A4A' },
        { x: 0.0, w: 0.07, h: 0.24, c: '#4AD97A' },
        { x: 0.12, w: 0.05, h: 0.19, c: '#D9C74A' },
      ].map((b, i) => (
        <Bx key={`bk${i}`} s={[b.w, b.h, 0.2]} p={[b.x, 0.82 + b.h / 2, 0]} color={b.c} roughness={0.7} />
      ))}
    </group>
  )
}

/* ═══════════════════════════════════
   6. ARC FLOOR LAMP — sp-6
   ═══════════════════════════════════ */
function FloorLampModel({ color }) {
  return (
    <group>
      {/* marble base */}
      <Cy a={[0.22, 0.22, 0.04, 32]} p={[0, 0.02, 0]} color={MARBLE} roughness={0.3} metalness={0.1} />
      {/* vertical pole */}
      <Cy a={[0.015, 0.015, 1.3, 8]} p={[0, 0.67, 0]} color={color} metalness={0.65} roughness={0.25} />
      {/* arc section (angled cylinder) */}
      <Cy a={[0.015, 0.015, 0.6, 8]} p={[0.22, 1.3, 0]} rot={[0, 0, 0.7]} color={color} metalness={0.65} roughness={0.25} />
      {/* shade (drum) */}
      <mesh position={[0.48, 1.42, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.2, 0.22, 24, 1, true]} />
        <meshStandardMaterial color="#F5F0E6" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      {/* shade top cap */}
      <Cy a={[0.18, 0.18, 0.01, 24]} p={[0.48, 1.53, 0]} color="#F5F0E6" roughness={0.9} />
      {/* bulb glow */}
      <Sp a={[0.06, 12, 12]} p={[0.48, 1.42, 0]} color="#FFF8E1" roughness={0.1} />
    </group>
  )
}

/* ═══════════════════════════════════
   7. TV CONSOLE — sp-7
   ═══════════════════════════════════ */
function TVConsoleModel({ color }) {
  return (
    <group>
      {/* main body */}
      <Bx s={[1.4, 0.38, 0.36]} p={[0, 0.3, 0]} color={color} roughness={0.45} />
      {/* top surface (slightly wider) */}
      <Bx s={[1.44, 0.025, 0.38]} p={[0, 0.5, 0]} color={color} roughness={0.4} />
      {/* left door */}
      <Bx s={[0.4, 0.32, 0.015]} p={[-0.38, 0.29, 0.183]} color={color} roughness={0.42} />
      {/* right door */}
      <Bx s={[0.4, 0.32, 0.015]} p={[0.38, 0.29, 0.183]} color={color} roughness={0.42} />
      {/* center open shelf */}
      <Bx s={[0.38, 0.16, 0.34]} p={[0, 0.2, 0]} color={'#1a1a1a'} roughness={0.9} />
      {/* door handles */}
      <Cy a={[0.008, 0.008, 0.06, 6]} p={[-0.2, 0.29, 0.2]} rot={[Math.PI / 2, 0, 0]} color={BRASS} metalness={0.7} roughness={0.2} />
      <Cy a={[0.008, 0.008, 0.06, 6]} p={[0.2, 0.29, 0.2]} rot={[Math.PI / 2, 0, 0]} color={BRASS} metalness={0.7} roughness={0.2} />
      {/* legs */}
      {[[-0.62, 0.05, -0.14], [0.62, 0.05, -0.14], [-0.62, 0.05, 0.14], [0.62, 0.05, 0.14]].map((pos, i) => (
        <Cy key={i} a={[0.02, 0.018, 0.1, 8]} p={pos} color={DARK_WOOD} roughness={0.45} />
      ))}
    </group>
  )
}

/* ═══════════════════════════════════
   8. WINGBACK ACCENT CHAIR — sp-8
   ═══════════════════════════════════ */
function AccentChairModel({ color }) {
  return (
    <group>
      {/* seat */}
      <RB s={[0.62, 0.1, 0.58]} p={[0, 0.42, 0.02]} rad={0.04} color={color} />
      {/* seat cushion */}
      <RB s={[0.56, 0.1, 0.5]} p={[0, 0.52, 0.02]} rad={0.04} color={color} roughness={0.92} />
      {/* back */}
      <RB s={[0.6, 0.62, 0.1]} p={[0, 0.78, -0.24]} rad={0.04} color={color} />
      {/* left wing */}
      <RB s={[0.08, 0.45, 0.36]} p={[-0.32, 0.68, -0.08]} rad={0.03} color={color} />
      {/* right wing */}
      <RB s={[0.08, 0.45, 0.36]} p={[0.32, 0.68, -0.08]} rad={0.03} color={color} />
      {/* legs (walnut) */}
      {[[-0.22, 0.17, -0.2], [0.22, 0.17, -0.2], [-0.22, 0.17, 0.22], [0.22, 0.17, 0.22]].map((pos, i) => (
        <Cy key={i} a={[0.02, 0.016, 0.34, 8]} p={pos} color={DARK_WOOD} roughness={0.4} />
      ))}
    </group>
  )
}

/* ═══════════════════════════════════
   9. FARMHOUSE DINING TABLE — sp-9
   ═══════════════════════════════════ */
function DiningTableModel({ color }) {
  return (
    <group>
      {/* table top */}
      <RB s={[1.65, 0.06, 0.82]} p={[0, 0.74, 0]} rad={0.02} color={color} roughness={0.4} />
      {/* breadboard ends */}
      <Bx s={[0.05, 0.07, 0.84]} p={[-0.85, 0.74, 0]} color={color} roughness={0.42} />
      <Bx s={[0.05, 0.07, 0.84]} p={[0.85, 0.74, 0]} color={color} roughness={0.42} />
      {/* turned legs — each is a stack of cylinders for a turned look */}
      {[[-0.7, 0, -0.32], [0.7, 0, -0.32], [-0.7, 0, 0.32], [0.7, 0, 0.32]].map((base, i) => (
        <group key={i} position={base}>
          <Cy a={[0.04, 0.035, 0.2, 10]} p={[0, 0.1, 0]} color={color} roughness={0.42} />
          <Cy a={[0.05, 0.04, 0.08, 10]} p={[0, 0.24, 0]} color={color} roughness={0.42} />
          <Cy a={[0.035, 0.035, 0.24, 10]} p={[0, 0.42, 0]} color={color} roughness={0.42} />
          <Cy a={[0.05, 0.04, 0.06, 10]} p={[0, 0.57, 0]} color={color} roughness={0.42} />
          <Cy a={[0.04, 0.04, 0.1, 10]} p={[0, 0.66, 0]} color={color} roughness={0.42} />
        </group>
      ))}
      {/* stretcher rails between legs */}
      <Cy a={[0.015, 0.015, 1.2, 6]} p={[0, 0.18, -0.32]} rot={[0, 0, Math.PI / 2]} color={color} roughness={0.42} />
      <Cy a={[0.015, 0.015, 1.2, 6]} p={[0, 0.18, 0.32]} rot={[0, 0, Math.PI / 2]} color={color} roughness={0.42} />
    </group>
  )
}

/* ═══════════════════════════════════
   10. NIGHTSTAND — sp-10
   ═══════════════════════════════════ */
function NightstandModel({ color }) {
  return (
    <group>
      {/* body */}
      <RB s={[0.42, 0.34, 0.36]} p={[0, 0.42, 0]} rad={0.02} color={color} roughness={0.45} />
      {/* top */}
      <Bx s={[0.44, 0.025, 0.38]} p={[0, 0.6, 0]} color={color} roughness={0.4} />
      {/* drawer face */}
      <Bx s={[0.38, 0.12, 0.015]} p={[0, 0.48, 0.18]} color={color} roughness={0.42} />
      {/* drawer knob */}
      <Cy a={[0.015, 0.015, 0.03, 8]} p={[0, 0.48, 0.2]} rot={[Math.PI / 2, 0, 0]} color={BRASS} metalness={0.65} roughness={0.25} />
      {/* open cubby (dark interior) */}
      <Bx s={[0.36, 0.14, 0.32]} p={[0, 0.32, 0.02]} color={'#2a1a10'} roughness={0.9} />
      {/* tapered legs */}
      {[[-0.16, 0.1, -0.14], [0.16, 0.1, -0.14], [-0.16, 0.1, 0.14], [0.16, 0.1, 0.14]].map((pos, i) => (
        <Cy key={i} a={[0.018, 0.013, 0.2, 8]} p={pos} color={color} roughness={0.4} />
      ))}
    </group>
  )
}

/* ═══════════════════════════════════
   11. CHESTERFIELD SOFA — sp-12
   ═══════════════════════════════════ */
function ChesterfieldModel({ color }) {
  return (
    <group>
      {/* base frame */}
      <RB s={[2.2, 0.12, 0.9]} p={[0, 0.2, 0]} color={color} roughness={0.45} />
      {/* seat cushion (single piece, leather) */}
      <RB s={[1.9, 0.16, 0.72]} p={[0, 0.38, 0.04]} rad={0.06} color={color} roughness={0.48} />
      {/* tufted back — diamond pattern suggested by small bumps */}
      <RB s={[1.95, 0.58, 0.18]} p={[0, 0.7, -0.34]} rad={0.07} color={color} roughness={0.45} />
      {/* tufting buttons on back (3 rows × 5) */}
      {[0.52, 0.68, 0.84].map((y) =>
        [-0.7, -0.35, 0, 0.35, 0.7].map((x, xi) => (
          <Sp key={`t${y}${xi}`} a={[0.018, 8, 8]} p={[x, y, -0.24]} color={color} roughness={0.35} />
        ))
      )}
      {/* rolled left arm */}
      <mesh position={[-1.02, 0.52, 0.02]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.18, 16, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color={color} roughness={0.45} />
      </mesh>
      <Bx s={[0.18, 0.32, 0.7]} p={[-1.02, 0.36, 0]} color={color} roughness={0.45} />
      {/* rolled right arm */}
      <mesh position={[1.02, 0.52, 0.02]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.18, 16, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color={color} roughness={0.45} />
      </mesh>
      <Bx s={[0.18, 0.32, 0.7]} p={[1.02, 0.36, 0]} color={color} roughness={0.45} />
      {/* bun feet */}
      {[[-0.9, 0.06, -0.38], [0.9, 0.06, -0.38], [-0.9, 0.06, 0.38], [0.9, 0.06, 0.38]].map((pos, i) => (
        <Sp key={i} a={[0.05, 10, 10]} p={pos} color={DARK_WOOD} roughness={0.4} />
      ))}
    </group>
  )
}

/* ═══════════════════════════════════
   12. WARDROBE — sp-14
   ═══════════════════════════════════ */
function WardrobeModel({ color }) {
  return (
    <group>
      {/* main body */}
      <Bx s={[1.1, 1.85, 0.55]} p={[0, 0.95, 0]} color={color} roughness={0.45} />
      {/* top crown */}
      <Bx s={[1.16, 0.04, 0.58]} p={[0, 1.89, 0]} color={color} roughness={0.42} />
      {/* left door panel */}
      <Bx s={[0.5, 1.7, 0.025]} p={[-0.26, 0.9, 0.29]} color={color} roughness={0.44} />
      {/* right door panel */}
      <Bx s={[0.5, 1.7, 0.025]} p={[0.26, 0.9, 0.29]} color={color} roughness={0.44} />
      {/* door gap (dark line) */}
      <Bx s={[0.008, 1.7, 0.03]} p={[0, 0.9, 0.3]} color="#111" roughness={0.9} />
      {/* handles */}
      <Cy a={[0.01, 0.01, 0.1, 6]} p={[-0.06, 0.95, 0.31]} color={BRASS} metalness={0.7} roughness={0.2} />
      <Cy a={[0.01, 0.01, 0.1, 6]} p={[0.06, 0.95, 0.31]} color={BRASS} metalness={0.7} roughness={0.2} />
      {/* base plinth */}
      <Bx s={[1.12, 0.06, 0.56]} p={[0, 0.03, 0]} color={color} roughness={0.45} />
    </group>
  )
}

/* ═══════════════════════════════════
   15. OFFICE CHAIR — sp-15
   ═══════════════════════════════════ */
function OfficeChairModel({ color }) {
  return (
    <group>
      {/* seat */}
      <RB s={[0.5, 0.08, 0.48]} p={[0, 0.48, 0]} rad={0.03} color={color} roughness={0.5} />
      {/* seat cushion */}
      <RB s={[0.46, 0.06, 0.44]} p={[0, 0.54, 0]} rad={0.03} color={color} roughness={0.85} />
      {/* backrest */}
      <RB s={[0.46, 0.52, 0.06]} p={[0, 0.88, -0.22]} rad={0.03} color={color} roughness={0.5} />
      {/* lumbar curve */}
      <RB s={[0.4, 0.14, 0.04]} p={[0, 0.72, -0.18]} rad={0.03} color={color} roughness={0.5} />
      {/* armrests */}
      <Bx s={[0.06, 0.025, 0.24]} p={[-0.28, 0.6, 0.02]} color={BLK_METAL} roughness={0.6} />
      <Bx s={[0.06, 0.025, 0.24]} p={[0.28, 0.6, 0.02]} color={BLK_METAL} roughness={0.6} />
      {/* armrest supports */}
      <Cy a={[0.015, 0.015, 0.14, 6]} p={[-0.28, 0.52, 0.02]} color={CHROME} metalness={0.8} roughness={0.15} />
      <Cy a={[0.015, 0.015, 0.14, 6]} p={[0.28, 0.52, 0.02]} color={CHROME} metalness={0.8} roughness={0.15} />
      {/* central column */}
      <Cy a={[0.03, 0.04, 0.28, 12]} p={[0, 0.3, 0]} color={CHROME} metalness={0.85} roughness={0.1} />
      {/* 5-star base */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i * Math.PI * 2) / 5
        return (
          <group key={i}>
            <Cy
              a={[0.02, 0.02, 0.3, 6]}
              p={[Math.sin(angle) * 0.15, 0.1, Math.cos(angle) * 0.15]}
              rot={[0, 0, (Math.cos(angle) > 0 ? -1 : 1) * 0.3]}
              color={CHROME}
              metalness={0.85}
              roughness={0.1}
            />
            {/* caster wheel */}
            <Sp
              a={[0.025, 8, 8]}
              p={[Math.sin(angle) * 0.28, 0.025, Math.cos(angle) * 0.28]}
              color="#333"
              roughness={0.6}
            />
          </group>
        )
      })}
    </group>
  )
}

/* ═══════════════════════════════════
   16. CONSOLE TABLE — sp-16
   ═══════════════════════════════════ */
function ConsoleTableModel({ color }) {
  return (
    <group>
      {/* live-edge slab top (slightly irregular = tapered box) */}
      <mesh position={[0, 0.76, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.1, 0.045, 0.32]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      {/* bark edge accents (thin strips on sides) */}
      <Bx s={[1.1, 0.05, 0.01]} p={[0, 0.76, 0.165]} color={DARK_WOOD} roughness={0.7} />
      <Bx s={[1.1, 0.05, 0.01]} p={[0, 0.76, -0.165]} color={DARK_WOOD} roughness={0.7} />
      {/* geometric iron base — X shape */}
      <Bx s={[0.03, 0.72, 0.28]} p={[-0.35, 0.37, 0]} rot={[0, 0, 0.1]} color={BLK_METAL} metalness={0.5} roughness={0.35} />
      <Bx s={[0.03, 0.72, 0.28]} p={[0.35, 0.37, 0]} rot={[0, 0, -0.1]} color={BLK_METAL} metalness={0.5} roughness={0.35} />
      {/* cross bar */}
      <Bx s={[0.8, 0.025, 0.025]} p={[0, 0.3, 0]} color={BLK_METAL} metalness={0.5} roughness={0.35} />
      {/* feet pads */}
      {[[-0.42, 0.01, -0.12], [0.42, 0.01, -0.12], [-0.42, 0.01, 0.12], [0.42, 0.01, 0.12]].map((pos, i) => (
        <Cy key={i} a={[0.025, 0.025, 0.02, 8]} p={pos} color={BLK_METAL} metalness={0.5} roughness={0.35} />
      ))}
    </group>
  )
}

/* ═══════════════════════════════════
   17. SECTIONAL SOFA — sp-17
   ═══════════════════════════════════ */
function SectionalModel({ color }) {
  return (
    <group>
      {/* --- main section (long) --- */}
      <RB s={[2.0, 0.14, 0.85]} p={[0, 0.22, 0]} color={color} />
      {/* main seat cushions */}
      {[-0.64, 0, 0.64].map((x, i) => (
        <RB key={i} s={[0.58, 0.15, 0.68]} p={[x, 0.37, 0.04]} rad={0.06} color={color} roughness={0.92} />
      ))}
      {/* main back */}
      <RB s={[1.95, 0.48, 0.13]} p={[0, 0.6, -0.35]} rad={0.05} color={color} />
      {/* main back cushions */}
      {[-0.6, 0, 0.6].map((x, i) => (
        <RB key={`mbc${i}`} s={[0.52, 0.34, 0.12]} p={[x, 0.59, -0.21]} rad={0.05} color={color} roughness={0.94} />
      ))}
      {/* --- chaise section (perpendicular) --- */}
      <RB s={[0.75, 0.14, 0.7]} p={[1.16, 0.22, 0.52]} color={color} />
      {/* chaise cushion */}
      <RB s={[0.68, 0.15, 0.62]} p={[1.16, 0.37, 0.52]} rad={0.06} color={color} roughness={0.92} />
      {/* chaise back (side) */}
      <RB s={[0.13, 0.48, 0.7]} p={[1.55, 0.6, 0.52]} rad={0.05} color={color} />
      {/* left arm */}
      <RB s={[0.14, 0.28, 0.82]} p={[-0.97, 0.45, 0]} rad={0.05} color={color} />
      {/* legs */}
      {[
        [-0.9, 0.07, -0.35], [0.6, 0.07, -0.35], [-0.9, 0.07, 0.35],
        [0.6, 0.07, 0.35], [1.45, 0.07, 0.2], [1.45, 0.07, 0.82],
        [0.9, 0.07, 0.82],
      ].map((pos, i) => (
        <Cy key={i} a={[0.02, 0.018, 0.14, 8]} p={pos} color={BLK_METAL} metalness={0.5} roughness={0.35} />
      ))}
    </group>
  )
}

/* ═══════════════════════════════════
   18. RATTAN LOUNGE CHAIR — sp-18
   ═══════════════════════════════════ */
function LoungeChairModel({ color }) {
  return (
    <group>
      {/* barrel back (open cylinder) */}
      <mesh position={[0, 0.55, -0.05]} castShadow receiveShadow>
        <cylinderGeometry args={[0.38, 0.36, 0.52, 20, 1, true, 0.5, Math.PI * 1.5]} />
        <meshStandardMaterial color={color} roughness={0.7} side={THREE.DoubleSide} />
      </mesh>
      {/* seat frame */}
      <Cy a={[0.35, 0.33, 0.06, 20]} p={[0, 0.32, 0.02]} color={color} roughness={0.65} />
      {/* seat cushion */}
      <mesh position={[0, 0.38, 0.02]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.08, 20]} />
        <meshStandardMaterial color="#F5F0E6" roughness={0.92} />
      </mesh>
      {/* rattan weave lines (decorative rings on barrel) */}
      {[0.4, 0.5, 0.6, 0.7].map((y, i) => (
        <mesh key={i} position={[0, y, -0.05]}>
          <torusGeometry args={[0.375 - i * 0.005, 0.004, 6, 24, Math.PI * 1.5]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
      ))}
      {/* teak legs */}
      {[
        [-0.22, 0.14, -0.18], [0.22, 0.14, -0.18],
        [-0.22, 0.14, 0.22], [0.22, 0.14, 0.22],
      ].map((pos, i) => (
        <Cy key={i} a={[0.02, 0.016, 0.28, 8]} p={pos} color={DARK_WOOD} roughness={0.4} />
      ))}
    </group>
  )
}

/* Category → model type fallback for products not in MODEL_TYPE_MAP (e.g. admin-created) */
const CATEGORY_TO_MODEL = {
  'Living Room': 'sofa',
  'Dining Room': 'dining-table',
  'Bedroom': 'bed',
  'Storage': 'bookshelf',
  'Entertainment': 'tv-console',
  'Office': 'office-chair',
  seating: 'dining-chair',
  tables: 'coffee-table',
  bedroom: 'bed',
  storage: 'bookshelf',
  entertainment: 'tv-console',
  office: 'office-chair',
}
export function getModelTypeFromCategory(category) {
  if (!category) return 'sofa'
  const c = String(category).trim()
  return CATEGORY_TO_MODEL[c] || CATEGORY_TO_MODEL[c.toLowerCase()] || 'sofa'
}

/* ═══════════════════════════════════════════════════════
   MODEL TYPE MAP  →  product ID  ⟶  model component
   ═══════════════════════════════════════════════════════ */
export const MODEL_TYPE_MAP = {
  'sp-1':  'sofa',
  'sp-2':  'dining-chair',
  'sp-3':  'coffee-table',
  'sp-4':  'bed',
  'sp-5':  'bookshelf',
  'sp-7':  'tv-console',
  'sp-8':  'accent-chair',
  'sp-9':  'dining-table',
  'sp-10': 'nightstand',
  'sp-12': 'chesterfield',
  'sp-14': 'wardrobe',
  'sp-15': 'office-chair',
  'sp-16': 'console-table',
  'sp-17': 'sectional',
  'sp-18': 'lounge-chair',
}

const MODEL_COMPONENTS = {
  'sofa':           SofaModel,
  'dining-chair':   DiningChairModel,
  'coffee-table':   CoffeeTableModel,
  'bed':            BedModel,
  'bookshelf':      BookshelfModel,
  'floor-lamp':     FloorLampModel,
  'tv-console':     TVConsoleModel,
  'accent-chair':   AccentChairModel,
  'dining-table':   DiningTableModel,
  'nightstand':     NightstandModel,
  'chesterfield':   ChesterfieldModel,
  'wardrobe':       WardrobeModel,
  'office-chair':   OfficeChairModel,
  'console-table':  ConsoleTableModel,
  'sectional':      SectionalModel,
  'lounge-chair':   LoungeChairModel,
}

/* Scale factors so every model fills the viewport similarly */
const MODEL_SCALES = {
  'sofa':          0.85,
  'dining-chair':  1.6,
  'coffee-table':  1.3,
  'bed':           0.7,
  'bookshelf':     0.9,
  'floor-lamp':    1.0,
  'tv-console':    1.0,
  'accent-chair':  1.4,
  'dining-table':  0.85,
  'nightstand':    1.8,
  'pendant-light': 1.2,
  'chesterfield':  0.8,
  'wardrobe':      0.75,
  'office-chair':  1.3,
  'console-table': 1.1,
  'sectional':     0.65,
  'lounge-chair':  1.5,
}

/* ── Main exported component ── */
export default function FurnitureModel3D({ type = 'sofa', color = '#8B6F47', productId }) {
  const resolvedType = productId ? (MODEL_TYPE_MAP[productId] || type) : type
  const Comp = MODEL_COMPONENTS[resolvedType] || SofaModel
  const scale = MODEL_SCALES[resolvedType] || 1

  return (
    <group scale={[scale, scale, scale]}>
      <Comp color={color} />
    </group>
  )
}
