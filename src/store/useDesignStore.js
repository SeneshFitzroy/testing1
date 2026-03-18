import { create } from 'zustand'
import { generateId } from '@/lib/utils'
import { fetchDesignsByUser } from '@/lib/designService'

/* ── Helper: create a blank room ── */
const createRoom = (name = 'Room 1', overrides = {}) => ({
  id: generateId(),
  name,
  roomWidth: 5,
  roomDepth: 4,
  roomHeight: 3,
  wallColor: '#F4EFEA',
  floorColor: '#D9C7B8',
  roomType: 'living',
  furnitureItems: [],
  ...overrides,
})

/* ── Extract flat fields from a room ── */
const flatFromRoom = (room) => ({
  roomWidth: room.roomWidth,
  roomDepth: room.roomDepth,
  roomHeight: room.roomHeight,
  wallColor: room.wallColor,
  floorColor: room.floorColor,
  roomType: room.roomType,
  furnitureItems: room.furnitureItems,
})

const useDesignStore = create((set, get) => ({
  // ── Multi-room state ──
  rooms: [createRoom('Room 1')],
  activeRoomIndex: 0,

  // ── Flat state (mirrors active room for backward compat) ──
  currentDesign: null,
  roomWidth: 5,
  roomDepth: 4,
  roomHeight: 3,
  wallColor: '#F4EFEA',
  floorColor: '#D9C7B8',
  roomType: 'living',
  furnitureItems: [],

  gridSize: 25,
  showGrid: true,
  snapToGrid: true,
  ambientLight: 0.6,
  sunlightDirection: 'top-left',
  selectedItemId: null,
  dragging3D: false,
  viewMode: '2d',
  history: [],
  historyIndex: -1,
  savedDesigns: [],
  readOnlyMode: false,

  setReadOnlyMode: (v) => set({ readOnlyMode: !!v }),

  // ── Room management ──
  addRoom: (name) => set((s) => {
    const newRoom = createRoom(name || `Room ${s.rooms.length + 1}`)
    const rooms = [...s.rooms, newRoom]
    return {
      rooms,
      activeRoomIndex: rooms.length - 1,
      selectedItemId: null,
      history: [[]],
      historyIndex: 0,
      ...flatFromRoom(newRoom),
    }
  }),

  switchRoom: (index) => set((s) => {
    if (index < 0 || index >= s.rooms.length) return {}
    const room = s.rooms[index]
    return {
      activeRoomIndex: index,
      selectedItemId: null,
      history: [room.furnitureItems.map(f => ({ ...f }))],
      historyIndex: 0,
      ...flatFromRoom(room),
    }
  }),

  deleteRoom: (index) => set((s) => {
    if (s.rooms.length <= 1) return {}
    const rooms = s.rooms.filter((_, i) => i !== index)
    const activeRoomIndex = s.activeRoomIndex >= rooms.length ? rooms.length - 1 :
                            s.activeRoomIndex > index ? s.activeRoomIndex - 1 : s.activeRoomIndex
    const room = rooms[activeRoomIndex]
    return {
      rooms,
      activeRoomIndex,
      selectedItemId: null,
      history: [room.furnitureItems.map(f => ({ ...f }))],
      historyIndex: 0,
      ...flatFromRoom(room),
    }
  }),

  renameRoom: (index, name) => set((s) => ({
    rooms: s.rooms.map((r, i) => i === index ? { ...r, name } : r),
  })),

  // ── Helper: update active room + sync flat state ──
  _updateActiveRoom: (changes) => set((s) => {
    const rooms = s.rooms.map((r, i) =>
      i === s.activeRoomIndex ? { ...r, ...changes } : r
    )
    return { rooms, ...changes }
  }),

  setRoomDimensions: (width, depth, height) =>
    get()._updateActiveRoom({ roomWidth: width, roomDepth: depth, roomHeight: height }),

  setWallColor: (color) => get()._updateActiveRoom({ wallColor: color }),
  setFloorColor: (color) => get()._updateActiveRoom({ floorColor: color }),

  // Add furniture to room (x, y optional — for drag-drop placement)
  addFurniture: (item, x, y) => {
    const newItem = {
      ...item,
      instanceId: generateId(),
      x: typeof x === 'number' ? x : 2,
      y: typeof y === 'number' ? y : 2,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    }
    set((s) => {
      const room = s.rooms[s.activeRoomIndex]
      const updated = [...room.furnitureItems, newItem]
      const rooms = s.rooms.map((r, i) => i === s.activeRoomIndex ? { ...r, furnitureItems: updated } : r)
      return {
        rooms,
        furnitureItems: updated,
        selectedItemId: newItem.instanceId,
        ...get().pushHistory(updated),
      }
    })
  },

  updateFurniture: (instanceId, updates) =>
    set((s) => {
      const room = s.rooms[s.activeRoomIndex]
      const updated = room.furnitureItems.map(f =>
        f.instanceId === instanceId ? { ...f, ...updates } : f
      )
      const rooms = s.rooms.map((r, i) => i === s.activeRoomIndex ? { ...r, furnitureItems: updated } : r)
      return { rooms, furnitureItems: updated }
    }),

  commitFurnitureUpdate: () =>
    set((s) => ({ ...get().pushHistory(s.furnitureItems) })),

  removeFurniture: (instanceId) =>
    set((s) => {
      const room = s.rooms[s.activeRoomIndex]
      const updated = room.furnitureItems.filter(f => f.instanceId !== instanceId)
      const rooms = s.rooms.map((r, i) => i === s.activeRoomIndex ? { ...r, furnitureItems: updated } : r)
      return {
        rooms,
        furnitureItems: updated,
        selectedItemId: s.selectedItemId === instanceId ? null : s.selectedItemId,
        ...get().pushHistory(updated),
      }
    }),

  duplicateFurniture: (instanceId) =>
    set((s) => {
      const room = s.rooms[s.activeRoomIndex]
      const item = room.furnitureItems.find(f => f.instanceId === instanceId)
      if (!item) return {}
      const dup = { ...item, instanceId: generateId(), x: item.x + 0.5, y: item.y + 0.5 }
      const updated = [...room.furnitureItems, dup]
      const rooms = s.rooms.map((r, i) => i === s.activeRoomIndex ? { ...r, furnitureItems: updated } : r)
      return {
        rooms,
        furnitureItems: updated,
        selectedItemId: dup.instanceId,
        ...get().pushHistory(updated),
      }
    }),

  rotateFurniture: (instanceId) =>
    set((s) => {
      const room = s.rooms[s.activeRoomIndex]
      const updated = room.furnitureItems.map(f =>
        f.instanceId === instanceId ? { ...f, rotation: (f.rotation + 45) % 360 } : f
      )
      const rooms = s.rooms.map((r, i) => i === s.activeRoomIndex ? { ...r, furnitureItems: updated } : r)
      return { rooms, furnitureItems: updated, ...get().pushHistory(updated) }
    }),

  selectItem: (instanceId) => set({ selectedItemId: instanceId }),
  selectFurniture: (instanceId) => set({ selectedItemId: instanceId }),
  clearSelection: () => set({ selectedItemId: null }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setDragging3D: (v) => set({ dragging3D: !!v }),
  reset3DViewRequest: 0,
  requestReset3DView: () => set((s) => ({ reset3DViewRequest: s.reset3DViewRequest + 1 })),

  updateFurniturePosition: (instanceId, x, y) =>
    set((s) => {
      const room = s.rooms[s.activeRoomIndex]
      const updated = room.furnitureItems.map(f =>
        f.instanceId === instanceId ? { ...f, x, y } : f
      )
      const rooms = s.rooms.map((r, i) => i === s.activeRoomIndex ? { ...r, furnitureItems: updated } : r)
      return { rooms, furnitureItems: updated }
    }),

  updateRoomSettings: (updates) => {
    const changes = {}
    if (updates.width !== undefined) changes.roomWidth = updates.width
    if (updates.height !== undefined) changes.roomDepth = updates.height
    if (updates.depth !== undefined) changes.roomDepth = updates.depth
    if (updates.roomHeight !== undefined) changes.roomHeight = updates.roomHeight
    if (updates.wallColor !== undefined) changes.wallColor = updates.wallColor
    if (updates.floorColor !== undefined) changes.floorColor = updates.floorColor
    if (updates.gridSize !== undefined) changes.gridSize = updates.gridSize
    if (updates.showGrid !== undefined) changes.showGrid = updates.showGrid
    if (updates.snapToGrid !== undefined) changes.snapToGrid = updates.snapToGrid
    if (updates.ambientLight !== undefined) changes.ambientLight = updates.ambientLight
    if (updates.sunlightDirection !== undefined) changes.sunlightDirection = updates.sunlightDirection
    if (updates.type !== undefined) changes.roomType = updates.type

    const globalKeys = ['gridSize', 'showGrid', 'snapToGrid', 'ambientLight', 'sunlightDirection']
    const globalChanges = {}
    const roomChanges = {}
    for (const [k, v] of Object.entries(changes)) {
      if (globalKeys.includes(k)) globalChanges[k] = v
      else roomChanges[k] = v
    }
    if (Object.keys(globalChanges).length) set(globalChanges)
    if (Object.keys(roomChanges).length) get()._updateActiveRoom(roomChanges)
  },

  toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),
  toggleSnapToGrid: () => set((s) => ({ snapToGrid: !s.snapToGrid })),
  setGridSize: (size) => set({ gridSize: size }),
  setAmbientLight: (val) => set({ ambientLight: val }),

  resetRoom: () =>
    set((s) => {
      const freshRoom = createRoom(s.rooms[s.activeRoomIndex]?.name || 'Room 1')
      return {
        rooms: s.rooms.map((r, i) => i === s.activeRoomIndex ? freshRoom : r),
        selectedItemId: null,
        history: [[]],
        historyIndex: 0,
        ...flatFromRoom(freshRoom),
      }
    }),

  pushHistory: (items) => {
    const s = get()
    const newHistory = s.history.slice(0, s.historyIndex + 1)
    newHistory.push(JSON.parse(JSON.stringify(items)))
    return { history: newHistory, historyIndex: newHistory.length - 1 }
  },

  undo: () =>
    set((s) => {
      if (s.historyIndex <= 0) return {}
      const newIndex = s.historyIndex - 1
      const items = JSON.parse(JSON.stringify(s.history[newIndex]))
      const rooms = s.rooms.map((r, i) => i === s.activeRoomIndex ? { ...r, furnitureItems: items } : r)
      return { rooms, furnitureItems: items, historyIndex: newIndex, selectedItemId: null }
    }),

  redo: () =>
    set((s) => {
      if (s.historyIndex >= s.history.length - 1) return {}
      const newIndex = s.historyIndex + 1
      const items = JSON.parse(JSON.stringify(s.history[newIndex]))
      const rooms = s.rooms.map((r, i) => i === s.activeRoomIndex ? { ...r, furnitureItems: items } : r)
      return { rooms, furnitureItems: items, historyIndex: newIndex, selectedItemId: null }
    }),

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,

  loadTemplate: (template) =>
    set((s) => {
      const updatedRoom = {
        ...s.rooms[s.activeRoomIndex],
        roomWidth: template.width,
        roomDepth: template.depth,
        roomHeight: template.height,
        wallColor: template.wallColor,
        floorColor: template.floorColor,
        furnitureItems: [],
      }
      const rooms = s.rooms.map((r, i) => i === s.activeRoomIndex ? updatedRoom : r)
      return {
        rooms,
        selectedItemId: null,
        history: [[]],
        historyIndex: 0,
        ...flatFromRoom(updatedRoom),
      }
    }),

  saveDesignLocally: (name) => {
    const s = get()
    const design = {
      id: s.currentDesign?.id || generateId(),
      name: name || 'Untitled Design',
      rooms: JSON.parse(JSON.stringify(s.rooms)),
      activeRoomIndex: s.activeRoomIndex,
      updatedAt: new Date().toISOString(),
      createdAt: s.currentDesign?.createdAt || new Date().toISOString(),
      roomWidth: s.rooms[0]?.roomWidth,
      roomDepth: s.rooms[0]?.roomDepth,
      roomHeight: s.rooms[0]?.roomHeight,
      wallColor: s.rooms[0]?.wallColor,
      floorColor: s.rooms[0]?.floorColor,
      furnitureItems: s.rooms[0]?.furnitureItems,
    }
    set((state) => {
      const existing = state.savedDesigns.findIndex(d => d.id === design.id)
      const savedDesigns =
        existing >= 0
          ? state.savedDesigns.map((d, i) => (i === existing ? design : d))
          : [...state.savedDesigns, design]
      return { currentDesign: design, savedDesigns }
    })
    return design
  },

  loadDesign: (design) => {
    const normalizeItem = (f, i) => {
      if (f.instanceId && typeof f.x === 'number' && typeof f.y === 'number') return f
      return {
        ...f,
        instanceId: f.instanceId || generateId(),
        x: typeof f.x === 'number' ? f.x : 1 + (i % 3) * 0.5,
        y: typeof f.y === 'number' ? f.y : 1 + Math.floor(i / 3) * 0.5,
        rotation: f.rotation ?? 0,
        scaleX: f.scaleX ?? 1,
        scaleY: f.scaleY ?? 1,
      }
    }
    const normalizeRoom = (r) => ({
      ...createRoom(),
      ...r,
      furnitureItems: (r.furnitureItems || []).map(normalizeItem),
    })
    const rooms = design.rooms && design.rooms.length
      ? design.rooms.map(normalizeRoom)
      : [createRoom('Room 1', {
          roomWidth: design.roomWidth,
          roomDepth: design.roomDepth,
          roomHeight: design.roomHeight,
          wallColor: design.wallColor,
          floorColor: design.floorColor,
          furnitureItems: (design.furnitureItems || []).map(normalizeItem),
        })]
    const idx = Math.min(design.activeRoomIndex ?? 0, rooms.length - 1)
    set({
      currentDesign: design,
      rooms,
      activeRoomIndex: idx,
      selectedItemId: null,
      history: [rooms[idx].furnitureItems.map(f => ({ ...f }))],
      historyIndex: 0,
      ...flatFromRoom(rooms[idx]),
    })
  },

  resetDesign: () => {
    const room = createRoom('Room 1')
    set({
      currentDesign: null,
      rooms: [room],
      activeRoomIndex: 0,
      gridSize: 25,
      showGrid: true,
      snapToGrid: true,
      ambientLight: 0.6,
      sunlightDirection: 'top-left',
      selectedItemId: null,
      viewMode: '2d',
      history: [[]],
      historyIndex: 0,
      ...flatFromRoom(room),
    })
  },

  deleteDesign: (id) =>
    set((s) => ({
      savedDesigns: s.savedDesigns.filter(d => d.id !== id),
      currentDesign: s.currentDesign?.id === id ? null : s.currentDesign,
    })),

  loadUserDesigns: async (userId) => {
    if (!userId) return get().savedDesigns
    try {
      const designs = await fetchDesignsByUser(userId)
      set({ savedDesigns: designs })
      return designs
    } catch (err) {
      console.warn('Failed to load designs from Firestore:', err)
      return get().savedDesigns
    }
  },

  duplicateDesign: (designId) => {
    const s = get()
    const original = s.savedDesigns.find(d => d.id === designId)
    if (!original) return null
    const dup = {
      ...original,
      id: generateId(),
      name: `${original.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    set({ savedDesigns: [...s.savedDesigns, dup] })
    return dup
  },
}))

export default useDesignStore
