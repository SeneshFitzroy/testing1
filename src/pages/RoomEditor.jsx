import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { jsPDF } from 'jspdf'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Layers,
  Eye,
  Save,
  Undo2,
  Redo2,
  Settings,
  Palette,
  Grid3x3,
  RotateCw,
  Copy,
  Trash2,
  ArrowLeft,
  Loader2,
  Plus,
  X,
  Pencil,
  FileImage,
  FileText,
  Download,
  AlertTriangle,
  Keyboard,
  HelpCircle,
  Share2,
  GripVertical,
  PanelLeft,
  ChevronDown,
  MoreHorizontal,
} from 'lucide-react'
import { toast } from 'sonner'

import useDesignStore from '@/store/useDesignStore'
import RoomCanvas2D from '@/components/editor/RoomCanvas2D'
import RoomViewer3D from '@/components/editor/RoomViewer3D'
import FurniturePanel from '@/components/editor/FurniturePanel'
import PropertiesPanel from '@/components/editor/PropertiesPanel'
import RoomSettingsPanel from '@/components/editor/RoomSettingsPanel'
import TemplateSelector from '@/components/editor/TemplateSelector'
import KeyboardShortcutsPanel from '@/components/editor/KeyboardShortcutsPanel'
import OnboardingTour, { ONBOARDING_TOUR_KEY } from '@/components/editor/OnboardingTour'
import ConfirmDialog from '@/components/ConfirmDialog'

