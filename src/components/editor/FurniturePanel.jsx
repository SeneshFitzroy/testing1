import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Search, Grid3x3, List, Plus, Info } from 'lucide-react'
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

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="p-4 border-b border-warm-200 dark:border-dark-border">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-darkwood/40 dark:text-warm-500" />
          <input
            type="text"
            placeholder={t('common.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-warm-50 dark:bg-dark-surface border border-warm-200 dark:border-dark-border rounded-lg text-darkwood dark:text-warm-100 placeholder:text-warm-400 dark:placeholder:text-warm-500 focus:outline-none focus:ring-2 focus:ring-clay/50 focus:border-transparent"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-darkwood dark:text-warm-100">
            {filteredFurniture.length} items
          </span>
          <div className="flex bg-warm-100 dark:bg-dark-surface rounded-md p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded text-sm ${
                viewMode === 'grid'
                  ? 'bg-clay text-white'
                  : 'text-darkwood dark:text-warm-100 hover:bg-warm-200 dark:hover:bg-dark-border'
              }`}
            >
              <Grid3x3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded text-sm ${
                viewMode === 'list'
                  ? 'bg-clay text-white'
                  : 'text-darkwood dark:text-warm-100 hover:bg-warm-200 dark:hover:bg-dark-border'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 py-3 border-b border-warm-200 dark:border-dark-border">
        <div className="flex flex-wrap gap-2">
          {FURNITURE_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                selectedCategory === category.id
                  ? 'bg-clay text-white'
                  : 'bg-warm-100 dark:bg-dark-surface text-darkwood dark:text-warm-100 hover:bg-warm-200 dark:hover:bg-dark-border'
              }`}
            >
              <span><IconByName name={category.icon} className="h-4 w-4" /></span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Furniture Items */}
      <div className="flex-1 overflow-auto p-4">
        {filteredFurniture.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-2 gap-4">
              {filteredFurniture.map((item) => (
                <motion.div
                  key={item.id}
                  className="bg-warm-100 dark:bg-dark-surface rounded-lg p-3 cursor-move hover:bg-warm-200 dark:hover:bg-dark-border transition-colors group"
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Item Preview */}
                  <div className="aspect-square bg-white dark:bg-dark-card rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <IconByName name={item.icon} className="h-8 w-8 text-clay" />
                    )}
                  </div>

                  {/* Item Info */}
                  <h4 className="font-medium text-darkwood dark:text-warm-100 mb-1 text-sm">
                    {item.name}
                  </h4>
                  <div className="text-xs text-darkwood/50 dark:text-warm-500 mb-2">
                    {item.width}×{item.depth}×{item.height}m
                  </div>
                  <div className="text-sm font-medium text-clay mb-2">
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
                    <h4 className="font-medium text-darkwood dark:text-warm-100 mb-1 truncate">
                      {item.name}
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-darkwood/50 dark:text-warm-500">
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
            <Grid3x3 className="h-16 w-16 text-warm-300 dark:text-warm-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-darkwood dark:text-warm-100 mb-2">
              No furniture found
            </h3>
            <p className="text-darkwood/50 dark:text-warm-500 mb-4">
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
        <p className="text-xs text-darkwood/50 dark:text-warm-500 text-center flex items-center justify-center gap-1.5">
          <Info className="h-3.5 w-3.5 text-clay" />
          {t('editor.dragHint')} or click the + button to add items
        </p>
      </div>
    </div>
  )
}