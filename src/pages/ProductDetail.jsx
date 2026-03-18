import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Palette,
  Ruler,
  Package,
  Check,
  Plus,
  Minus,
  X
} from 'lucide-react'
import { SHOP_PRODUCTS as shopProducts, FREE_SHIPPING_THRESHOLD } from '@/lib/constants'
import useCartStore from '@/store/useCartStore'
import useThemeStore from '@/store/useThemeStore'
import { toast } from 'sonner'
import Real3DViewer from '@/components/Real3DViewer'
import { MODEL_TYPE_MAP } from '@/components/FurnitureModel3D'
import Mini3DPreview from '@/components/Mini3DPreview'
import ARFurnitureViewer from '@/components/ARFurnitureViewer'
import { useTranslation } from 'react-i18next'

export default function ProductDetail() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { formatPrice } = useThemeStore()
  const { addToCart, addToWishlist, isInWishlist: checkWishlist, items: cartItems, updateQuantity } = useCartStore()
  const { t } = useTranslation()

  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState('description')
  const [viewMode, setViewMode] = useState('photos')
  const [presetAngle, setPresetAngle] = useState('front')
  const [showARModal, setShowARModal] = useState(false)

  const product = shopProducts.find(p => p.id === productId)
  const previewAngles = ['front', 'side', 'top', 'back']
  const hasProductImages = product?.image && (product.image.startsWith('/') || product.image.startsWith('http'))

  useEffect(() => {
    if (product?.colors?.length) {
      setSelectedColor(product.colors[0])
    }
  }, [product])

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50 dark:bg-dark-bg">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-darkwood dark:text-white mb-4">
            {t('product.notFound')}
          </h2>
          <Link to="/shop" className="btn-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('product.backToShop')}
          </Link>
        </div>
      </div>
    )
  }

  const isInCart = cartItems.some(item => item.id === product.id)
  const isInWishlist = checkWishlist(product.id)
  const cartItem = cartItems.find(item => item.id === product.id)

  const handleAddToCart = () => {
    if (isInCart) {
      updateQuantity(product.id, (cartItem?.quantity || 0) + quantity)
    } else {
      addToCart({ ...product, selectedColor, quantity })
    }
    toast.success(`${product.name} ${t('wishlist.addedToCart')}`, {
      description: `${t('product.quantity')}: ${quantity}, ${t('product.color')}: ${selectedColor}`,
    })
  }

  const handleBuyNow = () => {
    if (isInCart) {
      updateQuantity(product.id, (cartItem?.quantity || 0) + quantity)
    } else {
      addToCart({ ...product, selectedColor, quantity })
    }
    toast.success(`${product.name} ${t('wishlist.addedToCart')}`)
    navigate('/checkout')
  }

  const handleAddToWishlist = () => {
    addToWishlist(product)
    toast.success(`${product.name} ${t('wishlist.removedFromWishlist')}`)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success(t('product.linkCopied'))
    }
  }

  const relatedProducts = shopProducts
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 4)

  const tabs = [
    { id: 'description', label: t('product.description'), icon: Package },
    { id: 'specifications', label: t('product.specifications'), icon: Ruler },
    { id: 'reviews', label: t('product.reviews'), icon: Star },
    { id: 'shipping', label: t('product.shipping'), icon: Truck },
  ]

  return (
    <div className="min-h-screen bg-[#F8F6F3] dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <motion.nav
          className="flex items-center space-x-2 text-sm text-darkwood/50 dark:text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link to="/shop" className="hover:text-clay transition-colors">{t('nav.shop')}</Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category.toLowerCase()}`} className="hover:text-clay transition-colors">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-darkwood dark:text-white">{product.name}</span>
        </motion.nav>

        {/* Back Button */}
        <motion.button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-darkwood dark:text-white hover:text-clay transition-colors mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
        >
          <ArrowLeft className="h-5 w-5" />
          <span>{t('product.back')}</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Product Images — 3D Viewer */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* View Mode Toggle */}
            <div className="flex bg-white dark:bg-dark-surface rounded-xl p-1 mb-2 border border-[#5C3A2A]/10">
              <button
                onClick={() => setViewMode('3d')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                  viewMode === '3d'
                    ? 'bg-clay text-white shadow-md shadow-clay/25'
                    : 'text-darkwood/60 dark:text-white hover:text-darkwood dark:hover:text-warm-200'
                }`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3 2 7l10 4 10-4-10-4z" />
                  <path d="M2 17l10 4 10-4" />
                  <path d="M2 12l10 4 10-4" />
                </svg>
                {t('product.3dView')}
              </button>
              <button
                onClick={() => setViewMode('photos')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                  viewMode === 'photos'
                    ? 'bg-clay text-white shadow-md shadow-clay/25'
                    : 'text-darkwood/60 dark:text-white hover:text-darkwood dark:hover:text-warm-200'
                }`}
              >
                <Package className="w-4 h-4" />
                Image
              </button>
            </div>

            {/* 3D VIEWER (Real WebGL) */}
            {viewMode === '3d' && (
              <>
                <Real3DViewer
                  productId={product.id}
                  modelType={MODEL_TYPE_MAP[product.id] || 'sofa'}
                  color={selectedColor || product.colors?.[0] || '#8B6F47'}
                  name={product.name}
                  originalPrice={product.originalPrice}
                  price={product.price}
                  discountPercent={product.discountPercent}
                  presetAngle={presetAngle}
                />
                {/* Angle preset buttons BELOW 3D viewer */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {(['front', 'side', 'top', 'back']).map((angle) => (
                    <button
                      key={angle}
                      onClick={() => setPresetAngle(angle)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                        presetAngle === angle
                          ? 'bg-[#5C3A2A] text-white border-[#5C3A2A]'
                          : 'bg-white dark:bg-dark-card text-[#5C3A2A] border-[#5C3A2A]/20 hover:border-[#5C3A2A]/40'
                      }`}
                    >
                      {angle.charAt(0).toUpperCase() + angle.slice(1)}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* IMAGE tab: always show same JPEG; when product has colors, apply color overlay filter for visual feedback */}
            {viewMode === 'photos' && hasProductImages && (
              <div className="space-y-3">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-white dark:bg-dark-card border border-[#5C3A2A]/20">
                  <img
                    src={(product.images && product.images[selectedImage]) || product.image}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                  {/* Color overlay: keeps same JPEG, adds tint when color selected */}
                  {product.colors?.length > 1 && selectedColor && (
                    <div
                      className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-[0.25]"
                      style={{ backgroundColor: selectedColor }}
                      aria-hidden
                    />
                  )}
                  {/* Lee Roo watermark */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none opacity-50">
                    <span className="text-[10px] font-semibold text-[#5C3A2A] dark:text-clay tracking-widest bg-white/80 dark:bg-black/40 px-2 py-1 rounded">LEE ROO · WOOD DESIGNS</span>
                  </div>
                </div>
                {product.images && product.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === idx
                            ? 'border-[#5C3A2A] dark:border-clay ring-2 ring-[#5C3A2A]/20'
                            : 'border-[#5C3A2A]/20 dark:border-dark-border hover:border-[#5C3A2A]/40'
                        }`}
                      >
                        <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Fallback: Mini3DPreview when no product images */}
            {viewMode === 'photos' && !hasProductImages && (
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#F8F6F3] dark:from-dark-card dark:to-dark-surface">
                <Mini3DPreview
                  productId={product.id}
                  color={selectedColor || product.colors?.[0] || '#8B6F47'}
                  angle={previewAngles[selectedImage] || 'front'}
                />
                <div className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm font-medium">
                  {[t('product.frontView'), t('product.sideView'), t('product.topView'), t('product.backView')][selectedImage] || t('product.view')}
                </div>
              </div>
            )}

            {/* Thumbnail strip for 3D angles (when no product images) */}
            {viewMode === 'photos' && !hasProductImages && (
              <div className="flex space-x-3">
                {previewAngles.map((angle, index) => (
                  <motion.button
                    key={angle}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-lg border-2 transition-all overflow-hidden ${
                      selectedImage === index
                        ? 'border-[#5C3A2A] ring-2 ring-[#5C3A2A]/20'
                        : 'border-[#5C3A2A]/20 hover:border-[#5C3A2A]/40'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Mini3DPreview
                      productId={product.id}
                      color={selectedColor || product.colors?.[0] || '#8B6F47'}
                      angle={angle}
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-black/40 text-white text-[10px] text-center py-0.5 font-medium">
                      {[t('product.front'), t('product.side'), t('product.top'), t('product.back')][index]}
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Title and Rating */}
            <div>
              <h1 className="text-3xl font-bold text-darkwood dark:text-white mb-3 font-display">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4 mb-2">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.round(product.rating || 4.5)
                          ? 'text-yellow-500 fill-current'
                          : 'text-warm-300 dark:text-dark-border'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-darkwood dark:text-white font-medium">
                  {product.rating || 4.5}
                </span>
                <span className="text-darkwood/50 dark:text-white">
                  ({product.reviews || 0} {t('product.reviews').toLowerCase()})
                </span>
              </div>
              <div className="text-sm text-darkwood/50 dark:text-white">
                {t('product.category')}: <span className="text-clay font-medium">{product.category}</span>
              </div>
            </div>

            {/* Price */}
            <div className="border-b border-warm-200 dark:border-dark-border pb-6">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-3xl font-bold text-clay">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-warm-400 dark:text-white/70 line-through whitespace-nowrap">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-2 py-1 rounded-full text-sm font-medium">
                    {product.discountPercent ? `${product.discountPercent}% OFF` : `${t('product.save')} ${formatPrice(product.originalPrice - product.price)}`}
                  </span>
                )}
              </div>
              <p className="text-sm text-forest dark:text-forest-light flex items-center">
                <Check className="h-4 w-4 mr-1" />
                {product.inStock ? t('product.inStock') : t('product.outOfStock')}
              </p>
            </div>

            {/* Color Selection */}
            {product.colors && product.colors.length > 1 && (
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <Palette className="h-5 w-5 text-darkwood dark:text-white" />
                  <span className="font-medium text-darkwood dark:text-white">
                    {t('product.color')}:{' '}
                    <span className="text-clay">
                      {product.colorNames?.[product.colors.indexOf(selectedColor)] || selectedColor}
                    </span>
                  </span>
                  {selectedColor !== product.colors[0] && (
                    <span className="text-xs text-clay dark:text-clay bg-clay/10 dark:bg-clay/20 px-2 py-0.5 rounded-full animate-pulse">
                      {viewMode === '3d' ? t('product.previewActive') : t('product.switchTo3dForColor') || 'Switch to 3D to preview color'}
                    </span>
                  )}
                </div>
                <div className="flex space-x-3">
                  {product.colors.map((color, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setSelectedColor(color)}
                      className={`relative w-12 h-12 rounded-lg border-2 transition-all ${
                        selectedColor === color
                          ? 'border-clay scale-110 shadow-lg shadow-clay/20'
                          : 'border-warm-200 dark:border-dark-border hover:border-warm-300 dark:hover:border-warm-500/30'
                      }`}
                      style={{ backgroundColor: color }}
                      whileHover={{ scale: selectedColor === color ? 1.1 : 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title={product.colorNames?.[index] || color}
                    >
                      {selectedColor === color && (
                        <Check className={`h-5 w-5 absolute inset-0 m-auto ${
                          ['#FFFFFF', '#E8DFD5', '#D9C7B8', '#F4EFEA'].includes(color) ? 'text-gray-800' : 'text-white'
                        }`} />
                      )}
                    </motion.button>
                  ))}
                </div>
                {product.colorNames && (
                  <div className="flex flex-wrap gap-x-3 gap-y-0 mt-1.5">
                    {product.colorNames.map((name, i) => (
                      <span key={i} className={`text-[10px] w-12 text-center shrink-0 ${
                        selectedColor === product.colors[i] ? 'text-clay font-semibold' : 'text-warm-400 dark:text-white/70'
                      }`}>
                        {name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-medium text-darkwood dark:text-white">{t('product.quantity')}:</span>
                <div className="flex items-center border border-warm-200 dark:border-dark-border rounded-lg">
                  <motion.button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-warm-100 dark:hover:bg-dark-surface transition-colors"
                    whileTap={{ scale: 0.95 }}
                  >
                    <Minus className="h-4 w-4" />
                  </motion.button>
                  <span className="px-4 py-2 font-medium min-w-12 text-center">
                    {quantity}
                  </span>
                  <motion.button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-warm-100 dark:hover:bg-dark-surface transition-colors"
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  onClick={handleBuyNow}
                  className="flex-1 bg-forest hover:bg-forest-light text-white font-semibold flex items-center justify-center space-x-2 py-3 rounded-xl shadow-lg shadow-forest/20 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!product.inStock}
                >
                  <Package className="h-5 w-5" />
                  <span>{t('product.buyNow')}</span>
                </motion.button>
                <motion.button
                  onClick={handleAddToCart}
                  className="flex-1 btn-primary flex items-center justify-center space-x-2 py-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>{isInCart ? t('product.updateCart') : t('shop.addToCart')}</span>
                </motion.button>

                <motion.button
                  onClick={handleAddToWishlist}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    isInWishlist
                      ? 'border-red-500 bg-red-500 text-white'
                      : 'border-warm-200 dark:border-dark-border text-darkwood dark:text-white hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
                </motion.button>
                <motion.button
                  onClick={() => setShowARModal(true)}
                  className="p-4 rounded-xl border-2 border-forest bg-forest/20 dark:bg-forest/30 text-forest dark:text-forest-light hover:bg-forest/30 dark:hover:bg-forest/40 shadow-lg ring-2 ring-forest/20 hover:ring-forest/40 transition-all flex items-center justify-center min-w-[52px] min-h-[52px]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title={t('product.viewInSpace') || 'View in your space'}
                  aria-label="View in your space (AR)"
                >
                  <img src="/images/ar-icon.png" alt="AR" className="h-9 w-9 object-contain drop-shadow-md" />
                </motion.button>
              </div>

              {/* AR Viewer — full-screen with model-viewer for "View in your space" */}
              <AnimatePresence>
                {showARModal && (
                  <ARFurnitureViewer
                    productId={product.id}
                    modelType={MODEL_TYPE_MAP[product.id] || 'sofa'}
                    color={selectedColor || product.colors?.[0] || '#8B6F47'}
                    productName={product.name}
                    onClose={() => setShowARModal(false)}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 py-4 sm:py-6 border-t border-warm-200 dark:border-dark-border">
              <div className="text-center">
                <Truck className="h-6 w-6 sm:h-8 sm:w-8 text-clay mx-auto mb-1.5 sm:mb-2" />
                <div className="text-xs sm:text-sm font-medium text-darkwood dark:text-white">{t('product.freeShipping')}</div>
                <div className="text-xs text-darkwood/50 dark:text-white">{t('product.ordersOver')} {formatPrice(FREE_SHIPPING_THRESHOLD)}</div>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-forest mx-auto mb-1.5 sm:mb-2" />
                <div className="text-sm font-medium text-darkwood dark:text-white">{t('product.warranty')}</div>
                <div className="text-xs text-darkwood/50 dark:text-white">{t('product.fullCoverage')}</div>
              </div>
              <div className="text-center">
                <RotateCcw className="h-6 w-6 sm:h-8 sm:w-8 text-darkwood dark:text-white mx-auto mb-1.5 sm:mb-2" />
                <div className="text-sm font-medium text-darkwood dark:text-white">{t('product.easyReturns')}</div>
                <div className="text-xs text-darkwood/50 dark:text-white">{t('product.thirtyDays')}</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs Section */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="border-b border-warm-200 dark:border-dark-border">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-clay text-clay'
                      : 'border-transparent text-darkwood/50 dark:text-white hover:text-darkwood dark:hover:text-warm-100'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            <AnimatePresence mode="wait">
              {activeTab === 'description' && (
                <motion.div
                  key="description"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="prose prose-lg max-w-none dark:prose-invert"
                >
                  <p className="text-darkwood dark:text-white leading-relaxed">
                    {product.description}
                  </p>
                  {product.features && (
                    <div className="mt-6">
                      <h3 className="text-xl font-semibold text-darkwood dark:text-white mb-4">
                        {t('product.keyFeatures')}
                      </h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {product.features.map((feature, index) => (
                          <motion.li
                            key={index}
                            className="flex items-start space-x-3 text-darkwood dark:text-white"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Check className="h-5 w-5 text-forest mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'specifications' && (
                <motion.div
                  key="specifications"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-warm-100 dark:border-dark-border">
                    <h3 className="text-lg font-semibold text-darkwood dark:text-white mb-4">
                      {t('product.productDetails')}
                    </h3>
                    <div className="space-y-3">
                      {[
                        [t('product.dimensions'), product.dimensions || 'N/A'],
                        [t('product.weight'), product.weight || 'N/A'],
                        [t('product.material'), product.material || 'N/A'],
                        [t('product.category'), product.category],
                        ['SKU', (product.sku || product.id).toUpperCase()]
                      ].map(([label, value]) => (
                        <div key={label} className="flex justify-between">
                          <span className="text-darkwood/50 dark:text-white">{label}:</span>
                          <span className="font-medium text-darkwood dark:text-white">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'reviews' && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {product.reviewsList && product.reviewsList.length > 0 ? (
                    <div className="space-y-4">
                      {product.reviewsList.map((review, idx) => (
                        <div
                          key={idx}
                          className="bg-white dark:bg-dark-card rounded-xl p-6 border border-[#5C3A2A]/20"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-[#5C3A2A] dark:text-clay">{review.name}</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < (review.rating || 0)
                                      ? 'text-amber-500 fill-current'
                                      : 'text-[#5C3A2A]/20'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-darkwood dark:text-white">{review.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Star className="h-16 w-16 text-warm-300 dark:text-dark-border mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-darkwood dark:text-white mb-2">
                        Reviews coming soon
                      </h3>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'shipping' && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-warm-100 dark:border-dark-border">
                    <h3 className="text-lg font-semibold text-darkwood dark:text-white mb-4">
                      {t('product.deliveryInfo')}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="font-medium text-darkwood dark:text-white">{t('product.standardDelivery')}</div>
                        <div className="text-sm text-darkwood/50 dark:text-white">{t('product.standardDays')} - {formatPrice(9.99)}</div>
                      </div>
                      <div>
                        <div className="font-medium text-darkwood dark:text-white">{t('product.expressDelivery')}</div>
                        <div className="text-sm text-darkwood/50 dark:text-white">{t('product.expressDays')} - {formatPrice(19.99)}</div>
                      </div>
                      <div>
                        <div className="font-medium text-forest dark:text-forest-light">{t('product.freeDelivery')}</div>
                        <div className="text-sm text-darkwood/50 dark:text-white">{t('product.ordersOver')} {formatPrice(FREE_SHIPPING_THRESHOLD)}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-darkwood dark:text-white mb-8 font-display">
              {t('product.youMightAlsoLike')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-warm-100 dark:border-dark-border overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  <Link to={`/shop/${relatedProduct.id}`} className="block">
                    <div className="aspect-square bg-gradient-to-br from-warm-100 to-warm-200 dark:from-dark-card dark:to-dark-surface overflow-hidden">
                      {relatedProduct.image && (relatedProduct.image.startsWith('/') || relatedProduct.image.startsWith('http')) ? (
                        <img
                          src={relatedProduct.image}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Mini3DPreview
                          productId={relatedProduct.id}
                          color={relatedProduct.colors?.[0] || '#8B6F47'}
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-darkwood dark:text-white mb-2 hover:text-clay transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <div className="text-lg font-bold text-clay">
                        {formatPrice(relatedProduct.price)}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  )
}