export default function RoomEditor() {
  const { designId } = useParams()
  const { t } = useTranslation()
  const canvasRef = useRef(null)
  const canvas2DRef = useRef(null)

  // New users must complete onboarding before seeing template selector
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(
    () => localStorage.getItem(ONBOARDING_TOUR_KEY) === 'true'
  )

  const {
    currentDesign,
    viewMode,
    setViewMode,
    selectedItemId,
    clearSelection,
    canUndo,
    canRedo,
    undo,
    redo,
    saveDesignLocally,
    loadDesign,
    savedDesigns,
    resetDesign,
    roomWidth,
    roomDepth,
    roomHeight,
    furnitureItems,
    rotateFurniture,
    duplicateFurniture,
    removeFurniture,
    addFurniture,
    // Multi-room
    rooms,
    activeRoomIndex,
    addRoom,
    switchRoom,
    deleteRoom,
    renameRoom,
  } = useDesignStore()

  const needsTemplate = !designId && !currentDesign
  const [showTemplates, setShowTemplates] = useState(needsTemplate)
  const [activePanel, setActivePanel] = useState('furniture')
  const [isLoading, setIsLoading] = useState(!!designId)
  const [saveStatus, setSaveStatus] = useState('')
  const [editingRoomIdx, setEditingRoomIdx] = useState(null)
  const [editingRoomName, setEditingRoomName] = useState('')
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [viewTransitionMsg, setViewTransitionMsg] = useState('')
  const [sizeAlerts, setSizeAlerts] = useState([])
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const [sidebarOpenOnMobile, setSidebarOpenOnMobile] = useState(false)
  const [panelWidth, setPanelWidth] = useState(() => {
    const saved = localStorage.getItem('Lee Roo-editorPanelWidth')
    return saved ? Math.min(480, Math.max(240, parseInt(saved, 10))) : 320
  })
  const resizeStartX = useRef(0)
  const resizeStartWidth = useRef(320)

  const handleResizeStart = (e) => {
    e.preventDefault()
    resizeStartX.current = e.clientX
    resizeStartWidth.current = panelWidth
    const onMove = (ev) => {
      const dx = ev.clientX - resizeStartX.current
      const next = Math.min(480, Math.max(240, resizeStartWidth.current + dx))
      setPanelWidth(next)
      localStorage.setItem('Lee Roo-editorPanelWidth', String(next))
    }
    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  // Check furniture exceeding room bounds
  useEffect(() => {
    const alerts = []
    furnitureItems.forEach(item => {
      const itemW = (item.width || 1) * (item.scaleX || 1)
      const itemD = (item.depth || 1) * (item.scaleY || 1)
      if (item.x + itemW > roomWidth || item.y + itemD > roomDepth || item.x < 0 || item.y < 0) {
        alerts.push(`"${item.name}" exceeds room boundaries`)
      }
    })
    setSizeAlerts(alerts)
    if (alerts.length > 0 && furnitureItems.length > 0) {
      toast.warning(`${alerts.length} item(s) outside room bounds`, { id: 'size-alert' })
    }
  }, [furnitureItems, roomWidth, roomDepth])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo() }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redo() }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); handleSave() }
      if (e.key === 'Delete' && selectedItemId) removeFurniture(selectedItemId)
      if (e.key === '?' || (e.shiftKey && e.key === '/')) setShowShortcuts(prev => !prev)
      if (e.key === 'Escape') { clearSelection(); setShowShortcuts(false) }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [selectedItemId])

  // View mode transition message
  const handleViewSwitch = (mode) => {
    const msg = mode === '3d' ? 'Switching to 3D view. Orbit with mouse to explore.' : 'Switching to 2D floor plan. Drag items to reposition.'
    setViewTransitionMsg(msg)
    setViewMode(mode)
    setTimeout(() => setViewTransitionMsg(''), 3000)
  }

  useEffect(() => {
    if (designId && savedDesigns.length > 0) {
      const design = savedDesigns.find(d => d.id === designId)
      if (design) {
        loadDesign(design)
        setShowTemplates(false)
      }
      setIsLoading(false)
    }
  }, [designId, savedDesigns, loadDesign])

  useEffect(() => {
    if (!currentDesign && furnitureItems.length === 0) return
    const autoSaveInterval = setInterval(() => {
      try {
        saveDesignLocally(currentDesign?.name || 'Auto-saved Design')
        setSaveStatus('Auto-saved')
        setTimeout(() => setSaveStatus(''), 2000)
      } catch (error) {
        console.warn('Auto-save failed:', error)
      }
    }, 30000)
    return () => clearInterval(autoSaveInterval)
  }, [currentDesign, furnitureItems, saveDesignLocally])

  const handleSave = () => {
    try {
      const name = currentDesign?.name || `Room Design ${new Date().toLocaleDateString()}`
      const design = saveDesignLocally(name)
      setSaveStatus('Saved!')
      setTimeout(() => setSaveStatus(''), 2000)
      toast.success(`Design "${design.name}" saved!`)
    } catch (error) {
      toast.error('Failed to save design')
    }
  }

  const handleTemplateSelect = () => {
    setShowTemplates(false)
    setActivePanel('furniture')
  }

  const handleReset = () => {
    setConfirmReset(true)
  }

  const executeReset = () => {
    setConfirmReset(false)
    resetDesign()
    setShowTemplates(true)
    clearSelection()
    toast.info('Design cleared.')
  }

  /* ── Export helpers ── */
  const handleExport = async (format) => {
    setShowExportMenu(false)
    try {
      let dataUrl = null

      if (viewMode === '2d') {
        // Use Konva stage.toDataURL for full fidelity (room + furniture)
        if (canvas2DRef.current?.toDataURL) {
          dataUrl = canvas2DRef.current.toDataURL(format === 'jpg' ? 'image/jpeg' : 'image/png', 0.95)
        }
        if (!dataUrl) {
          const canvas = document.querySelector('.konvajs-content canvas')
          if (canvas) dataUrl = canvas.toDataURL(format === 'jpg' ? 'image/jpeg' : 'image/png', 0.95)
        }
        if (!dataUrl) {
          toast.error('2D canvas not ready. Please wait a moment and try again.')
          return
        }
      } else {
        // 3D: Canvas with preserveDrawingBuffer must be used
        const canvas = canvasRef.current?.querySelector('canvas')
          || document.querySelector('canvas[data-engine]')
          || document.querySelector('.flex-1 canvas')
          || document.querySelector('canvas')
        if (!canvas) {
          toast.error('3D view not ready. Try switching to 2D or wait a moment.')
          return
        }
        dataUrl = canvas.toDataURL(format === 'jpg' ? 'image/jpeg' : 'image/png', 0.95)
      }

      if (format === 'pdf') {
        const img = new Image()
        img.onload = () => {
          const pdf = new jsPDF({
            orientation: img.width > img.height ? 'landscape' : 'portrait',
            unit: 'px',
            format: [img.width, img.height],
          })
          pdf.addImage(dataUrl, 'PNG', 0, 0, img.width, img.height)
          pdf.save(`${currentDesign?.name || 'room-design'}.pdf`)
          toast.success('Exported as PDF')
        }
        img.src = dataUrl
      } else {
        const link = document.createElement('a')
        link.download = `${currentDesign?.name || 'room-design'}.${format}`
        link.href = dataUrl
        link.click()
        toast.success(`Exported as ${format.toUpperCase()}`)
      }
    } catch (err) {
      console.error('Export failed:', err)
      toast.error('Export failed')
    }
  }

  /* ── Room tab editing ── */
  const startRenaming = (idx) => {
    setEditingRoomIdx(idx)
    setEditingRoomName(rooms[idx].name)
  }
  const finishRenaming = () => {
    if (editingRoomIdx !== null && editingRoomName.trim()) {
      renameRoom(editingRoomIdx, editingRoomName.trim())
    }
    setEditingRoomIdx(null)
  }

  const selectedItem = furnitureItems.find(item => item.instanceId === selectedItemId)

  const sidebarStyle = {
    width: typeof window !== 'undefined' && window.innerWidth >= 1024 ? panelWidth : undefined,
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50 dark:bg-dark-bg">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-clay" />
          <p className="text-darkwood dark:text-warm-200">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  // New users: show onboarding FIRST, block template selector until complete
  if (!hasSeenOnboarding) {
    return (
      <div className="min-h-screen bg-warm-50 dark:bg-dark-bg flex items-center justify-center">
        <OnboardingTour
          triggerShow={true}
          onComplete={() => setHasSeenOnboarding(true)}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-warm-50 dark:bg-dark-bg">
      {showTemplates && (
        <TemplateSelector onSelect={handleTemplateSelect} onClose={() => setShowTemplates(false)} />
      )}

      <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
        {/* ── Left Sidebar (resizable; collapsible on mobile) ── */}
        <div
          className={`w-full lg:flex-none bg-white dark:bg-dark-card border-r border-warm-200 dark:border-dark-border flex flex-col relative shrink-0 z-30
            ${sidebarOpenOnMobile ? 'flex' : 'hidden'} lg:flex`}
          style={sidebarStyle}
        >
          <div className="p-4 border-b border-warm-200 dark:border-dark-border">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-darkwood dark:text-warm-100 font-display">
                {t('editor.title')}
              </h1>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setSidebarOpenOnMobile(false)}
                  className="lg:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-warm-100 dark:hover:bg-dark-surface rounded-lg transition-colors"
                  aria-label="Close panel"
                >
                  <X className="h-5 w-5 text-darkwood dark:text-warm-200" />
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="p-2 hover:bg-warm-100 dark:hover:bg-dark-surface rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-darkwood dark:text-warm-200" />
                </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex bg-warm-100 dark:bg-dark-surface rounded-xl p-1">
              {[
                { key: 'furniture', icon: Grid3x3, label: t('editor.furniture') },
                { key: 'properties', icon: Settings, label: t('editor.properties'), disabled: !selectedItem },
                { key: 'room', icon: Palette, label: t('editor.room') },
              ].map(({ key, icon: Icon, label, disabled }) => (
                <button
                  key={key}
                  onClick={() => !disabled && setActivePanel(key)}
                  disabled={disabled}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activePanel === key
                      ? 'bg-gradient-to-r from-clay to-clay-dark text-white shadow-sm'
                      : 'text-darkwood/70 dark:text-gray-200 hover:bg-warm-200/50 dark:hover:bg-dark-border/50'
                  }${disabled ? ' opacity-40 cursor-not-allowed' : ''}`}
                >
                  <Icon className="h-4 w-4 mx-auto mb-1" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            {activePanel === 'furniture' && <FurniturePanel />}
            {activePanel === 'properties' && <PropertiesPanel selectedItem={selectedItem} />}
            {activePanel === 'room' && <RoomSettingsPanel onExport={handleExport} />}
          </div>

          {/* Resize handle (desktop only) */}
          <div
            onMouseDown={handleResizeStart}
            className="hidden lg:flex absolute right-0 top-0 bottom-0 w-2 -mr-1 cursor-col-resize hover:bg-clay/20 active:bg-clay/30 transition-colors items-center justify-center group"
            aria-label="Resize panel"
          >
            <GripVertical className="h-5 w-5 text-darkwood/30 dark:text-gray-300 group-hover:text-clay" />
          </div>
        </div>

        {/* ── Main Canvas Area ── */}
        <div className="flex-1 flex flex-col">
          {/* Room Tabs */}
          <div className="bg-white dark:bg-dark-card border-b border-warm-200 dark:border-dark-border px-4 pt-2 flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {rooms.map((room, idx) => (
              <div
                key={room.id}
                className={`group relative flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-sm font-medium cursor-pointer transition-all shrink-0 ${
                  idx === activeRoomIndex
                    ? 'bg-warm-50 dark:bg-dark-bg text-darkwood dark:text-warm-100 border border-b-0 border-warm-200 dark:border-dark-border'
                    : 'text-darkwood/50 dark:text-gray-300 hover:bg-warm-100/50 dark:hover:bg-dark-surface/50'
                }`}
                onClick={() => switchRoom(idx)}
              >
                {editingRoomIdx === idx ? (
                  <input
                    className="w-20 bg-transparent border-b border-clay text-sm outline-none text-darkwood dark:text-warm-100"
                    value={editingRoomName}
                    onChange={(e) => setEditingRoomName(e.target.value)}
                    onBlur={finishRenaming}
                    onKeyDown={(e) => e.key === 'Enter' && finishRenaming()}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span onDoubleClick={() => startRenaming(idx)}>{room.name}</span>
                )}
                {rooms.length > 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteRoom(idx) }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-all"
                  >
                    <X className="h-3 w-3 text-red-500" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => addRoom()}
              className="flex items-center gap-1 px-3 py-2 text-sm text-clay hover:bg-clay/10 rounded-lg transition-colors shrink-0"
              title={t('editor.addRoom')}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">{t('editor.addRoom')}</span>
            </button>
          </div>

          {/* Top Toolbar — Professional layout */}
          <div className="bg-white dark:bg-dark-card border-b border-warm-200 dark:border-dark-border p-3 sm:p-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              {/* Left: View + History */}
              <div className="flex items-center gap-3 flex-wrap">
                {/* View Mode Toggle — clear 2D vs 3D visual difference */}
                <div className="flex bg-warm-100 dark:bg-dark-surface rounded-xl p-1.5 shadow-inner border border-warm-200/50 dark:border-dark-border/50">
                  <button
                    onClick={() => handleViewSwitch('2d')}
                    className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                      viewMode === '2d'
                        ? 'bg-[#3F5E45] text-white shadow-md border-2 border-forest'
                        : 'text-darkwood/70 dark:text-gray-200 hover:bg-warm-200/50 dark:hover:bg-dark-border/50 border-2 border-transparent'
                    }`}
                    aria-label="2D floor plan — flat top-down view"
                    title="2D Floor Plan — drag to reposition items"
                  >
                    <Layers className="h-5 w-5" />
                    <span>2D Plan</span>
                  </button>
                  <button
                    onClick={() => handleViewSwitch('3d')}
                    className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                      viewMode === '3d'
                        ? 'bg-clay text-white shadow-md border-2 border-clay-dark'
                        : 'text-darkwood/70 dark:text-gray-200 hover:bg-warm-200/50 dark:hover:bg-dark-border/50 border-2 border-transparent'
                    }`}
                    aria-label="3D perspective — orbit to explore"
                    title="3D View — drag to rotate camera"
                  >
                    <Eye className="h-5 w-5" />
                    <span>3D View</span>
                  </button>
                </div>
                <div className="hidden sm:block w-px h-8 bg-warm-200 dark:bg-dark-border" />
                {/* Undo / Redo */}
                <div className="flex items-center gap-0.5">
                  <button onClick={undo} disabled={!canUndo()}
                    className="p-2.5 rounded-lg hover:bg-warm-100 dark:hover:bg-dark-surface disabled:opacity-30 transition-colors"
                    title={t('editor.undo')}>
                    <Undo2 className="h-5 w-5 text-darkwood dark:text-warm-200" />
                  </button>
                  <button onClick={redo} disabled={!canRedo()}
                    className="p-2.5 rounded-lg hover:bg-warm-100 dark:hover:bg-dark-surface disabled:opacity-30 transition-colors"
                    title={t('editor.redo')}>
                    <Redo2 className="h-5 w-5 text-darkwood dark:text-warm-200" />
                  </button>
                </div>
              </div>

              {/* Right: Tools + Save/Share/Export */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="w-px h-6 bg-warm-200 dark:bg-dark-border mx-1 hidden sm:block" />

                {/* More — advanced tools (simplified canvas per user feedback) */}
                <div className="relative">
                  <button
                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                    className="px-3 py-2 text-sm font-medium text-darkwood/70 dark:text-gray-200 hover:bg-warm-100 dark:hover:bg-dark-surface rounded-lg transition-colors flex items-center gap-1"
                    aria-label="More options"
                  >
                    <MoreHorizontal className="h-5 w-5" />
                    <span className="hidden sm:inline">More</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${showMoreMenu ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {showMoreMenu && (
                      <motion.div
                        className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-dark-card rounded-xl shadow-xl border border-warm-200 dark:border-dark-border py-1 z-50"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        onClick={() => setShowMoreMenu(false)}
                      >
                        <button onClick={() => { setShowTemplates(true); setShowMoreMenu(false) }}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-darkwood dark:text-warm-200 hover:bg-warm-50 dark:hover:bg-dark-surface">
                          <Grid3x3 className="h-4 w-4" /> {t('editor.templates')}
                        </button>
                        <button onClick={() => { handleReset(); setShowMoreMenu(false) }}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-darkwood dark:text-warm-200 hover:bg-warm-50 dark:hover:bg-dark-surface">
                          <Trash2 className="h-4 w-4" /> Reset
                        </button>
                        <button onClick={() => { setShowShortcuts(true); setShowMoreMenu(false) }}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-darkwood dark:text-warm-200 hover:bg-warm-50 dark:hover:bg-dark-surface">
                          <Keyboard className="h-4 w-4" /> Shortcuts (?)
                        </button>
                        <button onClick={() => { setShowTutorial(true); setShowMoreMenu(false) }}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-darkwood dark:text-warm-200 hover:bg-warm-50 dark:hover:bg-dark-surface">
                          <HelpCircle className="h-4 w-4" /> Tutorial
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <button
                  onClick={() => {
                    const id = designId || currentDesign?.id
                    const url = id ? `${window.location.origin}/editor/${id}` : window.location.href
                    navigator.clipboard.writeText(url).then(() => {
                      toast.success(id ? 'Share link copied! Send to clients or collaborators.' : 'Save your design first to get a shareable link.')
                    }).catch(() => toast.error('Could not copy link.'))
                  }}
                  className="p-2 rounded-lg hover:bg-warm-100 dark:hover:bg-dark-surface transition-colors"
                  title="Copy share link"
                  aria-label="Copy share link"
                >
                  <Share2 className="h-5 w-5 text-darkwood/50 dark:text-gray-200" />
                </button>

                {/* Export dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    className="px-3 py-2 text-sm font-medium text-darkwood/70 dark:text-gray-200 hover:bg-warm-100 dark:hover:bg-dark-surface rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('editor.export')}</span>
                  </button>
                  <AnimatePresence>
                    {showExportMenu && (
                      <motion.div
                        className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-dark-card rounded-xl shadow-xl border border-warm-200 dark:border-dark-border py-1 z-50"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                      >
                        <button onClick={() => handleExport('png')}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-darkwood dark:text-warm-200 hover:bg-warm-50 dark:hover:bg-dark-surface">
                          <FileImage className="h-4 w-4" /> PNG
                        </button>
                        <button onClick={() => handleExport('jpg')}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-darkwood dark:text-warm-200 hover:bg-warm-50 dark:hover:bg-dark-surface">
                          <FileImage className="h-4 w-4" /> JPG
                        </button>
                        <button onClick={() => handleExport('pdf')}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-darkwood dark:text-warm-200 hover:bg-warm-50 dark:hover:bg-dark-surface">
                          <FileText className="h-4 w-4" /> PDF
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button onClick={handleSave}
                  className="px-4 py-2 bg-gradient-to-r from-clay to-clay-dark hover:from-clay-dark hover:to-clay text-white text-sm font-semibold rounded-xl shadow-sm flex items-center gap-2 transition-all hover:shadow-md">
                  <Save className="h-4 w-4" />
                  <span>{t('editor.save')}</span>
                </button>
              </div>
            </div>

            {/* Status bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 mt-2.5 text-xs text-darkwood/50 dark:text-gray-300">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <span>Room: {roomWidth}m x {roomDepth}m x {roomHeight}m</span>
                <span>Items: {furnitureItems.length}</span>
                <span>Rooms: {rooms.length}</span>
                {selectedItem && (
                  <span className="text-clay font-medium">Selected: {selectedItem.name}</span>
                )}
              </div>
              {saveStatus && (
                <motion.span className="text-forest font-medium"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {saveStatus}
                </motion.span>
              )}
            </div>
          </div>

          {/* Canvas (drop zone for 3D mode; 2D handled by RoomCanvas2D) */}
          <div
            ref={canvasRef}
            className="flex-1 relative bg-warm-50 dark:bg-dark-bg overflow-hidden"
            onDragOver={(e) => { if (viewMode === '3d') { e.preventDefault(); e.dataTransfer.dropEffect = 'copy' } }}
            onDrop={(e) => {
              if (viewMode !== '3d') return
              e.preventDefault()
              const raw = e.dataTransfer.getData('furniture')
              if (!raw) return
              try {
                const item = JSON.parse(raw)
                addFurniture(item, 2, 2)
                toast.success(`Added ${item.name} to room`)
              } catch (err) {
                console.warn('3D drop failed:', err)
              }
            }}
          >
            {viewMode === '2d' ? <RoomCanvas2D ref={canvas2DRef} /> : <RoomViewer3D />}

            {/* Mobile FAB — open sidebar when closed */}
            {!sidebarOpenOnMobile && (
              <button
                onClick={() => setSidebarOpenOnMobile(true)}
                className="lg:hidden fixed bottom-6 left-6 z-40 w-14 h-14 rounded-2xl bg-gradient-to-r from-clay to-clay-dark text-white shadow-lg shadow-clay/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform min-h-[44px] min-w-[44px]"
                aria-label="Open furniture panel"
              >
                <PanelLeft className="h-6 w-6" />
              </button>
            )}

            {/* View Transition Message */}
            <AnimatePresence>
              {viewTransitionMsg && (
                <motion.div
                  className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-5 py-3 bg-darkwood/90 dark:bg-dark-card/95 backdrop-blur-sm text-white text-sm font-medium rounded-xl shadow-xl flex items-center gap-2"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  role="status"
                  aria-live="polite"
                >
                  {viewMode === '3d' ? <Eye className="h-4 w-4 text-clay" /> : <Layers className="h-4 w-4 text-forest-light" />}
                  {viewTransitionMsg}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Size Alert Banner */}
            <AnimatePresence>
              {sizeAlerts.length > 0 && (
                <motion.div
                  className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-20 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-3 shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  role="alert"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <span className="text-sm font-semibold text-red-700 dark:text-red-400">Size Alert</span>
                  </div>
                  <ul className="space-y-0.5">
                    {sizeAlerts.slice(0, 3).map((alert, i) => (
                      <li key={i} className="text-xs text-red-600 dark:text-red-300">{alert}</li>
                    ))}
                    {sizeAlerts.length > 3 && (
                      <li className="text-xs text-red-500">+{sizeAlerts.length - 3} more...</li>
                    )}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Selected Item Floating Actions — Rotate, Duplicate, Delete one by one */}
            {selectedItem && (
              <div className="absolute top-4 right-4 bg-white/95 dark:bg-dark-card/95 backdrop-blur-sm rounded-xl shadow-lg border border-warm-200 dark:border-dark-border p-2 flex items-center gap-1">
                <button
                  onClick={() => rotateFurniture(selectedItem.instanceId)}
                  className="p-2 hover:bg-warm-100 dark:hover:bg-dark-surface rounded-lg transition-colors" title={t('editor.rotate')}>
                  <RotateCw className="h-4 w-4 text-darkwood dark:text-warm-200" />
                </button>
                <button
                  onClick={() => duplicateFurniture(selectedItem.instanceId)}
                  className="p-2 hover:bg-warm-100 dark:hover:bg-dark-surface rounded-lg transition-colors" title={t('editor.duplicate')}>
                  <Copy className="h-4 w-4 text-darkwood dark:text-warm-200" />
                </button>
                <button
                  onClick={() => {
                    removeFurniture(selectedItem.instanceId)
                    toast.success(`"${selectedItem.name}" removed from room`)
                  }}
                  className="inline-flex items-center gap-2 px-3 py-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors text-red-600 dark:text-red-400 font-medium"
                  title={`${t('editor.delete')} — Remove this item (or press Delete key)`}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="text-sm">{t('editor.delete')}</span>
                </button>
              </div>
            )}

            {/* Empty state hint */}
            {furnitureItems.length === 0 && !showTemplates && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center max-w-md mx-auto p-8">
                  <Palette className="h-16 w-16 text-warm-300 dark:text-warm-700 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-darkwood dark:text-warm-200 mb-2">
                    Start Designing
                  </h3>
                  <p className="text-darkwood/50 dark:text-gray-300 mb-4">
                    {t('editor.dragHint')}
                  </p>
                  <div className="text-sm text-darkwood/40 dark:text-warm-600">
                    {roomWidth}m x {roomDepth}m &middot; {rooms[activeRoomIndex]?.name}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Panel */}
      <KeyboardShortcutsPanel open={showShortcuts} onClose={() => setShowShortcuts(false)} />

      {/* Onboarding Tour (re-show from Help button; gate already passed) */}
      <OnboardingTour triggerShow={showTutorial} onComplete={() => setShowTutorial(false)} />

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        open={confirmReset}
        title="Reset Design?"
        message="This will clear all furniture and room settings for the current design. This action cannot be undone."
        confirmLabel="Reset"
        cancelLabel="Keep Editing"
        variant="danger"
        onConfirm={executeReset}
        onCancel={() => setConfirmReset(false)}
      />
      </div>
    </div>
  )
}