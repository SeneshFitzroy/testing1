/**
 * Firestore design service — save/fetch designs for sharing and persistence.
 * Designs are stored in the 'designs' collection with createdBy for ownership.
 */
import { doc, setDoc, getDoc, collection, query, where, getDocs, orderBy, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

/* ── Normalize design for Firestore (strip non-persisted fields) ── */
export function toFirestoreDesign(design, userId) {
  const base = {
    name: design.name || 'Untitled Design',
    rooms: design.rooms ? JSON.parse(JSON.stringify(design.rooms)) : [],
    activeRoomIndex: design.activeRoomIndex ?? 0,
    roomWidth: design.roomWidth,
    roomDepth: design.roomDepth,
    roomHeight: design.roomHeight,
    wallColor: design.wallColor,
    floorColor: design.floorColor,
    updatedAt: serverTimestamp(),
  }
  if (userId) {
    base.createdBy = userId
  }
  if (design.createdAt) {
    base.createdAt = design.createdAt
  }
  // Preserve Designer Panel fields if present
  if (design.status != null) base.status = design.status
  if (design.userName != null) base.userName = design.userName
  if (design.userEmail != null) base.userEmail = design.userEmail
  if (design.comments != null) base.comments = design.comments
  if (design.designerNotes != null) base.designerNotes = design.designerNotes
  return base
}

/* ── Save design to Firestore (create or update) ── */
export async function saveDesignToFirestore(design, userId) {
  if (!design?.id || !userId) {
    throw new Error('Design ID and user ID required')
  }
  const ref = doc(db, 'designs', design.id)
  const existing = await getDoc(ref)
  const payload = toFirestoreDesign(design, userId)
  if (!existing.exists()) {
    payload.createdAt = design.createdAt || serverTimestamp()
  }
  await setDoc(ref, payload, { merge: true })
  return design.id
}

/* ── Fetch design by ID (for shared view and editor load) ── */
export async function fetchDesignById(designId) {
  if (!designId) return null
  const ref = doc(db, 'designs', designId)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  const data = snap.data()
  return {
    id: snap.id,
    name: data.name,
    rooms: data.rooms,
    activeRoomIndex: data.activeRoomIndex ?? 0,
    roomWidth: data.roomWidth,
    roomDepth: data.roomDepth,
    roomHeight: data.roomHeight,
    wallColor: data.wallColor,
    floorColor: data.floorColor,
    createdBy: data.createdBy,
    createdAt: data.createdAt?.toDate?.()?.toISOString?.() || data.createdAt,
    updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() || data.updatedAt,
    status: data.status,
    userName: data.userName,
    userEmail: data.userEmail,
    comments: data.comments,
    designerNotes: data.designerNotes,
  }
}

/* ── Fetch all designs created by user ── */
export async function fetchDesignsByUser(userId) {
  if (!userId) return []
  const q = query(collection(db, 'designs'), where('createdBy', '==', userId))
  const snap = await getDocs(q)
  const list = snap.docs.map(d => ({
    id: d.id,
    ...d.data(),
    updatedAt: d.data().updatedAt?.toDate?.()?.toISOString?.() || d.data().updatedAt,
    createdAt: d.data().createdAt?.toDate?.()?.toISOString?.() || d.data().createdAt,
  }))
  list.sort((a, b) => (new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)))
  return list
}

