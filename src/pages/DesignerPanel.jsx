import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import {
  MessageSquare, Star, CheckCircle, XCircle, Clock, Eye, Send,
  Users, Palette, FolderOpen, Filter, Search, ChevronDown, AlertTriangle,
  ThumbsUp, ArrowRight, Loader2, FileText, Share2, Download, Mail, PenSquare, Plus,
  RefreshCw, StickyNote, SortAsc, Zap
} from 'lucide-react'
import { jsPDF } from 'jspdf'
import { toast } from 'sonner'
import { collection, getDocs, doc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { seedDemoDesignsToFirestore } from '@/lib/designService'
import useAuthStore from '@/store/useAuthStore'

const STATUS_CONFIG = {
  pending: { label: 'Pending Review', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: Clock },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
  revision: { label: 'Needs Revision', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: AlertTriangle },
  completed: { label: 'Completed', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: ThumbsUp },
}

export default function DesignerPanel() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, userProfile } = useAuthStore()
  const [designs, setDesigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDesign, setSelectedDesign] = useState(null)
  const [comment, setComment] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sortBy, setSortBy] = useState('newest') // newest, oldest, client, status
  const [designerNotes, setDesignerNotes] = useState('')
  const [savingNotes, setSavingNotes] = useState(false)

  const loadDesigns = async () => {
    setLoading(true)
    try {
      const snap = await getDocs(collection(db, 'designs'))
      let data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      if (data.length === 0) {
        await seedDemoDesignsToFirestore()
        const snap2 = await getDocs(collection(db, 'designs'))
        data = snap2.docs.map(d => ({ id: d.id, ...d.data() }))
      }
      setDesigns(data.length > 0 ? data : getDemoDesigns())
    } catch (err) {
      console.error('Failed to load designs:', err)
      setDesigns(getDemoDesigns())
    } finally {
      setLoading(false)
    }
  }

  const handleLoadDemoData = () => {
    setDesigns(getDemoDesigns())
    setSelectedDesign(null)
    setFilterStatus('all')
    setSearchQuery('')
    toast.success('Demo designs loaded. All features are fully functional.')
  }

  const handleExportAllPDF = () => {
    if (filteredDesigns.length === 0) {
      toast.error('No designs to export. Load demo data or add designs first.')
      return
    }
    try {
      const pdf = new jsPDF({ unit: 'pt', format: 'a4' })
      filteredDesigns.forEach((design, idx) => {
        if (idx > 0) pdf.addPage()
        let y = 40
        pdf.setFontSize(18)
        pdf.text(design.name || 'Room Design', 40, y)
        y += 25
        pdf.setFontSize(10)
        pdf.text(`By ${design.userName || 'Customer'} · ${design.userEmail || ''}`, 40, y)
        y += 20
        pdf.text(`Status: ${STATUS_CONFIG[design.status]?.label || design.status} | Created: ${new Date(design.createdAt || Date.now()).toLocaleDateString()}`, 40, y)
        y += 25
        pdf.setFontSize(11)
        pdf.text('Rooms & Furniture', 40, y)
        y += 18
        design.rooms?.forEach((room, i) => {
          pdf.setFontSize(10)
          pdf.text(`${i + 1}. ${room.name} (${room.furnitureItems?.length || 0} items)`, 40, y)
          y += 16
          room.furnitureItems?.forEach((item) => {
            pdf.text(`   · ${item.name}`, 50, y)
            y += 12
          })
          y += 4
        })
      })
      pdf.save(`Lee-Roo-Designs-Export-${new Date().toISOString().slice(0, 10)}.pdf`)
      toast.success(`Exported ${filteredDesigns.length} design(s) as PDF`)
    } catch (err) {
      console.error('Export failed:', err)
      toast.error('Failed to export PDF')
    }
  }

  useEffect(() => { loadDesigns() }, [])

  // Keyboard shortcuts: Ctrl+R refresh, Ctrl+N new design (skip when typing in inputs)
  useEffect(() => {
    const handler = (e) => {
      if (!e.ctrlKey && !e.metaKey) return
      const tag = document.activeElement?.tagName?.toLowerCase()
      if (tag === 'input' || tag === 'textarea' || document.activeElement?.isContentEditable) return
      if (e.key === 'r') { e.preventDefault(); loadDesigns(); toast.success('Refreshed') }
      if (e.key === 'n') { e.preventDefault(); navigate('/editor') }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [navigate])

  useEffect(() => {
    setDesignerNotes(selectedDesign?.designerNotes ?? '')
  }, [selectedDesign?.id, selectedDesign?.designerNotes])

  const getDemoDesigns = () => [
    {
      id: 'demo-1',
      name: 'Modern Living Room',
      userName: 'John Doe',
      userEmail: 'john@example.com',
      status: 'completed',
      rooms: [{ name: 'Living Room', furnitureItems: [{ name: 'Sofa' }, { name: 'Table' }, { name: 'Lamp' }] }],
      createdAt: new Date().toISOString(),
      comments: [],
      roomWidth: 6, roomDepth: 5, roomHeight: 3,
    },
    {
      id: 'demo-2',
      name: 'Cozy Bedroom Setup',
      userName: 'Jane Smith',
      userEmail: 'jane@example.com',
      status: 'approved',
      rooms: [{ name: 'Bedroom', furnitureItems: [{ name: 'Bed' }, { name: 'Nightstand' }, { name: 'Wardrobe' }, { name: 'Desk' }] }],
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      comments: [
        { author: 'Sarah Henderson', text: 'Great layout! Love the placement of the bed near the window.', date: new Date(Date.now() - 43200000).toISOString(), rating: 5 }
      ],
      roomWidth: 5, roomDepth: 4, roomHeight: 3,
    },
    {
      id: 'demo-3',
      name: 'Office Space Design',
      userName: 'Mike Johnson',
      userEmail: 'mike@example.com',
      status: 'revision',
      rooms: [{ name: 'Office', furnitureItems: [{ name: 'Desk' }, { name: 'Chair' }] }],
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      comments: [
        { author: 'Michael Chen', text: 'Consider adding more storage and adjusting the desk orientation for better lighting.', date: new Date(Date.now() - 86400000).toISOString(), rating: 3 }
      ],
      roomWidth: 4, roomDepth: 3, roomHeight: 3,
    },
    {
      id: 'demo-4',
      name: 'Dining Room Redesign',
      userName: 'Emma Wilson',
      userEmail: 'emma@example.com',
      status: 'completed',
      rooms: [{ name: 'Dining Room', furnitureItems: [{ name: 'Dining Table' }, { name: 'Chairs' }, { name: 'Sideboard' }, { name: 'Pendant Light' }] }],
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      comments: [
        { author: 'Sarah Henderson', text: 'Final design approved. Client loved the layout!', date: new Date(Date.now() - 86400000).toISOString(), rating: 5 }
      ],
      roomWidth: 5, roomDepth: 4, roomHeight: 3,
    },
  ]

  const handleAddComment = async (designId) => {
    if (!comment.trim()) {
      toast.error('Please enter a comment')
      return
    }
    setSubmitting(true)
    const newComment = {
      author: userProfile?.name || 'Designer',
      text: comment.trim(),
      date: new Date().toISOString(),
      designerId: user?.uid,
    }

    try {
      // Try updating Firestore
      await updateDoc(doc(db, 'designs', designId), {
        comments: arrayUnion(newComment),
        updatedAt: serverTimestamp(),
      })
      // Update local state
      setDesigns(prev => prev.map(d =>
        d.id === designId
          ? { ...d, comments: [...(d.comments || []), newComment] }
          : d
      ))
      setSelectedDesign(prev => prev ? { ...prev, comments: [...(prev.comments || []), newComment] } : prev)
      toast.success('Comment added successfully')
    } catch {
      // Offline/demo mode — update local state only
      setDesigns(prev => prev.map(d =>
        d.id === designId
          ? { ...d, comments: [...(d.comments || []), newComment] }
          : d
      ))
      setSelectedDesign(prev => prev ? { ...prev, comments: [...(prev.comments || []), newComment] } : prev)
      toast.success('Comment added (local)')
    }
    setComment('')
    setSubmitting(false)
  }

  const handleUpdateStatus = async (designId, newStatus) => {
    try {
      await updateDoc(doc(db, 'designs', designId), { status: newStatus, updatedAt: serverTimestamp() })
    } catch {
      // Offline mode
    }
    setDesigns(prev => prev.map(d => d.id === designId ? { ...d, status: newStatus } : d))
    setSelectedDesign(prev => prev && prev.id === designId ? { ...prev, status: newStatus } : prev)
    toast.success(`Status updated to ${STATUS_CONFIG[newStatus]?.label}`)
  }

  const handleCopyShareLink = (design) => {
    const url = `${window.location.origin}/shared/${design.id}`
    navigator.clipboard.writeText(url)
      .then(() => toast.success('Share link copied! Send to client for reference.'))
      .catch(() => toast.error('Could not copy. Try selecting and copying manually.'))
  }

  const handleExportDesignPDF = (design) => {
    try {
      const pdf = new jsPDF({ unit: 'pt', format: 'a4' })
      let y = 40
      pdf.setFontSize(20)
      pdf.text(design.name || 'Room Design', 40, y)
      y += 30
      pdf.setFontSize(10)
      pdf.text(`By ${design.userName || 'Customer'} · ${design.userEmail || ''}`, 40, y)
      y += 25
      pdf.text(`Status: ${STATUS_CONFIG[design.status]?.label || design.status}`, 40, y)
      pdf.text(`Created: ${new Date(design.createdAt || Date.now()).toLocaleDateString()}`, 200, y)
      y += 30
      pdf.text(`Dimensions: ${design.roomWidth || 5}m × ${design.roomDepth || 4}m × ${design.roomHeight || 3}m`, 40, y)
      y += 30
      pdf.setFontSize(12)
      pdf.text('Rooms & Furniture', 40, y)
      y += 20
      design.rooms?.forEach((room, i) => {
        pdf.setFontSize(10)
        pdf.text(`${i + 1}. ${room.name} (${room.furnitureItems?.length || 0} items)`, 40, y)
        y += 18
        room.furnitureItems?.forEach((item) => {
          pdf.text(`   · ${item.name}`, 50, y)
          y += 14
        })
        y += 5
      })
      if (design.comments?.length > 0) {
        y += 15
        pdf.setFontSize(12)
        pdf.text('Comments', 40, y)
        y += 20
        design.comments.slice(0, 5).forEach((c) => {
          pdf.setFontSize(9)
          pdf.text(`${c.author}: ${c.text}`, 40, y, { maxWidth: 500 })
          y += 20
        })
      }
      pdf.save(`${(design.name || 'design').replace(/\s+/g, '-')}.pdf`)
      toast.success('Design exported as PDF')
    } catch (err) {
      console.error('PDF export failed:', err)
      toast.error('Failed to export PDF')
    }
  }

  const filteredDesigns = designs
    .filter(d => {
      if (filterStatus === 'attention') return d.status === 'pending' || d.status === 'revision'
      if (filterStatus !== 'all' && d.status !== filterStatus) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const matches = (str) => (str || '').toLowerCase().includes(q)
        if (!matches(d.name) && !matches(d.userName) && !matches(d.userEmail)) return false
      }
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      if (sortBy === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
      if (sortBy === 'client') return (a.userName || '').localeCompare(b.userName || '')
      if (sortBy === 'status') return (a.status || '').localeCompare(b.status || '')
      return 0
    })

  const stats = {
    total: designs.length,
    pending: designs.filter(d => d.status === 'pending').length,
    approved: designs.filter(d => d.status === 'approved').length,
    revision: designs.filter(d => d.status === 'revision').length,
    completed: designs.filter(d => d.status === 'completed').length,
  }

  const handleSaveDesignerNotes = async () => {
    if (!selectedDesign?.id) return
    setSavingNotes(true)
    try {
      await updateDoc(doc(db, 'designs', selectedDesign.id), {
        designerNotes: designerNotes.trim(),
        updatedAt: serverTimestamp(),
      })
      setDesigns(prev => prev.map(d => d.id === selectedDesign.id ? { ...d, designerNotes: designerNotes.trim() } : d))
      setSelectedDesign(prev => prev?.id === selectedDesign.id ? { ...prev, designerNotes: designerNotes.trim() } : prev)
      toast.success('Private notes saved')
    } catch {
      setDesigns(prev => prev.map(d => d.id === selectedDesign.id ? { ...d, designerNotes: designerNotes.trim() } : d))
      setSelectedDesign(prev => prev?.id === selectedDesign.id ? { ...prev, designerNotes: designerNotes.trim() } : prev)
      toast.success('Notes saved (local)')
    }
    setSavingNotes(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50 dark:bg-dark-bg">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-clay" />
          <p className="text-darkwood dark:text-white">Loading designs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-warm-50 dark:bg-dark-bg">
      {/* Hero — Design Workflow Hub */}
      <section className="bg-gradient-to-br from-darkwood via-clay-dark to-clay text-white py-14 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div>
              <p className="text-white/60 text-xs uppercase tracking-widest mb-1">Design Workflow Hub</p>
              <h1 className="text-3xl sm:text-4xl font-black font-display mb-3 tracking-tight">Designer Panel</h1>
              <p className="text-white/80 text-base sm:text-lg max-w-xl leading-relaxed mb-5">
                Review, comment on, and manage customer room designs. Keep your projects organised and clients informed.
              </p>
              <Link
                to="/editor"
                title="Create New Design (Ctrl+N)"
                className="inline-flex items-center gap-2 px-5 py-3 bg-white text-gray-900 hover:bg-warm-50 rounded-xl font-semibold text-sm transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
              >
                <Plus className="h-4 w-4" /> Create New Design
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 w-full sm:w-auto">
              {[
                { label: 'Total', value: stats.total, sub: 'designs' },
                { label: 'Needs attention', value: stats.pending + stats.revision, sub: 'action required' },
                { label: 'Approved', value: stats.approved, sub: '' },
                { label: 'Revision', value: stats.revision, sub: '' },
                { label: 'Completed', value: stats.completed, sub: '' },
              ].map((s, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-4 text-center border border-white/10">
                  <div className="text-2xl sm:text-3xl font-bold tabular-nums">{s.value}</div>
                  <div className="text-xs text-white/80 font-medium mt-0.5">{s.label}</div>
                  {s.sub && <div className="text-[10px] text-white/50 mt-0.5">{s.sub}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar: filters, search, sort, actions */}
        <div className="mb-8">
          <div className="flex flex-col gap-6">
            {/* Filter row */}
            <div>
              <p className="text-xs font-semibold text-darkwood dark:text-white uppercase tracking-wider mb-3">Filter by status</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: 'All designs' },
                  { id: 'attention', label: 'Needs attention', icon: Zap },
                  { id: 'pending', label: STATUS_CONFIG.pending.label },
                  { id: 'approved', label: STATUS_CONFIG.approved.label },
                  { id: 'revision', label: STATUS_CONFIG.revision.label },
                  { id: 'completed', label: STATUS_CONFIG.completed.label },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setFilterStatus(id)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all inline-flex items-center gap-1.5 ${
                      filterStatus === id
                        ? 'bg-clay text-white shadow-md'
                        : 'bg-white dark:bg-dark-card text-darkwood/70 dark:text-white border border-warm-200 dark:border-dark-border hover:border-clay hover:text-clay dark:hover:text-clay'
                    }`}
                  >
                    {Icon && <Icon className="h-3.5 w-3.5" />}
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search, sort, actions row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-darkwood dark:text-white" />
                <input
                  type="text"
                  placeholder="Search by design name, client, or email..."
                  aria-label="Search designs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-warm-200 dark:border-dark-border bg-white dark:bg-dark-card rounded-xl text-sm text-darkwood dark:!text-white placeholder:text-warm-400 dark:placeholder:!text-white focus:ring-2 focus:ring-clay/30 focus:border-clay outline-none"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 rounded-xl text-sm border border-warm-200 dark:border-dark-border bg-white dark:bg-dark-card text-darkwood dark:text-white focus:ring-2 focus:ring-clay/30 outline-none"
                aria-label="Sort designs"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="client">By client name</option>
                <option value="status">By status</option>
              </select>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => loadDesigns()}
                  className="p-2.5 rounded-xl border border-warm-200 dark:border-dark-border text-darkwood dark:text-white hover:border-clay hover:text-clay transition-all"
                  title="Refresh (Ctrl+R)"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
                {filteredDesigns.length > 0 && (
                  <button
                    onClick={handleExportAllPDF}
                    className="px-4 py-2.5 rounded-xl border border-warm-200 dark:border-dark-border text-darkwood/70 dark:text-white hover:border-clay hover:text-clay hover:bg-clay/5 dark:hover:bg-clay/10 transition-all inline-flex items-center gap-2"
                    title="Export filtered designs as PDF"
                  >
                    <FileText className="h-4 w-4" /> Export PDF
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Design queue — left column */}
          <div className="lg:col-span-1">
            <h2 className="text-sm font-semibold text-darkwood dark:text-white mb-4 flex items-center gap-2">
              <FolderOpen className="h-4 w-4" /> Design queue
            </h2>
            <div className="space-y-3">
              {filteredDesigns.length === 0 ? (
                <div className="bg-white dark:bg-dark-card rounded-2xl p-10 border border-warm-200 dark:border-dark-border text-center">
                  <FolderOpen className="h-14 w-14 text-warm-300 dark:text-white mx-auto mb-4 opacity-60" />
                  <p className="text-darkwood dark:text-white mb-1 font-medium">
                    {designs.length === 0 ? 'No designs yet' : 'No designs match filters'}
                  </p>
                  <p className="text-sm text-darkwood/70 dark:text-white mb-6">
                    {designs.length === 0 ? 'Load demo data to explore features, or start a new design.' : 'Try changing filters or clearing search.'}
                  </p>
                  {designs.length === 0 ? (
                    <button
                      onClick={handleLoadDemoData}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-clay hover:bg-clay-dark text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
                    >
                      <FolderOpen className="h-4 w-4" /> Load Demo Designs
                    </button>
                  ) : (
                    <button
                      onClick={() => { setFilterStatus('all'); setSearchQuery('') }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-warm-100 dark:bg-dark-surface text-darkwood dark:text-white font-medium rounded-xl hover:bg-warm-200 dark:hover:bg-dark-border transition-all"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                filteredDesigns.map(design => {
                  const statusCfg = STATUS_CONFIG[design.status] || STATUS_CONFIG.pending
                  const StatusIcon = statusCfg.icon
                  return (
                    <motion.button
                      key={design.id}
                      onClick={() => setSelectedDesign(design)}
                      className={`w-full text-left bg-white dark:bg-dark-card rounded-2xl p-5 border transition-all hover:shadow-lg ${
                        selectedDesign?.id === design.id
                          ? 'border-clay shadow-md ring-2 ring-clay/20'
                          : 'border-warm-200 dark:border-dark-border hover:border-clay/50'
                      }`}
                      whileHover={{ y: -2 }}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="font-semibold text-darkwood dark:text-white text-sm leading-tight">{design.name}</h3>
                        <span className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${statusCfg.color}`}>
                          <StatusIcon className="h-3 w-3" /> {statusCfg.label}
                        </span>
                      </div>
                      <p className="text-xs text-darkwood/70 dark:text-white mb-3 flex items-center gap-1.5">
                        <Users className="h-3 w-3" />
                        {design.userName || 'Customer'}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-darkwood/60 dark:!text-white">
                        <span>{design.rooms?.reduce((acc, r) => acc + (r.furnitureItems?.length || 0), 0) || 0} items</span>
                        <span>{design.rooms?.length || 1} rooms</span>
                        <span>{design.comments?.length || 0} comments</span>
                      </div>
                    </motion.button>
                  )
                })
              )}
            </div>
          </div>

          {/* Detail panel — right column */}
          <div className="lg:col-span-2">
            {selectedDesign ? (
              <div className="bg-white dark:bg-dark-card rounded-2xl border border-warm-200 dark:border-dark-border overflow-hidden shadow-sm">
                {/* Header */}
                <div className="p-6 sm:p-8 border-b border-warm-200 dark:border-dark-border bg-warm-50/50 dark:bg-dark-surface/80">
                  <h2 className="text-2xl font-bold text-darkwood dark:text-white font-display mb-1">{selectedDesign.name}</h2>
                  <p className="text-sm text-darkwood dark:text-white">
                    Client: {selectedDesign.userName || 'Customer'} • {selectedDesign.userEmail || '—'}
                  </p>

                  {/* Client link sharing — primary action */}
                  <div className="mb-4 p-4 bg-clay/10 dark:bg-clay/5 rounded-xl border border-clay/20">
                    <p className="text-sm font-medium text-darkwood dark:text-white mb-2">Share live design with client</p>
                    <p className="text-xs text-darkwood/60 dark:text-white mb-3">Send a link instead of exporting PDF. Client opens the design directly in the editor.</p>
                    <button
                      onClick={() => handleCopyShareLink(selectedDesign)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-clay hover:bg-clay-dark text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-clay/20"
                      title="Copy live link"
                    >
                      <Share2 className="h-5 w-5" /> Share with Client
                    </button>
                  </div>

                  {/* Quick actions */}
                  <div className="mt-6 flex flex-wrap gap-2">
                    <Link
                      to={`/editor/${selectedDesign.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-clay hover:bg-clay-dark text-white font-medium rounded-xl text-sm transition-all"
                    >
                      <PenSquare className="h-4 w-4" /> Open in Editor
                    </Link>
                    {selectedDesign.userEmail && (
                      <a
                        href={`mailto:${selectedDesign.userEmail}`}
                        className="inline-flex items-center gap-2 px-4 py-2.5 border border-warm-200 dark:border-dark-border text-darkwood dark:text-white hover:border-clay hover:text-clay rounded-xl text-sm font-medium transition-all"
                      >
                        <Mail className="h-4 w-4" /> Email client
                      </a>
                    )}
                    <button
                      onClick={() => handleExportDesignPDF(selectedDesign)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 border border-warm-200 dark:border-dark-border text-darkwood dark:text-white hover:border-clay hover:text-clay rounded-xl text-sm font-medium transition-all"
                      title="Export as PDF"
                    >
                      <FileText className="h-4 w-4" /> Export PDF
                    </button>
                  </div>

                  {/* Status controls */}
                  <div className="mt-6 pt-6 border-t border-warm-200 dark:border-dark-border">
                    <p className="text-xs font-semibold text-darkwood dark:text-white uppercase tracking-wider mb-3">Update status</p>
                    <div className="flex flex-wrap gap-2">
                      {['pending', 'approved', 'revision', 'completed'].map(s => {
                        const cfg = STATUS_CONFIG[s]
                        const Icon = cfg.icon
                        return (
                          <button
                            key={s}
                            onClick={() => handleUpdateStatus(selectedDesign.id, s)}
                            className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                              selectedDesign.status === s
                                ? `${cfg.color} border border-transparent`
                                : 'border border-warm-200 dark:border-dark-border text-darkwood dark:text-white hover:border-clay hover:text-clay'
                            }`}
                            title={cfg.label}
                          >
                            <Icon className="h-4 w-4" /> {cfg.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Specs grid */}
                <div className="p-6 sm:p-8 border-b border-warm-200 dark:border-dark-border">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-warm-50 dark:bg-dark-surface rounded-xl p-4 text-center">
                      <div className="text-xl font-bold text-darkwood dark:text-white">{selectedDesign.rooms?.length || 1}</div>
                      <div className="text-xs text-darkwood dark:text-white font-medium mt-0.5">Rooms</div>
                    </div>
                    <div className="bg-warm-50 dark:bg-dark-surface rounded-xl p-4 text-center">
                      <div className="text-xl font-bold text-darkwood dark:text-white">
                        {selectedDesign.rooms?.reduce((acc, r) => acc + (r.furnitureItems?.length || 0), 0) || 0}
                      </div>
                      <div className="text-xs text-darkwood dark:text-white font-medium mt-0.5">Items</div>
                    </div>
                    <div className="bg-warm-50 dark:bg-dark-surface rounded-xl p-4 text-center">
                      <div className="text-xl font-bold text-darkwood dark:text-white">
                        {selectedDesign.roomWidth || 5}m × {selectedDesign.roomDepth || 4}m
                      </div>
                      <div className="text-xs text-darkwood dark:text-white font-medium mt-0.5">Dimensions</div>
                    </div>
                    <div className="bg-warm-50 dark:bg-dark-surface rounded-xl p-4 text-center">
                      <div className="text-xl font-bold text-darkwood dark:text-white">
                        {new Date(selectedDesign.createdAt || Date.now()).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-darkwood dark:text-white font-medium mt-0.5">Created</div>
                    </div>
                  </div>

                  {/* Rooms & furniture */}
                  {selectedDesign.rooms?.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-darkwood dark:text-white mb-3 flex items-center gap-2">
                        <Palette className="h-4 w-4 text-clay" /> Rooms & furniture
                      </h4>
                      <div className="space-y-3">
                        {selectedDesign.rooms.map((room, idx) => (
                          <div key={idx} className="bg-warm-50 dark:bg-dark-surface rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium text-darkwood dark:text-white">{room.name}</span>
                              <span className="text-xs text-darkwood dark:text-white">({room.furnitureItems?.length || 0} items)</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {room.furnitureItems?.map((item, fi) => (
                                <span key={fi} className="px-2.5 py-1 bg-white dark:bg-dark-card rounded-lg text-xs text-darkwood/70 dark:text-white border border-warm-200 dark:border-dark-border">
                                  {item.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Private notes */}
                <div className="p-6 sm:p-8 border-b border-warm-200 dark:border-dark-border bg-amber-50/30 dark:bg-amber-900/5">
                  <h4 className="text-sm font-semibold text-darkwood dark:text-white mb-2 flex items-center gap-2">
                    <StickyNote className="h-4 w-4 text-clay" />
                    Private notes (designer only)
                  </h4>
                  <p className="text-xs text-darkwood dark:text-white mb-3">Client preferences, budget notes, follow-up reminders — not visible to clients.</p>
                  <textarea
                    value={designerNotes}
                    onChange={(e) => setDesignerNotes(e.target.value)}
                    placeholder="e.g. Client prefers natural wood finish. Follow up next week."
                    rows={3}
                    className="w-full px-4 py-3 border border-warm-200 dark:border-dark-border bg-white dark:bg-dark-card rounded-xl text-sm text-darkwood dark:text-white placeholder:text-warm-400 dark:placeholder:text-white focus:ring-2 focus:ring-clay/30 outline-none resize-none"
                  />
                  <button
                    onClick={handleSaveDesignerNotes}
                    disabled={savingNotes}
                    className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-clay/20 hover:bg-clay/30 text-clay font-semibold rounded-xl text-sm disabled:opacity-50 transition-all"
                  >
                    {savingNotes ? 'Saving...' : 'Save notes'}
                  </button>
                </div>

                {/* Comments */}
                <div className="p-6 sm:p-8">
                  <h3 className="text-lg font-bold text-darkwood dark:text-white mb-4 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-clay" />
                    Comments & feedback ({selectedDesign.comments?.length || 0})
                  </h3>

                  <div className="space-y-4 mb-6 max-h-72 overflow-y-auto">
                    {(!selectedDesign.comments || selectedDesign.comments.length === 0) && (
                      <div className="text-center py-10 rounded-xl bg-warm-50 dark:bg-dark-surface/50 border border-dashed border-warm-200 dark:border-dark-border">
                        <MessageSquare className="h-10 w-10 mx-auto mb-3 text-warm-300 dark:text-white opacity-60" />
                        <p className="text-sm font-medium text-darkwood dark:text-white mb-1">No comments yet</p>
                        <p className="text-xs text-darkwood dark:text-white">Add your first review below.</p>
                      </div>
                    )}
                    {selectedDesign.comments?.map((c, ci) => (
                      <div key={ci} className="bg-warm-50 dark:bg-dark-surface rounded-xl p-4 border border-warm-100 dark:border-dark-border">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-forest to-forest-light rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {(c.author || 'D').charAt(0)}
                            </div>
                            <span className="text-sm font-semibold text-darkwood dark:text-white">{c.author}</span>
                          </div>
                          <span className="text-xs text-darkwood dark:text-white">
                            {c.date ? new Date(c.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                        <p className="text-sm text-darkwood/70 dark:text-white leading-relaxed">{c.text}</p>
                        {c.rating && (
                          <div className="flex items-center gap-0.5 mt-2">
                            {[1,2,3,4,5].map(s => (
                              <Star key={s} className={`h-3.5 w-3.5 ${s <= c.rating ? 'text-amber-500 fill-amber-500' : 'text-warm-200 dark:text-dark-border'}`} />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add comment */}
                  <div className="border-t border-warm-200 dark:border-dark-border pt-6">
                    <label className="text-sm font-semibold text-darkwood dark:text-white mb-2 block">Add your review</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your feedback on this design..."
                      rows={3}
                      className="w-full px-4 py-3 border border-warm-200 dark:border-dark-border bg-warm-50 dark:bg-dark-surface rounded-xl text-sm text-darkwood dark:text-white placeholder:text-warm-400 dark:placeholder:text-white focus:ring-2 focus:ring-clay/30 focus:border-clay outline-none resize-none mb-4"
                    />
                    <button
                      onClick={() => handleAddComment(selectedDesign.id)}
                      disabled={!comment.trim() || submitting}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-clay hover:bg-clay-dark text-white font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg text-sm"
                    >
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      {submitting ? 'Sending...' : 'Submit comment'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-dark-card rounded-2xl border border-warm-200 dark:border-dark-border p-16 text-center">
                <Eye className="h-20 w-20 text-warm-400 dark:text-white mx-auto mb-5 dark:opacity-90" />
                <h3 className="text-xl font-bold text-darkwood dark:text-white mb-2">Select a design to review</h3>
                <p className="text-darkwood/70 dark:text-white max-w-sm mx-auto leading-relaxed">
                  Choose a design from the list to view details, add comments, and update its status.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
