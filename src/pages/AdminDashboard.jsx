import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Package, ShoppingCart, Plus, Download, Shield, UserPlus, Award, FileText } from 'lucide-react'
import useAuthStore from '@/store/useAuthStore'
import useProductsStore from '@/store/useProductsStore'
import useThemeStore from '@/store/useThemeStore'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { toast } from 'sonner'
import { exportAdminReportPDF } from '@/lib/pdfExport'

export default function AdminDashboard() {
  const { userProfile } = useAuthStore()
  const { t } = useTranslation()
  const { formatPrice } = useThemeStore()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({ products: 0, orders: 0 })
  const [recentOrders, setRecentOrders] = useState([])
  const [allOrders, setAllOrders] = useState([])
  const [designers, setDesigners] = useState([])
  const [users, setUsers] = useState([])
  const products = useProductsStore((s) => s.products)
  const loaded = useProductsStore((s) => s.loaded)

  useEffect(() => {
    const load = async () => {
      try {
        const [ordersSnap, usersSnap] = await Promise.all([
          getDocs(collection(db, 'orders')),
          getDocs(collection(db, 'users')),
        ])
        const orders = ordersSnap.docs.map((d) => {
          const data = d.data()
          const ts = data?.createdAt?.toDate?.()
          return {
            id: d.id,
            ...data,
            customer: data?.shipping?.fullName || data?.userEmail || 'Customer',
            total: data?.total ?? 0,
            status: data?.status || 'pending',
            date: ts ? ts.toLocaleDateString() : '',
          }
        })
        const allUsers = usersSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
        setDesigners(allUsers.filter((u) => u.role === 'designer'))
        setUsers(allUsers.filter((u) => u.role === 'user' || !u.role))
        setRecentOrders(orders.slice(0, 5))
        setStats({
          products: products?.length ?? 0,
          orders: ordersSnap.size ?? 0,
          designers: allUsers.filter((u) => u.role === 'designer').length,
          users: allUsers.filter((u) => u.role === 'user' || !u.role).length,
        })
      } catch (_) {
        setStats({ products: products?.length ?? 0, orders: 0 })
        setRecentOrders([])
      }
      setTimeout(() => setIsLoading(false), 600)
    }
    if (loaded) load()
    else setTimeout(() => setIsLoading(false), 800)
  }, [loaded, products?.length])

  const handleExportData = () => {
    const data = [
      ['Metric', 'Value'],
      ['Total Products', stats.products],
      ['Total Orders', stats.orders],
      ['Exported', new Date().toLocaleString()],
    ]
    const csv = data.map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lee-roo-admin-export-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success(t('admin.exportSuccess') || 'Data exported')
  }

  const handleExportPDF = () => {
    exportAdminReportPDF({
      products: products || [],
      orders: allOrders,
      designers,
      users,
      stats,
    })
    toast.success(t('admin.exportSuccess') || 'PDF exported')
  }

  const handleQuickAdd = () => navigate('/admin/products')

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warm-50 dark:bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-clay rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <p className="text-darkwood/60 dark:text-white text-sm">{t('admin.preparingDashboard')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-warm-50 dark:bg-dark-bg">
      {/* Header — minimal */}
      <div className="bg-white dark:bg-dark-card border-b border-warm-100 dark:border-dark-border">
        <div className="max-w-3xl mx-auto px-4 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-clay rounded-xl flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-darkwood dark:text-white font-display">
                  {t('admin.dashboard')}
                </h1>
                <p className="text-darkwood/50 dark:text-white text-xs">
                  {t('admin.welcomeBack', { name: userProfile?.name || t('admin.administrator') })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportData}
                className="text-xs text-darkwood/60 dark:text-white hover:text-clay dark:hover:text-clay px-2 py-1.5 rounded-lg hover:bg-warm-100 dark:hover:bg-dark-surface transition-colors inline-flex items-center gap-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                CSV
              </button>
              <button
                onClick={handleExportPDF}
                className="text-xs text-darkwood/60 dark:text-white hover:text-clay dark:hover:text-clay px-2 py-1.5 rounded-lg hover:bg-warm-100 dark:hover:bg-dark-surface transition-colors inline-flex items-center gap-1.5"
              >
                <FileText className="h-3.5 w-3.5" />
                PDF
              </button>
              <button
                onClick={handleQuickAdd}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-clay hover:bg-clay-dark text-white font-medium rounded-xl transition-colors text-sm"
              >
                <Plus className="h-4 w-4" />
                {t('admin.quickAdd')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Stats — 2 cards */}
        <motion.div
          className="grid grid-cols-2 gap-3 mb-6"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Link
            to="/admin/products"
            className="bg-white dark:bg-dark-card rounded-xl border border-warm-100 dark:border-dark-border p-4 hover:border-clay/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-darkwood/50 dark:text-white text-xs font-medium">{t('admin.products')}</p>
                <p className="text-xl font-bold text-darkwood dark:text-white mt-0.5">{stats.products}</p>
              </div>
              <Package className="h-8 w-8 text-clay/40" />
            </div>
          </Link>
          <Link
            to="/admin/orders"
            className="bg-white dark:bg-dark-card rounded-xl border border-warm-100 dark:border-dark-border p-4 hover:border-clay/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-darkwood/50 dark:text-white text-xs font-medium">{t('admin.recentOrders')}</p>
                <p className="text-xl font-bold text-darkwood dark:text-white mt-0.5">{stats.orders}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-forest/40" />
            </div>
          </Link>
        </motion.div>

        {/* Quick Actions — 3 only */}
        <motion.div
          className="grid grid-cols-3 gap-3 mb-6"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
        >
          <Link
            to="/admin/products"
            className="flex flex-col items-center justify-center p-5 rounded-xl bg-white dark:bg-dark-card border border-warm-100 dark:border-dark-border hover:border-clay/30 transition-colors"
          >
            <Package className="h-6 w-6 text-clay mb-2" />
            <span className="text-sm font-medium text-darkwood dark:text-white">{t('admin.addProduct')}</span>
          </Link>
          <Link
            to="/admin/team"
            className="flex flex-col items-center justify-center p-5 rounded-xl bg-white dark:bg-dark-card border border-warm-100 dark:border-dark-border hover:border-forest/30 transition-colors"
          >
            <UserPlus className="h-6 w-6 text-forest mb-2" />
            <span className="text-sm font-medium text-darkwood dark:text-white">{t('admin.addDesigner') || 'Add Designer'}</span>
          </Link>
          <Link
            to="/admin/orders"
            className="flex flex-col items-center justify-center p-5 rounded-xl bg-white dark:bg-dark-card border border-warm-100 dark:border-dark-border hover:border-clay/30 transition-colors"
          >
            <ShoppingCart className="h-6 w-6 text-darkwood dark:text-white mb-2" />
            <span className="text-sm font-medium text-darkwood dark:text-white">{t('admin.viewOrders')}</span>
          </Link>
        </motion.div>

        {/* Recent Orders + Top Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <motion.div
            className="bg-white dark:bg-dark-card rounded-xl border border-warm-100 dark:border-dark-border overflow-hidden"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.1 }}
          >
            <div className="p-3 border-b border-warm-100 dark:border-dark-border flex justify-between items-center">
              <h3 className="font-semibold text-darkwood dark:text-white text-sm">{t('admin.recentOrders')}</h3>
              <Link to="/admin/orders" className="text-xs text-clay hover:text-clay-dark font-medium">{t('admin.viewAll')}</Link>
            </div>
            <div className="divide-y divide-warm-100 dark:divide-dark-border max-h-52 overflow-y-auto">
              {recentOrders.length === 0 ? (
                <div className="p-5 text-center text-darkwood/50 dark:text-white text-sm">{t('admin.noOrders') || 'No orders yet'}</div>
              ) : (
                recentOrders.map((order) => (
                  <div key={order.id} className="p-3 hover:bg-warm-50 dark:hover:bg-dark-surface/50">
                    <div className="flex justify-between items-center gap-2">
                      <div className="min-w-0">
                        <span className="text-sm font-medium text-darkwood dark:text-white block truncate">{order.customer}</span>
                        <span className="text-xs text-darkwood/50 dark:text-white">{order.id?.slice(0, 10)} · {order.date}</span>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-sm font-bold text-darkwood dark:text-white block">{formatPrice(order.total ?? 0)}</span>
                        <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium ${order.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : order.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>{order.status}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-dark-card rounded-xl border border-warm-100 dark:border-dark-border overflow-hidden"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.12 }}
          >
            <div className="p-3 border-b border-warm-100 dark:border-dark-border flex justify-between items-center">
              <h3 className="font-semibold text-darkwood dark:text-white text-sm">{t('admin.topProducts')}</h3>
              <Link to="/admin/products" className="text-xs text-clay hover:text-clay-dark font-medium">{t('admin.viewAll')}</Link>
            </div>
            <div className="divide-y divide-warm-100 dark:divide-dark-border max-h-52 overflow-y-auto">
              {products?.slice(0, 5).map((p) => (
                <div key={p.id} className="p-3 hover:bg-warm-50 dark:hover:bg-dark-surface/50 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex-shrink-0 overflow-hidden bg-warm-100 dark:bg-dark-surface" style={{ backgroundColor: !p.image && (p.color || p.colors?.[0] || '#8B6F47') }}>
                    {p.image ? <img src={p.image} alt="" className="w-full h-full object-cover" /> : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-darkwood dark:text-white truncate">{p.name}</p>
                    <p className="text-xs text-darkwood/50 dark:text-white">{formatPrice(p.price ?? 0)}</p>
                  </div>
                  <Award className="h-4 w-4 text-clay/50 flex-shrink-0" />
                </div>
              ))}
              {(!products || products.length === 0) && (
                <div className="p-5 text-center text-darkwood/50 dark:text-white text-sm">{t('admin.noProducts') || 'No products yet'}</div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
