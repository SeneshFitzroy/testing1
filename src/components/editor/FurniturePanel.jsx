import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Search, Grid3x3, List, Plus, Info, ChevronDown } from 'lucide-react'
import { EDITOR_FURNITURE, FURNITURE_CATEGORIES } from '@/lib/constants'
import { IconByName } from '@/lib/iconMap'
import useDesignStore from '@/store/useDesignStore'
import useThemeStore from '@/store/useThemeStore'

export default function FurniturePanel() {
  const { t } = useTranslation()
  const { addFurniture } = useDesignStore()
  const { formatPrice } = useThemeStore()

  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [categoryOpen, setCategoryOpen] = useState(false)
  const categoryRef = useRef(null)
  useEffect(() => {
    const handler = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) setCategoryOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // EDITOR_FURNITURE = e-commerce shop products only (all have images)
  const filteredFurniture = EDITOR_FURNITURE.filter(item => {
    const cat = item.shopCategory
    const matchesCategory = selectedCategory === 'all' || cat === selectedCategory
    const matchesSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (item.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleAddFurniture = (furnitureItem) => {
    addFurniture(furnitureItem)
  }

  const handleDragStart = (e, furnitureItem) => {
    e.dataTransfer.setData('furniture', JSON.stringify(furnitureItem))
  }

  const currentCategory = FURNITURE_CATEGORIES.find(c => c.id === selectedCategory) || FURNITURE_CATEGORIES[0]

  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Search */}
      <div className="px-4 pt-3 pb-2 border-b border-warm-200 dark:border-dark-border">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-darkwood/40 dark:text-white" />
          <input
            type="text"
            placeholder={t('common.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-warm-50 dark:bg-dark-surface border border-warm-200 dark:border-dark-border rounded-lg text-darkwood dark:text-white placeholder:text-warm-400 dark:placeholder:text-warm-500 focus:outline-none focus:ring-2 focus:ring-clay/50 focus:border-transparent"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-darkwood dark:text-white">
            {filteredFurniture.length} items
          </span>
          <div className="flex bg-warm-100 dark:bg-dark-surface rounded-md p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded text-sm ${
                viewMode === 'grid'
                  ? 'bg-clay text-white'
                  : 'text-darkwood dark:text-white hover:bg-warm-200 dark:hover:bg-dark-border'
              }`}
            >
              <Grid3x3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded text-sm ${
                viewMode === 'list'
                  ? 'bg-clay text-white'
                  : 'text-darkwood dark:text-white hover:bg-warm-200 dark:hover:bg-dark-border'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Dropdown */}
      <div className="px-4 py-2 border-b border-warm-200 dark:border-dark-border" ref={categoryRef}>
        <div className="relative">
          <button
            onClick={() => setCategoryOpen(!categoryOpen)}
            className="w-full flex items-center justify-between px-3 py-2 bg-warm-100 dark:bg-dark-surface border border-warm-200 dark:border-dark-border rounded-lg text-sm font-medium text-darkwood dark:text-white hover:bg-warm-200 dark:hover:bg-dark-border transition-colors"
          >
            <span className="flex items-center gap-2">
              <IconByName name={currentCategory.icon} className="h-4 w-4 text-clay" />
              {currentCategory.name}
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${categoryOpen ? 'rotate-180' : ''}`} />
          </button>
          {categoryOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 py-1 bg-white dark:bg-dark-card border border-warm-200 dark:border-dark-border rounded-lg shadow-lg z-50 max-h-56 overflow-y-auto">
              {FURNITURE_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => { setSelectedCategory(category.id); setCategoryOpen(false) }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-clay text-white'
                      : 'text-darkwood dark:text-white hover:bg-warm-100 dark:hover:bg-dark-surface'
                  }`}
                >
                  <IconByName name={category.icon} className="h-4 w-4 flex-shrink-0" />
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Furniture Items — scrollable; reduced padding to lift items higher */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-4 pt-2 pb-6 furniture-scroll overscroll-contain">
        {filteredFurniture.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {filteredFurniture.map((item) => (
                <motion.div
                  key={item.id}
                  className="bg-warm-100 dark:bg-dark-surface rounded-lg p-2.5 sm:p-3 cursor-move hover:bg-warm-200 dark:hover:bg-dark-border transition-colors group"
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Item Preview */}
                  <div className="aspect-square bg-white dark:bg-dark-card rounded-lg mb-2 sm:mb-3 flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <IconByName name={item.icon} className="h-8 w-8 text-clay" />
                    )}
                  </div>

                  {/* Item Info */}
                  <h4 className="font-medium text-darkwood dark:text-white mb-0.5 sm:mb-1 text-xs sm:text-sm truncate" title={item.name}>
                    {item.name}
                  </h4>
                  <div className="text-[10px] sm:text-xs text-darkwood/50 dark:text-white mb-1 sm:mb-2">
                    {item.width}×{item.depth}×{item.height}m
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-clay mb-1.5 sm:mb-2">
                    {formatPrice(item.price)}
                  </div>

                  {/* Quick Add Button */}
                  <button
                    onClick={() => handleAddFurniture(item)}
                    className="w-full py-2 bg-amber-50 dark:bg-amber-900/20 hover:bg-clay hover:text-white text-clay rounded text-sm font-medium transition-colors opacity-0 group-hover:opacity-100 flex items-center justify-center space-x-1"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add</span>
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFurniture.map((item) => (
                <motion.div
                  key={item.id}
                  className="bg-warm-100 dark:bg-dark-surface rounded-lg p-3 cursor-move hover:bg-warm-200 dark:hover:bg-dark-border transition-colors group flex items-center space-x-3"
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  whileHover={{ x: 4 }}
                >
                  {/* Item Preview */}
                  <div className="w-12 h-12 bg-white dark:bg-dark-card rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <IconByName name={item.icon} className="h-5 w-5 text-clay" />
                    )}
                  </div>

                  {/* Item Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-darkwood dark:text-white mb-1 truncate">
                      {item.name}
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-darkwood/50 dark:text-white">
                        {item.width}×{item.depth}×{item.height}m
                      </span>
                      <span className="text-sm font-medium text-clay">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                  </div>

                  {/* Quick Add Button */}
                  <button
                    onClick={() => handleAddFurniture(item)}
                    className="p-2 bg-amber-50 dark:bg-amber-900/20 hover:bg-clay hover:text-white text-clay rounded transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <Grid3x3 className="h-16 w-16 text-warm-300 dark:text-white mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-darkwood dark:text-white mb-2">
              No furniture found
            </h3>
            <p className="text-darkwood/50 dark:text-white mb-4">
              Try adjusting your search or category filter
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="btn-outline text-sm"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>

      {/* Hint */}
      <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border-t border-warm-200 dark:border-dark-border">
        <p className="text-xs text-darkwood/50 dark:text-white text-center flex items-center justify-center gap-1.5">
          <Info className="h-3.5 w-3.5 text-clay" />
          {t('editor.dragHint')} or click the + button to add items
        </p>
      </div>
    </div>
  )
}