import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  Search,
  Grid3X3,
  List,
  Edit2,
  Trash2,
  Copy,
  Download,
  Eye,
  Calendar,
  Folder,
  FileImage,
  ChevronDown,
  Package,
  BarChart2
} from 'lucide-react'
import { Link } from 'react-router-dom'
import useAuthStore from '@/store/useAuthStore'
import useDesignStore from '@/store/useDesignStore'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import ConfirmDialog from '@/components/ConfirmDialog'

export default function MyDesigns() {
  const { userProfile } = useAuthStore()
  const { savedDesigns: userDesigns, loadUserDesigns, deleteDesign, duplicateDesign } = useDesignStore()
  const { t } = useTranslation()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('updatedAt')
  const [loading, setLoading] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState(null)

  useEffect(() => {
    const fetchDesigns = async () => {
      setLoading(true)
      try {
        await loadUserDesigns()
      } catch (error) {
        console.error('Failed to load designs:', error)
      } finally {
        setLoading(false)
      }
    }

    if (userProfile?.uid) {
      fetchDesigns()
    }
  }, [userProfile?.uid, loadUserDesigns])

  const filteredDesigns = userDesigns
    ?.filter(design =>
      design.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      design.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    ?.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'createdAt':
          return new Date(b.createdAt) - new Date(a.createdAt)
        case 'updatedAt':
        default:
          return new Date(b.updatedAt) - new Date(a.updatedAt)
      }
    }) || []

  const handleDuplicate = async (designId) => {
    try {
      await duplicateDesign(designId)
      toast.success('Design duplicated successfully!')
    } catch (error) {
      console.error('Failed to duplicate design:', error)
      toast.error('Failed to duplicate design')
    }
  }

  const handleDelete = async (designId, designName) => {
    setConfirmDelete({ id: designId, name: designName })
  }

  const executeDelete = async () => {
    if (!confirmDelete) return
    try {
      await deleteDesign(confirmDelete.id)
      toast.success(`"${confirmDelete.name}" deleted.`)
    } catch (error) {
      console.error('Failed to delete design:', error)
      toast.error('Failed to delete design')
    } finally {
      setConfirmDelete(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-clay mx-auto mb-4"></div>
          <div className="text-darkwood dark:text-white">{t('myDesigns.loading')}</div>
        </div>
      </div>
    )
  }

  const totalItems = userDesigns?.reduce((sum, d) => sum + (d.furniture?.length || 0), 0) || 0
  const thisWeekCount = userDesigns?.filter(d => new Date(d.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length || 0
  const avgItems = Math.round(totalItems / Math.max(userDesigns?.length || 1, 1))

  return (
    <div className="min-h-screen bg-[#F8F6F3] dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-[#5C3A2A] dark:text-white mb-2 font-display">
            {t('myDesigns.title')}
          </h1>
          <p className="text-darkwood/60 dark:text-white text-base">
            {t('myDesigns.subtitle')}
          </p>
        </motion.div>

        {/* Controls Bar */}
        <motion.div
          className="bg-white dark:bg-dark-card rounded-2xl border border-[#5C3A2A]/10 dark:border-dark-border shadow-sm p-4 sm:p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5C3A2A]/40 h-5 w-5" />
              <input
                type="text"
                placeholder={t('myDesigns.searchDesigns')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#5C3A2A]/20 dark:border-dark-border bg-white dark:bg-dark-surface text-darkwood dark:text-white placeholder:text-darkwood/40 focus:outline-none focus:ring-2 focus:ring-[#5C3A2A]/30 focus:border-[#5C3A2A] transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 rounded-xl border border-[#5C3A2A]/20 dark:border-dark-border bg-white dark:bg-dark-surface text-darkwood dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#5C3A2A]/30 cursor-pointer min-w-[140px]"
              >
                <option value="updatedAt">{t('myDesigns.lastModified')}</option>
                <option value="createdAt">{t('myDesigns.dateCreated')}</option>
                <option value="name">{t('shop.nameAZ')}</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex bg-[#5C3A2A]/5 dark:bg-dark-surface rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? 'bg-[#5C3A2A] text-white shadow-sm'
                      : 'text-darkwood/50 dark:text-white hover:text-[#5C3A2A] dark:hover:text-warm-100'
                  }`}
                  aria-label="Grid view"
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 rounded-lg transition-all ${
                    viewMode === 'list'
                      ? 'bg-[#5C3A2A] text-white shadow-sm'
                      : 'text-darkwood/50 dark:text-white hover:text-[#5C3A2A] dark:hover:text-warm-100'
                  }`}
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* New Design Button */}
              <Link
                to="/editor"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#5C3A2A] hover:bg-[#4A2F21] text-white font-semibold text-sm shadow-lg shadow-[#5C3A2A]/20 transition-all hover:shadow-xl hover:-translate-y-0.5"
              >
                <Plus className="h-4 w-4" />
                {t('myDesigns.newDesign')}
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Designs List/Grid */}
        {filteredDesigns.length === 0 ? (
          <motion.div
            className="text-center py-20 lg:py-28 bg-white dark:bg-dark-card rounded-2xl border border-[#5C3A2A]/10 dark:border-dark-border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-flex items-center justify-center w-28 h-28 rounded-2xl bg-[#5C3A2A]/5 dark:bg-dark-surface mb-8">
              <Folder className="h-14 w-14 text-[#5C3A2A]/50 dark:text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[#5C3A2A] dark:text-white mb-3">
              {searchTerm ? t('myDesigns.noDesignsFound') : t('myDesigns.noDesignsYet')}
            </h3>
            <p className="text-darkwood/60 dark:text-white mb-8 max-w-sm mx-auto">
              {searchTerm
                ? t('myDesigns.adjustSearch')
                : t('myDesigns.createFirstDesc')}
            </p>
            {!searchTerm && (
              <div className="flex flex-col items-center gap-2">
                <ChevronDown className="h-6 w-6 text-[#5C3A2A]/40" aria-hidden />
                <Link
                  to="/editor"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#5C3A2A] hover:bg-[#4A2F21] text-white font-semibold shadow-lg shadow-[#5C3A2A]/20 transition-all hover:shadow-xl hover:-translate-y-0.5"
                >
                  <Plus className="h-5 w-5" />
                  {t('myDesigns.createFirstDesign')}
                </Link>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
            }
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {filteredDesigns.map((design, index) => (
              <motion.div
                key={design.id}
                className={`bg-white dark:bg-dark-card rounded-xl shadow-sm border border-[#5C3A2A]/10 dark:border-dark-border overflow-hidden group hover:shadow-md hover:border-[#5C3A2A]/30 transition-all duration-200 ${
                  viewMode === 'list' ? 'flex items-center space-x-6 p-6' : ''
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* Design Preview */}
                <div className={`relative ${
                  viewMode === 'grid' ? 'aspect-video' : 'w-32 h-24 flex-shrink-0'
                } bg-gradient-to-br from-warm-100 to-warm-50 dark:from-dark-surface dark:to-dark-card`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileImage className="h-12 w-12 text-warm-300 dark:text-dark-border" />
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="text-xs bg-white dark:bg-dark-bg px-2 py-1 rounded-full text-darkwood dark:text-white">
                      {design.furniture?.length || 0} {t('cart.items')}
                    </span>
                  </div>
                  {/* Preview overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Link
                      to={`/editor/${design.id}`}
                      className="bg-white text-darkwood px-4 py-2 rounded-lg font-medium hover:bg-warm-50 transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-2 inline" />
                      {t('myDesigns.open')}
                    </Link>
                  </div>
                </div>

                {/* Design Info */}
                <div className={viewMode === 'grid' ? 'p-6' : 'flex-1'}>
                  <h3 className="font-semibold text-darkwood dark:text-white mb-2 line-clamp-2">
                    {design.name}
                  </h3>
                  {design.description && (
                    <p className="text-sm text-darkwood/50 dark:text-white mb-3 line-clamp-2">
                      {design.description}
                    </p>
                  )}
                  
                  <div className="flex items-center text-xs text-warm-400 dark:text-white mb-4">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(design.updatedAt).toLocaleDateString()}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/editor/${design.id}`}
                      className="flex items-center space-x-1 p-2 bg-clay text-white rounded-lg hover:bg-clay-dark transition-colors flex-1 justify-center"
                    >
                      <Edit2 className="h-4 w-4" />
                      <span className="text-sm">{t('myDesigns.edit')}</span>
                    </Link>
                    
                    <button
                      onClick={() => handleDuplicate(design.id)}
                      className="p-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                      title={t('myDesigns.duplicate')}
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    
                    <button
                      className="p-2 bg-warm-100 dark:bg-dark-surface text-darkwood dark:text-white rounded-lg hover:bg-warm-200 dark:hover:bg-dark-border transition-colors"
                      title={t('myDesigns.export')}
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(design.id, design.name)}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      title={t('myDesigns.delete')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Design Statistics */}
        <motion.div
          className="mt-10 bg-white dark:bg-dark-card rounded-2xl border border-[#5C3A2A]/10 dark:border-dark-border shadow-sm p-6 lg:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-[#5C3A2A] dark:text-white mb-6">
            {t('myDesigns.designStats')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-5 rounded-xl bg-[#F8F6F3] dark:bg-dark-surface border border-[#5C3A2A]/5">
              <Folder className="h-8 w-8 text-[#5C3A2A]/60 dark:text-white mx-auto mb-2" />
              <div className="text-3xl font-bold text-[#5C3A2A] dark:text-white mb-1">
                {userDesigns?.length || 0}
              </div>
              <div className="text-sm text-darkwood/60 dark:text-white">
                {t('myDesigns.totalDesigns')}
              </div>
            </div>
            <div className="text-center p-5 rounded-xl bg-[#F8F6F3] dark:bg-dark-surface border border-[#5C3A2A]/5">
              <Package className="h-8 w-8 text-[#5C3A2A]/60 dark:text-white mx-auto mb-2" />
              <div className="text-3xl font-bold text-[#5C3A2A] dark:text-white mb-1">
                {totalItems}
              </div>
              <div className="text-sm text-darkwood/60 dark:text-white">
                {t('myDesigns.totalItems')}
              </div>
            </div>
            <div className="text-center p-5 rounded-xl bg-[#F8F6F3] dark:bg-dark-surface border border-[#5C3A2A]/5">
              <Calendar className="h-8 w-8 text-[#5C3A2A]/60 dark:text-white mx-auto mb-2" />
              <div className="text-3xl font-bold text-[#5C3A2A] dark:text-white mb-1">
                {thisWeekCount}
              </div>
              <div className="text-sm text-darkwood/60 dark:text-white">
                {t('myDesigns.thisWeek')}
              </div>
            </div>
            <div className="text-center p-5 rounded-xl bg-[#F8F6F3] dark:bg-dark-surface border border-[#5C3A2A]/5">
              <BarChart2 className="h-8 w-8 text-[#5C3A2A]/60 dark:text-white mx-auto mb-2" />
              <div className="text-3xl font-bold text-[#5C3A2A] dark:text-white mb-1">
                {avgItems}
              </div>
              <div className="text-sm text-darkwood/60 dark:text-white">
                {t('myDesigns.avgItemsPerDesign')}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={!!confirmDelete}
          title="Delete Design?"
          message={`Are you sure you want to delete "${confirmDelete?.name || ''}"? This action cannot be undone.`}
          confirmLabel="Delete"
          cancelLabel="Keep"
          variant="danger"
          onConfirm={executeDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      </div>
    </div>
  )
}