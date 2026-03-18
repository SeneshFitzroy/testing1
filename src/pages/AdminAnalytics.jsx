import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, BarChart3, TrendingUp, Clock, Users, Package, FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import useProductsStore from '@/store/useProductsStore'
import useThemeStore from '@/store/useThemeStore'
import { exportAdminReportPDF } from '@/lib/pdfExport'

const CHART_COLORS = ['#8B6F47', '#4A2F21', '#3F5E45', '#D9C7B8', '#C4A88E']

export default function AdminAnalytics() {
  const { t } = useTranslation()
  const { formatPrice } = useThemeStore()
  const products = useProductsStore((s) => s.products)
  const loaded = useProductsStore((s) => s.loaded)
  const [orders, setOrders] = useState([])
  const [designers, setDesigners] = useState([])
  const [users, setUsers] = useState([])
  const [designs, setDesigns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [ordersSnap, usersSnap, designsSnap] = await Promise.all([
          getDocs(collection(db, 'orders')),
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'designs')),
        ])
        const ords = ordersSnap.docs.map((d) => {
          const data = d.data()
          const ts = data?.createdAt?.toDate?.()
          return {
            id: d.id,
            ...data,
            total: data?.total ?? 0,
            date: ts ? ts.toLocaleDateString() : '',
            month: ts ? `${ts.getFullYear()}-${String(ts.getMonth() + 1).padStart(2, '0')}` : '',
          }
        })
        const usrs = usersSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
        const des = designsSnap.docs.map((d) => {
          const data = d.data()
          return {
            id: d.id,
            ...data,
            createdBy: data?.createdBy,
            updatedAt: data?.updatedAt?.toDate?.()?.getTime?.() || 0,
            createdAt: data?.createdAt?.toDate?.()?.getTime?.() || 0,
          }
        })
        setOrders(ords)
        setDesigners(usrs.filter((u) => u.role === 'designer'))
        setUsers(usrs.filter((u) => u.role === 'user' || !u.role))
        setDesigns(des)
      } catch (_) {}
      setLoading(false)
    }
    load()
  }, [])

  // Designer working stats: designs count per designer, estimated hours
  const designerStats = designers.map((d) => {
    const designerDesigns = designs.filter((des) => des.createdBy === d.uid)
    const totalHours = designerDesigns.reduce((sum, des) => {
      const dur = (des.updatedAt - des.createdAt) / (1000 * 60 * 60)
      return sum + Math.max(0.1, Math.min(24, dur || 0.5))
    }, 0)
    return {
      name: d.name || d.displayName || d.email?.split('@')[0] || d.uid?.slice(0, 8),
      designs: designerDesigns.length,
      hours: Math.round(totalHours * 10) / 10,
    }
  })

  // Category distribution for products
  const categoryData = (products || []).reduce((acc, p) => {
    const cat = p.category || 'Other'
    acc[cat] = (acc[cat] || 0) + 1
    return acc
  }, {})
  const pieData = Object.entries(categoryData).map(([name, value], i) => ({
    name,
    value,
    color: CHART_COLORS[i % CHART_COLORS.length],
  }))

  // Orders by month
  const ordersByMonth = orders.reduce((acc, o) => {
    const m = o.month || 'Unknown'
    acc[m] = (acc[m] || 0) + 1
    return acc
  }, {})
  const barData = Object.entries(ordersByMonth)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-6)
    .map(([name, count]) => ({ name, orders: count }))

  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0)
  const totalProductsValue = (products || []).reduce((s, p) => s + (p.price || 0), 0)

  const handleExportPDF = () => {
    exportAdminReportPDF({
      products: products || [],
      orders,
      designers,
      users,
      stats: { products: products?.length ?? 0, orders: orders.length },
    })
  }

  if (loading && !loaded) {
    return (
      <div className="min-h-screen bg-warm-50 dark:bg-dark-bg flex items-center justify-center">
        <div className="animate-pulse text-clay">Loading analytics...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-warm-50 dark:bg-dark-bg">
      <div className="bg-white dark:bg-dark-card border-b border-warm-100 dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link to="/admin" className="p-2 rounded-xl bg-warm-100 dark:bg-dark-surface text-darkwood dark:text-white hover:bg-warm-200 dark:hover:bg-dark-border transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-darkwood dark:text-white font-display flex items-center gap-2">
                  <BarChart3 className="h-7 w-7 text-clay" />
                  {t('admin.analytics') || 'Analytics'}
                </h1>
                <p className="text-darkwood/50 dark:text-white text-sm mt-0.5">Totals, charts & designer activity</p>
              </div>
            </div>
            <button
              onClick={handleExportPDF}
              className="inline-flex items-center gap-2 bg-clay text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-clay-dark transition-colors text-sm"
            >
              <FileText className="h-4 w-4" />
              Export PDF
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Totals row */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-white dark:bg-dark-card rounded-xl border border-warm-100 dark:border-dark-border p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-clay/20 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-clay" />
              </div>
              <div>
                <p className="text-2xl font-bold text-darkwood dark:text-white">{products?.length ?? 0}</p>
                <p className="text-xs text-darkwood/50 dark:text-white">Total Products</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-dark-card rounded-xl border border-warm-100 dark:border-dark-border p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-forest/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-forest" />
              </div>
              <div>
                <p className="text-2xl font-bold text-darkwood dark:text-white">{formatPrice(totalRevenue)}</p>
                <p className="text-xs text-darkwood/50 dark:text-white">Total Revenue</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-dark-card rounded-xl border border-warm-100 dark:border-dark-border p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-clay-dark/20 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-clay-dark" />
              </div>
              <div>
                <p className="text-2xl font-bold text-darkwood dark:text-white">{designers.length}</p>
                <p className="text-xs text-darkwood/50 dark:text-white">Designers</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-dark-card rounded-xl border border-warm-100 dark:border-dark-border p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-forest/20 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-forest" />
              </div>
              <div>
                <p className="text-2xl font-bold text-darkwood dark:text-white">{designs.length}</p>
                <p className="text-xs text-darkwood/50 dark:text-white">Total Designs</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            className="bg-white dark:bg-dark-card rounded-xl border border-warm-100 dark:border-dark-border p-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-semibold text-darkwood dark:text-white mb-4">Orders by Month</h3>
            <div className="h-64">
              {barData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-dark-border" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#6b7280" />
                    <YAxis tick={{ fontSize: 11 }} stroke="#6b7280" />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg)', borderRadius: 8 }} />
                    <Bar dataKey="orders" fill="#8B6F47" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-darkwood/50 dark:text-white text-sm">No order data yet</div>
              )}
            </div>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-dark-card rounded-xl border border-warm-100 dark:border-dark-border p-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h3 className="font-semibold text-darkwood dark:text-white mb-4">Products by Category</h3>
            <div className="h-64">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-darkwood/50 dark:text-white text-sm">No products yet</div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Designer working times */}
        <motion.div
          className="bg-white dark:bg-dark-card rounded-xl border border-warm-100 dark:border-dark-border overflow-hidden"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="p-4 border-b border-warm-100 dark:border-dark-border">
            <h3 className="font-semibold text-darkwood dark:text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-clay" />
              Designer Working Times
            </h3>
            <p className="text-xs text-darkwood/50 dark:text-white mt-0.5">Designs created and estimated hours per designer</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-warm-100 dark:border-dark-border bg-warm-50 dark:bg-dark-surface">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-darkwood/60 dark:text-white uppercase">Designer</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-darkwood/60 dark:text-white uppercase">Designs</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-darkwood/60 dark:text-white uppercase">Est. Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-100 dark:divide-dark-border">
                {designerStats.length > 0 ? (
                  designerStats.map((ds, i) => (
                    <tr key={i} className="hover:bg-warm-50 dark:hover:bg-dark-surface/50">
                      <td className="px-4 py-3 text-sm font-medium text-darkwood dark:text-white">{ds.name}</td>
                      <td className="px-4 py-3 text-sm text-right text-darkwood dark:text-white">{ds.designs}</td>
                      <td className="px-4 py-3 text-sm text-right text-clay font-semibold">{ds.hours}h</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-darkwood/50 dark:text-white text-sm">No designer activity yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
