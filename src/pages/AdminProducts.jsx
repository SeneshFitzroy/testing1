import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Grid3X3,
  List,
  ArrowLeft,
  X,
  DollarSign,
  Tag,
  Save,
  AlertTriangle,
  CheckCircle,
  Loader2,
  ImagePlus,
  Upload,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { FURNITURE_CATEGORIES } from '@/lib/constants'
import useProductsStore from '@/store/useProductsStore'
import useThemeStore from '@/store/useThemeStore'
import { useTranslation } from 'react-i18next'
import { uploadProductImage, productImagePath } from '@/lib/storageService'

export default function AdminProducts() {
  const { products, loaded, loadProducts, addProduct, updateProduct, deleteProduct } = useProductsStore()
  useEffect(() => { if (!loaded) loadProducts() }, [loaded, loadProducts])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [editingProduct, setEditingProduct] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')
  const [uploadingImages, setUploadingImages] = useState(false)
  const imageInputRef = useRef(null)
  const { t } = useTranslation()
  const { formatPrice } = useThemeStore()

  const categories = FURNITURE_CATEGORIES

  const parseDims = (str) => {
    if (!str || typeof str !== 'string') return { width: 1, depth: 0.8, height: 0.8 }
    const nums = str.match(/\d+(?:\.\d+)?/g)
    if (!nums || nums.length < 3) return { width: 1, depth: 0.8, height: 0.8 }
    return { width: Math.min(8, Math.max(0.3, parseFloat(nums[0]) / 100)), depth: Math.min(8, Math.max(0.2, parseFloat(nums[1]) / 100)), height: Math.min(3, Math.max(0.2, parseFloat(nums[2]) / 100)) }
  }

  const openForEdit = (product) => {
    if (product.id?.startsWith('new-')) return product
    const dims = product.width != null ? { width: product.width, depth: product.depth || 0.8, height: product.height || 0.8 } : parseDims(product.dimensions)
    setEditingProduct({
      ...product,
      ...dims,
      color: product.color || product.colors?.[0] || '#8B6F47',
      image: product.image || '',
      images: Array.isArray(product.images) ? [...product.images] : (product.image ? [product.image] : []),
    })
  }

  const handleImageUpload = async (e, asGallery = false) => {
    const files = e?.target?.files
    if (!files?.length || !editingProduct) return
    setUploadingImages(true)
    try {
      const productId = editingProduct.id?.replace(/^new-/, '') || `sp-${Date.now()}`
      const urls = []
      for (let i = 0; i < Math.min(files.length, 5); i++) {
        const file = files[i]
        const ext = file.name?.split('.').pop() || 'jpg'
        const path = productImagePath(productId, asGallery ? editingProduct.images?.length + i : 0, ext)
        const url = await uploadProductImage(file, path)
        if (url) urls.push(url)
      }
      if (urls.length) {
        if (asGallery) {
          setEditingProduct((p) => ({ ...p, images: [...(p.images || []), ...urls], image: p.image || urls[0] }))
        } else {
          const first = urls[0]
          setEditingProduct((p) => ({
            ...p,
            image: first,
            images: [first, ...(p.images || []).filter((u) => u !== p.image)],
          }))
        }
      }
    } catch (_) {}
    setUploadingImages(false)
    if (imageInputRef.current) imageInputRef.current.value = ''
  }

  const removeImage = (url, isPrimary) => {
    if (!editingProduct) return
    if (isPrimary) {
      const rest = (editingProduct.images || []).filter((u) => u !== url)
      setEditingProduct((p) => ({ ...p, image: rest[0] || '', images: rest }))
    } else {
      setEditingProduct((p) => ({ ...p, images: (p.images || []).filter((u) => u !== url) }))
    }
  }

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCategory = selectedCategory === 'all' || p.category === selectedCategory
    return matchSearch && matchCategory
  })

  const handleDelete = async (productId) => {
    const ok = await deleteProduct(productId)
    if (ok) {
      setShowDeleteConfirm(null)
      setSuccessMsg(t('admin.products.deleted'))
      setTimeout(() => setSuccessMsg(''), 3000)
    } else {
      setSuccessMsg(t('common.error') || 'Failed to delete')
      setTimeout(() => setSuccessMsg(''), 3000)
    }
  }

  const handleSaveEdit = async (updatedProduct) => {
    const isNew = updatedProduct.id.startsWith('new-') || !products.some(p => p.id === updatedProduct.id)
    const image = updatedProduct.image || (Array.isArray(updatedProduct.images) && updatedProduct.images[0]) || ''
    const images = Array.isArray(updatedProduct.images) && updatedProduct.images.length ? updatedProduct.images : (image ? [image] : [])
    if (isNew) {
      const shopProduct = {
        id: `sp-${Date.now()}`,
        name: updatedProduct.name,
        description: updatedProduct.description || '',
        category: updatedProduct.category || 'Living Room',
        price: Number(updatedProduct.price) || 0,
        originalPrice: Number(updatedProduct.price) || 0,
        discountPercent: 0,
        rating: 4.5,
        reviews: 0,
        inStock: true,
        featured: false,
        onSale: false,
        colors: [updatedProduct.color || '#8B6F47'],
        colorNames: ['Default'],
        material: '',
        dimensions: `${((updatedProduct.width || 1) * 100).toFixed(0)} x ${((updatedProduct.depth || 0.8) * 100).toFixed(0)} x ${((updatedProduct.height || 0.8) * 100).toFixed(0)} cm`,
        image,
        images,
        sku: `ADM-${Date.now()}`,
      }
      const saved = await addProduct(shopProduct)
      if (saved) {
        setSuccessMsg(t('admin.products.added') || 'Product added')
      } else {
        setSuccessMsg(t('common.error') || 'Failed to add')
      }
    } else {
      const existing = products.find(p => p.id === updatedProduct.id)
      const merged = {
        ...existing,
        name: updatedProduct.name,
        description: updatedProduct.description || '',
        category: updatedProduct.category,
        price: Number(updatedProduct.price),
        image,
        images,
        ...(updatedProduct.color && { colors: [updatedProduct.color, ...(existing?.colors || []).filter(c => c !== updatedProduct.color)].filter(Boolean) }),
      }
      const saved = await updateProduct(merged)
      if (saved) {
        setSuccessMsg(t('admin.products.updated'))
      } else {
        setSuccessMsg(t('common.error') || 'Failed to update')
      }
    }
    setEditingProduct(null)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  const getTotalValue = () => products.reduce((sum, p) => sum + (p.price || 0), 0)
  const getCategoryCount = (cat) => cat === 'all' ? products.length : products.filter(p => p.category === cat).length

  if (!loaded) {
    return (
      <div className="min-h-screen bg-warm-50 dark:bg-dark-bg flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-clay" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-warm-50 dark:bg-dark-bg">
      {/* Header */}
      <div className="bg-white dark:bg-dark-card border-b border-warm-100 dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link to="/admin" className="p-2 rounded-xl bg-warm-100 dark:bg-dark-surface text-darkwood dark:text-white hover:bg-warm-200 dark:hover:bg-dark-border transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-darkwood dark:text-white font-display">{t('admin.productMgmt')}</h1>
                <p className="text-darkwood/50 dark:text-white text-sm mt-0.5">{products.length} products &middot; Total value {formatPrice(getTotalValue())}</p>
              </div>
            </div>
            <button
              onClick={() => setEditingProduct({ id: `new-${Date.now()}`, name: '', category: 'Living Room', width: 1, depth: 0.8, height: 0.8, color: '#8B6F47', price: 0, icon: 'Box', description: '', image: '', images: [] })}
              className="inline-flex items-center gap-2 bg-clay text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-clay-dark hover:shadow-lg hover:shadow-clay/25 transition-all text-sm"
            >
              <Plus className="h-4 w-4" />
              {t('admin.addProduct')}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Success Message */}
        <AnimatePresence>
          {successMsg && (
            <motion.div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center gap-3" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span className="text-green-700 dark:text-green-300 text-sm font-medium">{successMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: t('admin.products.totalProducts'), value: products.length, icon: Package, color: 'bg-clay' },
            { label: t('admin.categories'), value: categories.length - 1, icon: Tag, color: 'bg-forest' },
            { label: t('admin.products.avgPrice'), value: formatPrice(products.length ? getTotalValue() / products.length : 0), icon: DollarSign, color: 'bg-darkwood' },
            { label: t('admin.products.totalValue'), value: formatPrice(getTotalValue()), icon: DollarSign, color: 'bg-clay-dark' },
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-dark-card rounded-xl border border-warm-100 dark:border-dark-border p-4 flex items-center gap-3">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-lg font-bold text-darkwood dark:text-white">{stat.value}</div>
                <div className="text-xs text-darkwood/50 dark:text-white">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters Bar */}
        <div className="bg-white dark:bg-dark-card rounded-xl border border-warm-100 dark:border-dark-border p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warm-400" />
              <input type="text" placeholder={t('admin.products.searchProducts')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-field pl-10 text-sm" />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {categories.map(cat => (
                <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedCategory === cat.id ? 'bg-clay text-white' : 'bg-warm-100 dark:bg-dark-surface text-darkwood/70 dark:text-white hover:bg-warm-200 dark:hover:bg-dark-border'}`}>
                  {cat.name} ({getCategoryCount(cat.id)})
                </button>
              ))}
            </div>
            <div className="flex bg-warm-100 dark:bg-dark-surface rounded-lg p-1">
              <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-clay text-white' : 'text-darkwood/50 dark:text-white'}`}>
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-clay text-white' : 'text-darkwood/50 dark:text-white'}`}>
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white dark:bg-dark-card rounded-xl border border-warm-100 dark:border-dark-border p-16 text-center">
            <Package className="h-16 w-16 text-warm-300 dark:text-dark-border mx-auto mb-4" />
            <h3 className="text-lg font-bold text-darkwood dark:text-white mb-2">{t('admin.products.noProducts')}</h3>
            <p className="text-darkwood/50 dark:text-white text-sm">{t('admin.products.adjustFilter')}</p>
          </div>
        ) : viewMode === 'grid' ? (
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {filteredProducts.map((product, i) => (
              <motion.div key={product.id} className="bg-white dark:bg-dark-card rounded-xl border border-warm-100 dark:border-dark-border overflow-hidden group hover:shadow-lg hover:border-clay/20 transition-all duration-200" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <div className="aspect-square bg-gradient-to-br from-warm-100 to-warm-50 dark:from-dark-surface dark:to-dark-card relative flex items-center justify-center overflow-hidden">
                  {product.image ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" /> : <div className="w-16 h-16 rounded-xl" style={{ backgroundColor: product.color || product.colors?.[0] || '#8B6F47' }} />}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openForEdit(product)} className="p-1.5 bg-white/90 dark:bg-dark-card/90 rounded-lg shadow-md hover:scale-110 transition-transform">
                      <Edit2 className="h-3.5 w-3.5 text-clay" />
                    </button>
                    <button onClick={() => setShowDeleteConfirm(product.id)} className="p-1.5 bg-white/90 dark:bg-dark-card/90 rounded-lg shadow-md hover:scale-110 transition-transform">
                      <Trash2 className="h-3.5 w-3.5 text-red-500" />
                    </button>
                  </div>
                  <div className="absolute top-2 left-2">
                    <span className="bg-white/90 dark:bg-dark-card/90 text-darkwood dark:text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">{product.category}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-darkwood dark:text-white text-sm mb-1 truncate">{product.name}</h3>
                  <p className="text-xs text-darkwood/50 dark:text-white mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-clay font-bold text-lg">{formatPrice(product.price)}</span>
                    <span className="text-[10px] text-darkwood/40 dark:text-white">{product.dimensions || (product.width != null ? `${product.width}m × ${product.depth}m × ${product.height}m` : '—')}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="bg-white dark:bg-dark-card rounded-xl border border-warm-100 dark:border-dark-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-warm-100 dark:border-dark-border bg-warm-50 dark:bg-dark-surface">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-darkwood/60 dark:text-white uppercase tracking-wider">{t('admin.products.product')}</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-darkwood/60 dark:text-white uppercase tracking-wider">{t('product.category')}</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-darkwood/60 dark:text-white uppercase tracking-wider">{t('admin.products.price')}</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-darkwood/60 dark:text-white uppercase tracking-wider">{t('product.dimensions')}</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-darkwood/60 dark:text-white uppercase tracking-wider">{t('product.color')}</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-darkwood/60 dark:text-white uppercase tracking-wider">{t('admin.products.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-warm-100 dark:divide-dark-border">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-warm-50 dark:hover:bg-dark-surface/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex-shrink-0" style={{ backgroundColor: product.color }} />
                          <div>
                            <div className="text-sm font-semibold text-darkwood dark:text-white">{product.name}</div>
                            <div className="text-xs text-darkwood/40 dark:text-white truncate max-w-[200px]">{product.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-warm-100 dark:bg-dark-surface text-darkwood/70 dark:text-white text-xs font-medium px-2 py-1 rounded-full capitalize">{product.category}</span>
                      </td>
                      <td className="px-4 py-3"><span className="text-sm font-bold text-clay">{formatPrice(product.price)}</span></td>
                      <td className="px-4 py-3"><span className="text-xs text-darkwood/50 dark:text-white">{product.width} x {product.depth} x {product.height}m</span></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full border border-warm-200 dark:border-dark-border" style={{ backgroundColor: product.color }} />
                          <span className="text-xs text-darkwood/50 dark:text-white">{product.color}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openForEdit(product)} className="p-1.5 rounded-lg text-clay hover:bg-clay/10 transition-colors"><Edit2 className="h-4 w-4" /></button>
                          <button onClick={() => setShowDeleteConfirm(product.id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingProduct && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingProduct(null)}>
            <motion.div className="bg-white dark:bg-dark-card rounded-2xl border border-warm-100 dark:border-dark-border shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-warm-100 dark:border-dark-border flex items-center justify-between">
                <h2 className="text-lg font-bold text-darkwood dark:text-white font-display">{editingProduct?.id?.startsWith('new-') ? t('admin.addProduct') : t('admin.products.editProduct')}</h2>
                <button onClick={() => setEditingProduct(null)} className="p-2 rounded-lg text-darkwood/50 hover:bg-warm-100 dark:hover:bg-dark-surface transition-colors"><X className="h-5 w-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-darkwood dark:text-white mb-1.5">{t('admin.products.productName')}</label>
                  <input type="text" value={editingProduct.name} onChange={(e) => setEditingProduct(prev => ({ ...prev, name: e.target.value }))} className="input-field text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-darkwood dark:text-white mb-1.5">{t('product.description')}</label>
                  <textarea value={editingProduct.description || ''} onChange={(e) => setEditingProduct(prev => ({ ...prev, description: e.target.value }))} className="input-field text-sm resize-none" rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-darkwood dark:text-white mb-1.5">{t('admin.products.price')} (USD)</label>
                    <input type="number" value={editingProduct.price} onChange={(e) => setEditingProduct(prev => ({ ...prev, price: Number(e.target.value) }))} className="input-field text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-darkwood dark:text-white mb-1.5">{t('product.category')}</label>
                    <select value={editingProduct.category} onChange={(e) => setEditingProduct(prev => ({ ...prev, category: e.target.value }))} className="input-field text-sm">
                      {categories.filter(c => c.id !== 'all').map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-darkwood dark:text-white mb-1.5">Width (m)</label>
                    <input type="number" step="0.1" value={editingProduct.width} onChange={(e) => setEditingProduct(prev => ({ ...prev, width: Number(e.target.value) }))} className="input-field text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-darkwood dark:text-white mb-1.5">Depth (m)</label>
                    <input type="number" step="0.1" value={editingProduct.depth} onChange={(e) => setEditingProduct(prev => ({ ...prev, depth: Number(e.target.value) }))} className="input-field text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-darkwood dark:text-white mb-1.5">Height (m)</label>
                    <input type="number" step="0.1" value={editingProduct.height} onChange={(e) => setEditingProduct(prev => ({ ...prev, height: Number(e.target.value) }))} className="input-field text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-darkwood dark:text-white mb-1.5">{t('product.color')}</label>
                  <div className="flex items-center gap-3">
                    <input type="color" value={editingProduct.color} onChange={(e) => setEditingProduct(prev => ({ ...prev, color: e.target.value }))} className="w-10 h-10 rounded-lg cursor-pointer border border-warm-200 dark:border-dark-border" />
                    <input type="text" value={editingProduct.color} onChange={(e) => setEditingProduct(prev => ({ ...prev, color: e.target.value }))} className="input-field text-sm flex-1" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-darkwood dark:text-white mb-1.5">{t('admin.products.productImage') || 'Product Images'}</label>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {((editingProduct.images && editingProduct.images.length) ? editingProduct.images : (editingProduct.image ? [editingProduct.image] : [])).filter(Boolean).map((url) => (
                        <div key={url} className="relative group">
                          <img src={url} alt="" className="w-16 h-16 rounded-lg object-cover border border-warm-200 dark:border-dark-border" />
                          <button type="button" onClick={() => removeImage(url, url === (editingProduct.image || editingProduct.images?.[0]))} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs">×</button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input ref={imageInputRef} type="file" accept="image/*" multiple onChange={(e) => handleImageUpload(e, false)} className="hidden" />
                      <button type="button" onClick={() => imageInputRef.current?.click()} disabled={uploadingImages} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-warm-200 dark:border-dark-border text-darkwood dark:text-white hover:bg-warm-100 dark:hover:bg-dark-surface text-sm transition-colors disabled:opacity-50">
                        {uploadingImages ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        {uploadingImages ? 'Uploading...' : 'Upload'}
                      </button>
                      <input id="gallery-upload" type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleImageUpload(e, true)} />
                      <label htmlFor="gallery-upload" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-forest/40 text-forest dark:text-forest-light hover:bg-forest/10 text-sm transition-colors cursor-pointer">
                        <ImagePlus className="h-4 w-4" /> Add Gallery
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <input type="url" placeholder="Or paste image URL" value={editingProduct.imageUrlInput || ''} onChange={(e) => setEditingProduct(prev => ({ ...prev, imageUrlInput: e.target.value }))} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); const v = editingProduct.imageUrlInput?.trim(); if (v) { setEditingProduct(prev => ({ ...prev, image: v, images: [v, ...(prev.images || []).filter(u => u !== v)], imageUrlInput: '' })) } } }} className="input-field text-sm flex-1" />
                      <button type="button" onClick={() => { const v = editingProduct.imageUrlInput?.trim(); if (v) setEditingProduct(prev => ({ ...prev, image: v, images: [v, ...(prev.images || []).filter(u => u !== v)], imageUrlInput: '' })) }} className="px-3 py-2 rounded-lg bg-forest/20 text-forest dark:text-forest-light text-sm font-medium hover:bg-forest/30 transition-colors">Add URL</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-warm-100 dark:border-dark-border flex gap-3">
                <button onClick={() => setEditingProduct(null)} className="flex-1 px-4 py-2.5 border border-warm-200 dark:border-dark-border text-darkwood dark:text-white rounded-xl font-medium hover:bg-warm-50 dark:hover:bg-dark-surface transition-colors text-sm">{t('common.cancel')}</button>
                <button onClick={() => handleSaveEdit(editingProduct)} className="flex-1 bg-clay text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-clay-dark transition-colors text-sm flex items-center justify-center gap-2"><Save className="h-4 w-4" />{t('admin.products.saveChanges')}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDeleteConfirm(null)}>
            <motion.div className="bg-white dark:bg-dark-card rounded-2xl border border-warm-100 dark:border-dark-border shadow-2xl max-w-sm w-full p-6 text-center" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
              <div className="w-14 h-14 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-7 w-7 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-darkwood dark:text-white mb-2">{t('admin.products.deleteProduct')}</h3>
              <p className="text-darkwood/50 dark:text-white text-sm mb-6">{t('admin.products.deleteWarning')}</p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 px-4 py-2.5 border border-warm-200 dark:border-dark-border text-darkwood dark:text-white rounded-xl font-medium hover:bg-warm-50 dark:hover:bg-dark-surface transition-colors text-sm">{t('common.cancel')}</button>
                <button onClick={() => handleDelete(showDeleteConfirm)} className="flex-1 bg-red-500 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-red-600 transition-colors text-sm">{t('common.delete')}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}