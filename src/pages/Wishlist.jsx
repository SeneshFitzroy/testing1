import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart,
  ShoppingCart,
  Trash2,
  Share2,
  Search,
  Grid3X3,
  List,
  Star,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import useCartStore from '@/store/useCartStore'
import useThemeStore from '@/store/useThemeStore'
import { toast } from 'sonner'
import Mini3DPreview from '@/components/Mini3DPreview'
import { useTranslation } from 'react-i18next'

export default function Wishlist() {
  const { wishlistItems: wishlist, removeFromWishlist, addToCart, clearWishlist } = useCartStore()
  const { formatPrice } = useThemeStore()
  const { t } = useTranslation()

  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('dateAdded')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredWishlist = wishlist
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || item.category?.toLowerCase().includes(selectedCategory.toLowerCase())
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name)
        case 'price-low': return a.price - b.price
        case 'price-high': return b.price - a.price
        case 'rating': return (b.rating || 0) - (a.rating || 0)
        default: return new Date(b.addedAt || Date.now()) - new Date(a.addedAt || Date.now())
      }
    })

  const categories = ['all', 'living room', 'bedroom', 'dining room', 'storage', 'lighting']

  const handleAddToCart = (item) => {
    addToCart(item)
    toast.success(`${item.name} ${t('wishlist.addedToCart')}`, {
      description: t('wishlist.movedToCart'),
    })
  }

  const handleRemoveFromWishlist = (item) => {
    removeFromWishlist(item.id)
    toast.success(`${item.name} ${t('wishlist.removedFromWishlist')}`, {
      description: t('wishlist.addBackAnytime'),
    })
  }

  const handleClearWishlist = () => {
    if (wishlist.length === 0) return
    if (confirm(t('wishlist.clearConfirm'))) {
      clearWishlist()
      toast.success(t('wishlist.cleared'))
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
  }

  return (
    <div className="min-h-screen bg-warm-50 dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-darkwood dark:text-white mb-2 flex items-center gap-3 font-display">
                <Heart className="h-8 w-8 text-red-500 fill-current" />
                {t('wishlist.title')}
              </h1>
              <p className="text-darkwood/50 dark:text-white">
                {wishlist.length} {wishlist.length === 1 ? t('cart.item') : t('cart.items')} {t('wishlist.savedForLater')}
              </p>
            </div>
            {wishlist.length > 0 && (
              <motion.button
                onClick={handleClearWishlist}
                className="btn-outline text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 inline-flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Trash2 className="h-4 w-4 shrink-0" />
                {t('cart.clearAll')}
              </motion.button>
            )}
          </div>
        </motion.div>

        {wishlist.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-32 h-32 mx-auto mb-6 bg-red-100/50 dark:bg-red-900/10 rounded-full flex items-center justify-center"
              animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
            >
              <Heart className="h-16 w-16 text-red-300 dark:text-red-400" />
            </motion.div>
            <h3 className="text-2xl font-semibold text-darkwood dark:text-white mb-4">
              {t('wishlist.empty')}
            </h3>
            <p className="text-darkwood/50 dark:text-white mb-8 max-w-md mx-auto">
              {t('wishlist.empty.desc')}
            </p>
            <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              {t('wishlist.startShopping')}
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Controls Bar */}
            <motion.div
              className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-warm-100 dark:border-dark-border p-4 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-warm-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder={t('wishlist.searchWishlist')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10 w-full"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input-field"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat.replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-field"
                >
                  <option value="dateAdded">{t('wishlist.recentlyAdded')}</option>
                  <option value="name">{t('shop.nameAZ')}</option>
                  <option value="price-low">{t('shop.priceLowHigh')}</option>
                  <option value="price-high">{t('shop.priceHighLow')}</option>
                  <option value="rating">{t('shop.highestRated')}</option>
                </select>

                <div className="flex bg-warm-100 dark:bg-dark-surface rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'grid' ? 'bg-clay text-white' : 'text-darkwood/50 dark:text-white'
                    }`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'list' ? 'bg-clay text-white' : 'text-darkwood/50 dark:text-white'
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {filteredWishlist.length !== wishlist.length && (
                <div className="mt-3 text-sm text-darkwood/50 dark:text-white">
                  {t('shop.showing')} {filteredWishlist.length} {t('shop.of')} {wishlist.length} {t('cart.items')}
                </div>
              )}
            </motion.div>

            {/* Wishlist Items */}
            <AnimatePresence mode="wait">
              {filteredWishlist.length === 0 ? (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Search className="h-16 w-16 text-warm-300 dark:text-dark-border mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-darkwood dark:text-white mb-2">
                    {t('wishlist.noMatch')}
                  </h3>
                  <p className="text-darkwood/50 dark:text-white">
                    {t('wishlist.adjustSearch')}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                      : 'space-y-4'
                  }
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <AnimatePresence>
                    {filteredWishlist.map((item) => (
                      <motion.div
                        key={item.id}
                        variants={itemVariants}
                        layout
                        className={`bg-white dark:bg-dark-card rounded-xl shadow-sm border border-warm-100 dark:border-dark-border overflow-hidden group hover:shadow-lg transition-all duration-300 ${
                          viewMode === 'list' ? 'flex items-center' : ''
                        }`}
                        whileHover={{ y: -2 }}
                      >
                        <div className={`relative ${
                          viewMode === 'grid' ? 'aspect-square' : 'w-24 h-24 flex-shrink-0'
                        } bg-gradient-to-br from-warm-100 to-warm-200 dark:from-dark-card dark:to-dark-surface overflow-hidden`}>
                          {item.image && (item.image.startsWith('/') || item.image.startsWith('http')) ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <Mini3DPreview
                              productId={item.id}
                              color={item.selectedColor || item.colors?.[0] || '#8B6F47'}
                            />
                          )}
                          <motion.button
                            onClick={() => handleRemoveFromWishlist(item)}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Heart className="h-4 w-4 fill-current" />
                          </motion.button>
                          <motion.button
                            className="absolute top-2 left-2 p-2 bg-white/90 dark:bg-dark-card/90 text-darkwood dark:text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Share2 className="h-4 w-4" />
                          </motion.button>
                        </div>

                        <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                          <Link to={`/shop/${item.id}`} className="block group/link">
                            <h3 className="font-semibold text-darkwood dark:text-white mb-1 group-hover/link:text-clay transition-colors">
                              {item.name}
                            </h3>
                            <p className="text-sm text-darkwood/50 dark:text-white mb-2 line-clamp-2">
                              {item.description}
                            </p>
                            <div className="flex items-center space-x-2 mb-3">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < Math.round(item.rating || 4.5)
                                        ? 'text-yellow-500 fill-current'
                                        : 'text-warm-300 dark:text-dark-border'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-warm-400">({item.rating || 4.5})</span>
                            </div>
                            <div className="text-lg font-bold text-clay mb-4">
                              {formatPrice(item.price)}
                              {item.originalPrice && (
                                <span className="text-sm text-warm-400 line-through ml-2">
                                  {formatPrice(item.originalPrice)}
                                </span>
                              )}
                            </div>
                          </Link>
                          <div className="flex items-stretch gap-2">
                            <motion.button
                              onClick={() => handleAddToCart(item)}
                              className="flex-1 btn-primary text-sm inline-flex items-center justify-center gap-2 min-h-[44px]"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <ShoppingCart className="h-4 w-4 shrink-0" />
                              {t('shop.addToCart')}
                            </motion.button>
                            <motion.button
                              onClick={() => handleRemoveFromWishlist(item)}
                              className="btn-outline text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 inline-flex items-center justify-center min-h-[44px] min-w-[44px] shrink-0"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {filteredWishlist.length > 0 && (
              <motion.div
                className="mt-8 bg-white dark:bg-dark-card rounded-xl shadow-sm border border-warm-100 dark:border-dark-border p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="font-semibold text-darkwood dark:text-white mb-4">
                  {t('wishlist.quickActions')}
                </h3>
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                  <motion.button
                    onClick={() => {
                      filteredWishlist.forEach(item => addToCart(item))
                      toast.success(`${filteredWishlist.length} items added to cart!`)
                    }}
                    className="btn-primary flex-1 inline-flex items-center justify-center gap-2 min-h-[48px]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ShoppingCart className="h-4 w-4 shrink-0" />
                    {t('wishlist.addAllToCart')} ({filteredWishlist.length})
                  </motion.button>
                  <Link
                    to="/shop"
                    className="btn-outline flex-1 inline-flex items-center justify-center min-h-[48px]"
                  >
                    {t('cart.continueShopping')}
                  </Link>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
}