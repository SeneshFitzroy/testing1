import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import { 
  Search, 
  Grid3X3, 
  List, 
  Plus,
  Heart,
  ShoppingCart,
  Star,
  Tag,
  SlidersHorizontal,
  X,
  ChevronDown,
  Truck,
  Shield,
  RotateCcw,
  Eye,
  Package,
  Home,
  Armchair,
  Table2,
  Archive,
  BedDouble,
  Lamp,
  Frame,
  Award
} from 'lucide-react'
import { SHOP_PRODUCTS as shopProducts } from '@/lib/constants'
import useCartStore from '@/store/useCartStore'
import useThemeStore from '@/store/useThemeStore'
import Mini3DPreview from '@/components/Mini3DPreview'
import { useTranslation } from 'react-i18next'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
}

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } }
}

export default function Shop() {
  const { addToCart, addToWishlist, items: cart, wishlistItems: wishlist } = useCartStore()
  const { formatPrice } = useThemeStore()
  const { t } = useTranslation()
  
  const [searchParams, setSearchParams] = useSearchParams()
  const searchFromUrl = searchParams.get('q') || ''
  const [searchTerm, setSearchTerm] = useState(searchFromUrl)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    setSearchTerm(searchFromUrl)
  }, [searchFromUrl])

  const handleSearchChange = (value) => {
    setSearchTerm(value)
    if (value.trim()) setSearchParams({ q: value.trim() }, { replace: true })
    else setSearchParams({}, { replace: true })
  }
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [sortBy, setSortBy] = useState('featured')
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)

  const categoryLabel = (key) => {
    const map = {
      all: 'shop.allProducts',
      'Living Room': 'shop.category.livingRoom',
      'Dining Room': 'shop.category.diningRoom',
      Bedroom: 'shop.category.bedroom',
      Storage: 'shop.category.storage',
      Lighting: 'shop.category.lighting',
      Decor: 'shop.category.decor',
      Entertainment: 'shop.category.entertainment',
      Office: 'shop.category.office',
    }
    return t(map[key] || key)
  }
  const categories = [
    { key: 'all', labelKey: 'shop.allProducts', icon: Home, count: shopProducts.length },
    { key: 'Living Room', labelKey: 'shop.category.livingRoom', icon: Armchair, count: shopProducts.filter(p => p.category === 'Living Room').length },
    { key: 'Dining Room', labelKey: 'shop.category.diningRoom', icon: Table2, count: shopProducts.filter(p => p.category === 'Dining Room').length },
    { key: 'Bedroom', labelKey: 'shop.category.bedroom', icon: BedDouble, count: shopProducts.filter(p => p.category === 'Bedroom').length },
    { key: 'Storage', labelKey: 'shop.category.storage', icon: Archive, count: shopProducts.filter(p => p.category === 'Storage').length },
    { key: 'Lighting', labelKey: 'shop.category.lighting', icon: Lamp, count: shopProducts.filter(p => p.category === 'Lighting').length },
    { key: 'Decor', labelKey: 'shop.category.decor', icon: Frame, count: shopProducts.filter(p => p.category === 'Decor').length },
    { key: 'Entertainment', labelKey: 'shop.category.entertainment', icon: Package, count: shopProducts.filter(p => p.category === 'Entertainment').length },
    { key: 'Office', labelKey: 'shop.category.office', icon: Armchair, count: shopProducts.filter(p => p.category === 'Office').length },
  ]

  const filteredProducts = shopProducts
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      return matchesSearch && matchesCategory && matchesPrice
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price
        case 'price-high': return b.price - a.price
        case 'name': return a.name.localeCompare(b.name)
        case 'rating': return (b.rating || 0) - (a.rating || 0)
        case 'featured':
        default: return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      }
    })

  const isInCart = (productId) => cart.some(item => item.id === productId)
  const isInWishlist = (productId) => wishlist.some(item => item.id === productId)

  const handleAddToCart = (product) => addToCart(product)
  const handleAddToWishlist = (product) => addToWishlist(product)

  const trustShort = [
    t('shop.trustFreeDelivery') || 'Free delivery',
    t('shop.trustWarranty') || '2Y warranty',
    t('shop.trustReturns') || '30-day returns',
    t('shop.trustHandcrafted') || 'Handcrafted',
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Compact header + short trust line */}
        <motion.div
          className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-warm-50">
            <span className="text-[#5C3A2A] dark:text-clay">{t('shop.title')}</span>
          </h1>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500 dark:text-white">
            {trustShort.map((txt, i) => (
              <span key={i}>{txt}{i < trustShort.length - 1 ? ' •' : ''}</span>
            ))}
          </div>
        </motion.div>

        {/* Search bar — top of shop */}
        <motion.div
          className="mb-6 lg:mb-8"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 dark:text-white pointer-events-none" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={t('shop.searchFurniture') || 'Search furniture, sofas, tables, and more...'}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm bg-neutral-100 dark:bg-dark-surface border border-neutral-200 dark:border-dark-border text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder:text-white focus:outline-none focus:ring-2 focus:ring-[#5C3A2A]/30 dark:focus:ring-clay/30 focus:border-[#5C3A2A] dark:focus:border-clay transition-all"
              aria-label="Search products"
            />
          </div>
        </motion.div>

        {/* Category nav — Article/Lulu style: horizontal links with underline */}
        <motion.div 
          className="flex flex-wrap items-center gap-x-1 gap-y-2 mb-10 lg:mb-12 pb-4 border-b border-neutral-200 dark:border-dark-border"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                selectedCategory === category.key
                  ? 'text-[#5C3A2A] dark:text-clay'
                  : 'text-neutral-600 dark:text-white hover:text-neutral-900 dark:hover:text-warm-100'
              }`}
            >
              <span>{t(category.labelKey)}</span>
              {category.count > 0 && (
                <span className="ml-1.5 text-neutral-400 dark:text-white font-normal">
                  ({category.count})
                </span>
              )}
              {selectedCategory === category.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5C3A2A] dark:bg-clay -mb-0.5" />
              )}
            </button>
          ))}
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <AnimatePresence>
            {(showFilters || typeof window !== 'undefined') && (
              <motion.div
                className={`lg:w-72 ${showFilters ? 'block' : 'hidden lg:block'}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-warm-100 dark:border-dark-border p-6 space-y-6 sticky top-24">
                  <div className="flex items-center justify-between lg:hidden">
                    <h3 className="font-bold text-neutral-900 dark:text-white">{t('shop.filters')}</h3>
                    <button onClick={() => setShowFilters(false)} className="p-1.5 hover:bg-neutral-100 dark:hover:bg-dark-surface rounded-lg">
                      <X className="h-5 w-5 text-neutral-500" />
                    </button>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-semibold text-darkwood dark:text-white mb-3">{t('shop.priceRange')}</label>
                    <div className="space-y-3">
                      <input
                        type="range"
                        min="0"
                        max="2000"
                        step="50"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full h-2 rounded-full"
                      />
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-darkwood/50 dark:text-white bg-warm-100 dark:bg-dark-surface px-2 py-1 rounded">{formatPrice(priceRange[0])}</span>
                        <span className="text-sm font-medium text-clay bg-clay/10 px-2 py-1 rounded">{formatPrice(priceRange[1])}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Filters */}
                  <div>
                    <label className="block text-sm font-semibold text-darkwood dark:text-white mb-2">{t('shop.quickFilters')}</label>
                    <div className="flex flex-wrap gap-2">
                      {[t('shop.featured'), t('shop.onSale'), t('shop.freeShipping'), t('shop.inStock')].map((filter) => (
                        <button
                          key={filter}
                          className="px-3 py-1.5 text-xs font-medium bg-warm-50 dark:bg-dark-surface text-darkwood/60 dark:text-white hover:bg-clay/10 hover:text-clay rounded-full transition-all duration-200 border border-warm-200 dark:border-dark-border hover:border-clay/40"
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => { setSearchTerm(''); setSelectedCategory('all'); setPriceRange([0, 2000]); setSearchParams({}); }}
                    className="w-full py-2.5 text-sm font-medium text-darkwood/50 dark:text-white hover:text-red-500 border border-warm-200 dark:border-dark-border hover:border-red-300 rounded-xl transition-all"
                  >
                    {t('shop.clearAllFilters')}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls Bar */}
            <motion.div
              className="bg-white dark:bg-dark-card rounded-2xl border border-warm-100 dark:border-dark-border shadow-sm p-4 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center space-x-2 px-4 py-2.5 bg-clay text-white rounded-xl font-medium text-sm"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    <span>{t('shop.filters')}</span>
                  </button>
                  
                  <div className="text-sm text-darkwood/50 dark:text-white">
                    {t('shop.showing')} <span className="font-semibold text-darkwood dark:text-white">{filteredProducts.length}</span> {t('shop.of')} {shopProducts.length} {t('shop.products')}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-warm-50 dark:bg-dark-surface border border-warm-200 dark:border-dark-border rounded-xl px-4 py-2.5 pr-8 text-sm text-darkwood dark:text-white focus:outline-none focus:ring-2 focus:ring-clay/40 focus:border-clay min-w-[160px]"
                    >
                      <option value="featured">{t('shop.featured')}</option>
                      <option value="name">{t('shop.nameAZ')}</option>
                      <option value="price-low">{t('shop.priceLowHigh')}</option>
                      <option value="price-high">{t('shop.priceHighLow')}</option>
                      <option value="rating">{t('shop.highestRated')}</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warm-400 pointer-events-none" />
                  </div>

                  <div className="flex bg-warm-100 dark:bg-dark-surface rounded-xl p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        viewMode === 'grid'
                          ? 'bg-white dark:bg-dark-card text-clay shadow-sm'
                          : 'text-warm-400 hover:text-darkwood dark:hover:text-warm-200'
                      }`}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        viewMode === 'list'
                          ? 'bg-white dark:bg-dark-card text-clay shadow-sm'
                          : 'text-warm-400 hover:text-darkwood dark:hover:text-warm-200'
                      }`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Products Grid/List */}
            <motion.div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8'
                  : 'space-y-4'
              }
              initial="initial"
              animate="animate"
              variants={stagger}
            >
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  className={`bg-white dark:bg-dark-card rounded-2xl border border-warm-100 dark:border-dark-border overflow-hidden group hover:shadow-xl hover:shadow-warm-300/20 dark:hover:shadow-black/30 hover:border-warm-200 dark:hover:border-dark-border transition-all duration-300 ${
                    viewMode === 'list' ? 'flex items-center' : ''
                  }`}
                  variants={fadeInUp}
                  whileHover={{ y: viewMode === 'grid' ? -4 : 0 }}
                >
                  {/* Product Image */}
                  <div className={`relative ${
                    viewMode === 'grid' ? 'aspect-square' : 'w-36 h-36 flex-shrink-0'
                  } bg-warm-100 dark:bg-dark-surface overflow-hidden`}>
                    {product.image && (product.image.startsWith('/') || product.image.startsWith('http')) ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Mini3DPreview
                        productId={product.id}
                        color={product.colors?.[0] || '#8B6F47'}
                      />
                    )}
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 space-y-1.5">
                      {product.featured && (
                        <span className="block bg-amber-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm">
                          {t('shop.featured')}
                        </span>
                      )}
                      {(product.onSale || product.discountPercent) && (
                        <span className="block bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm">
                          {product.discountPercent ? `${product.discountPercent}% OFF` : t('shop.onSale')}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => { e.preventDefault(); handleAddToWishlist(product) }}
                      className={`absolute top-3 right-3 p-2.5 rounded-full transition-all duration-300 shadow-sm ${
                        isInWishlist(product.id)
                          ? 'bg-red-500 text-white scale-110'
                          : 'bg-white/90 dark:bg-dark-card/90 text-darkwood/50 dark:text-white hover:bg-red-500 hover:text-white hover:scale-110'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                    </button>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4">
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => { e.preventDefault(); handleAddToCart(product) }}
                          className={`p-3 rounded-xl font-medium text-sm transition-all duration-200 backdrop-blur-sm ${
                            isInCart(product.id)
                              ? 'bg-green-500 text-white'
                              : 'bg-white/95 text-darkwood hover:bg-clay hover:text-white'
                          }`}
                          title={isInCart(product.id) ? t('shop.added') : t('shop.addToCart')}
                        >
                          <Plus className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className={viewMode === 'grid' ? 'p-5' : 'flex-1 p-5'}>
                    <Link to={`/shop/${product.id}`} className="block">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-medium text-[#5C3A2A] dark:text-clay uppercase tracking-wider">
                          {categoryLabel(product.category)}
                        </span>
                      </div>
                      <h3 className="font-bold text-darkwood dark:text-white mb-1.5 group-hover:text-clay transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-darkwood/50 dark:text-white mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${
                                i < Math.round(product.rating || 0)
                                  ? 'text-amber-500 fill-amber-500'
                                  : 'text-warm-200 dark:text-dark-border'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-medium text-darkwood/40 dark:text-white">
                          ({product.rating || 4.5})
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-neutral-900 dark:text-white">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-neutral-400 line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Available colors */}
                      {product.colors && product.colors.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-medium text-neutral-500 dark:text-white mb-2">{t('shop.availableColors')}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {product.colors.map((c, i) => (
                              <span
                                key={i}
                                className="w-5 h-5 rounded-full border-2 border-neutral-200 dark:border-dark-border shadow-sm"
                                style={{ backgroundColor: c }}
                                title={product.colorNames?.[i] || c}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </Link>

                    {/* Action: View Details (3D available on product page) */}
                    <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-dark-border">
                      <Link
                        to={`/shop/${product.id}`}
                        className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm font-medium bg-[#5C3A2A] dark:bg-clay text-white hover:bg-[#4A2F21] dark:hover:bg-clay-dark transition-all shadow-sm"
                      >
                        <Eye className="h-4 w-4" />
                        {t('shop.viewDetails')}
                      </Link>
                    </div>

                    {viewMode === 'list' && (
                      <div className="flex items-center space-x-2 mt-4">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className={`p-2.5 rounded-xl font-medium text-sm transition-all ${
                            isInCart(product.id)
                              ? 'bg-green-500 text-white'
                              : 'bg-clay hover:bg-clay-dark text-white'
                          }`}
                          title={isInCart(product.id) ? t('shop.added') : t('shop.addToCart')}
                        >
                          <Plus className="h-5 w-5" />
                        </button>
                        <Link
                          to={`/shop/${product.id}`}
                          className="p-2.5 border border-warm-200 dark:border-dark-border rounded-xl text-darkwood/50 dark:text-white hover:border-clay hover:text-clay transition-all"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* No Results */}
            {filteredProducts.length === 0 && (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-24 h-24 bg-clay/10 dark:bg-clay/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Tag className="h-10 w-10 text-clay" />
                </div>
                <h3 className="text-xl font-bold text-darkwood dark:text-white mb-2">
                  {t('shop.noProducts')}
                </h3>
                <p className="text-darkwood/50 dark:text-white mb-8 max-w-md mx-auto">
                  {t('shop.noProducts.desc')}
                </p>
                <button
                  onClick={() => { setSearchTerm(''); setSelectedCategory('all'); setPriceRange([0, 2000]); setSearchParams({}) }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-clay hover:bg-clay-dark text-white rounded-xl font-medium transition-all"
                >
                  <RotateCcw className="h-4 w-4" />
                  {t('shop.clearAllFilters')}
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}