/* ── Seed demo designs to Firestore so shared links work ── */
const DEMO_DESIGNS = [
  { id: 'demo-1', name: 'Modern Living Room', userName: 'John Doe', userEmail: 'john@example.com', status: 'completed', rooms: [{ name: 'Living Room', roomWidth: 6, roomDepth: 5, roomHeight: 3, wallColor: '#F4EFEA', floorColor: '#D9C7B8', furnitureItems: [{ name: 'Sofa', width: 2, depth: 1, height: 0.8, category: 'seating', color: '#8B6F47', instanceId: 'd1-s1', x: 1, y: 1 }, { name: 'Table', width: 1.2, depth: 0.6, height: 0.75, category: 'tables', color: '#8B6F47', instanceId: 'd1-t1', x: 2.5, y: 2 }, { name: 'Lamp', width: 0.3, depth: 0.3, height: 0.5, category: 'lighting', color: '#F4EFEA', instanceId: 'd1-l1', x: 1, y: 2 }] }], roomWidth: 6, roomDepth: 5, roomHeight: 3, wallColor: '#F4EFEA', floorColor: '#D9C7B8', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: 'demo' },
  { id: 'demo-2', name: 'Cozy Bedroom Setup', userName: 'Jane Smith', userEmail: 'jane@example.com', status: 'approved', rooms: [{ name: 'Bedroom', roomWidth: 5, roomDepth: 4, roomHeight: 3, wallColor: '#F4EFEA', floorColor: '#D9C7B8', furnitureItems: [{ name: 'Bed', width: 2, depth: 1.5, height: 0.6, category: 'beds', color: '#8B6F47', instanceId: 'd2-b1', x: 1, y: 1 }, { name: 'Nightstand', width: 0.5, depth: 0.4, height: 0.5, category: 'storage', color: '#8B6F47', instanceId: 'd2-n1', x: 3.2, y: 1 }, { name: 'Wardrobe', width: 1.2, depth: 0.6, height: 2, category: 'storage', color: '#8B6F47', instanceId: 'd2-w1', x: 0.5, y: 2.5 }, { name: 'Desk', width: 1, depth: 0.5, height: 0.75, category: 'tables', color: '#8B6F47', instanceId: 'd2-d1', x: 3.5, y: 2.5 }] }], roomWidth: 5, roomDepth: 4, roomHeight: 3, wallColor: '#F4EFEA', floorColor: '#D9C7B8', createdAt: new Date(Date.now() - 86400000).toISOString(), updatedAt: new Date().toISOString(), createdBy: 'demo' },
  { id: 'demo-3', name: 'Office Space Design', userName: 'Mike Johnson', userEmail: 'mike@example.com', status: 'revision', rooms: [{ name: 'Office', roomWidth: 4, roomDepth: 3, roomHeight: 3, wallColor: '#F4EFEA', floorColor: '#D9C7B8', furnitureItems: [{ name: 'Desk', width: 1.2, depth: 0.7, height: 0.75, category: 'tables', color: '#8B6F47', instanceId: 'd3-d1', x: 1, y: 1 }, { name: 'Chair', width: 0.5, depth: 0.5, height: 0.9, category: 'seating', color: '#8B6F47', instanceId: 'd3-c1', x: 1.5, y: 1.8 }] }], roomWidth: 4, roomDepth: 3, roomHeight: 3, wallColor: '#F4EFEA', floorColor: '#D9C7B8', createdAt: new Date(Date.now() - 172800000).toISOString(), updatedAt: new Date().toISOString(), createdBy: 'demo' },
  { id: 'demo-4', name: 'Dining Room Redesign', userName: 'Emma Wilson', userEmail: 'emma@example.com', status: 'completed', rooms: [{ name: 'Dining Room', roomWidth: 5, roomDepth: 4, roomHeight: 3, wallColor: '#F4EFEA', floorColor: '#D9C7B8', furnitureItems: [{ name: 'Dining Table', width: 2, depth: 1, height: 0.75, category: 'tables', color: '#8B6F47', instanceId: 'd4-t1', x: 1.5, y: 1.5 }, { name: 'Chairs', width: 0.5, depth: 0.5, height: 0.9, category: 'seating', color: '#8B6F47', instanceId: 'd4-c1', x: 1, y: 0.8 }, { name: 'Sideboard', width: 1.5, depth: 0.5, height: 0.9, category: 'storage', color: '#8B6F47', instanceId: 'd4-s1', x: 0.5, y: 2.5 }, { name: 'Pendant Light', width: 0.4, depth: 0.4, height: 0.5, category: 'lighting', color: '#F4EFEA', instanceId: 'd4-l1', x: 2.3, y: 0.5 }] }], roomWidth: 5, roomDepth: 4, roomHeight: 3, wallColor: '#F4EFEA', floorColor: '#D9C7B8', createdAt: new Date(Date.now() - 259200000).toISOString(), updatedAt: new Date().toISOString(), createdBy: 'demo' },
]

export async function seedDemoDesignsToFirestore() {
  for (const design of DEMO_DESIGNS) {
    const ref = doc(db, 'designs', design.id)
    const existing = await getDoc(ref)
    if (!existing.exists()) {
      await setDoc(ref, { ...design, createdBy: design.createdBy || 'demo' })
    }
  }
}
