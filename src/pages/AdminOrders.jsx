import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import useThemeStore from '@/store/useThemeStore'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

function safeFormatPrice(formatPrice, value) {
  try {
    const num = Number(value)
    if (!Number.isFinite(num)) return '$0.00'
    return formatPrice ? formatPrice(num) : `$${num.toFixed(2)}`
  } catch {
    return '$0.00'
  }
}

export default function AdminOrders() {
  const { t } = useTranslation()
  const formatPrice = useThemeStore((s) => s.formatPrice)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDocs(collection(db, 'orders'))
        const list = snap.docs.map((d) => {
          try {
            const data = d.data() || {}
            const ts = data?.createdAt?.toDate?.()
            const totalVal = data?.total
            const total = typeof totalVal === 'number' ? totalVal : (typeof totalVal === 'string' ? parseFloat(totalVal) : 0)
            return {
              id: d.id,
              ...data,
              customer: data?.shipping?.fullName || data?.userEmail || 'Customer',
              total: Number.isFinite(total) ? total : 0,
              status: data?.status || 'pending',
              date: ts ? ts.toLocaleDateString() : '',
            }
          } catch {
            return { id: d.id, customer: 'Unknown', total: 0, status: 'pending', date: '' }
          }
        })
        list.sort((a, b) => {
          try {
            const ta = a.createdAt?.toDate?.()?.getTime?.() ?? new Date(a.date || 0).getTime()
            const tb = b.createdAt?.toDate?.()?.getTime?.() ?? new Date(b.date || 0).getTime()
            return (tb || 0) - (ta || 0)
          } catch {
            return 0
          }
        })
        setOrders(list)
      } catch (_) {
        setOrders([])
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-50 dark:bg-dark-bg flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-clay" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-warm-50 dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/admin" className="p-2 rounded-xl bg-warm-100 dark:bg-dark-surface text-darkwood dark:text-white hover:bg-warm-200 dark:hover:bg-dark-border transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-darkwood dark:text-white font-display">{t('admin.recentOrders') || 'Order Management'}</h1>
            <p className="text-darkwood/50 dark:text-white text-sm">{orders.length} orders</p>
          </div>
        </div>
        <motion.div
          className="bg-white dark:bg-dark-card rounded-2xl border border-warm-100 dark:border-dark-border overflow-hidden"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="divide-y divide-warm-100 dark:divide-dark-border">
            {orders.length === 0 ? (
              <div className="p-12 text-center text-darkwood/50 dark:text-white">No orders yet</div>
            ) : (
            orders.map((order, idx) => (
              <div key={order.id || `order-${idx}`} className="p-6 hover:bg-warm-50 dark:hover:bg-dark-surface/50 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-clay/10 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-clay" />
                  </div>
                  <div>
                    <p className="font-semibold text-darkwood dark:text-white">{order.customer || 'Customer'}</p>
                    <p className="text-sm text-darkwood/50 dark:text-white">{order.id || ''} · {order.date || ''}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-darkwood dark:text-white">{safeFormatPrice(formatPrice, order.total)}</p>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                    order.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    order.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>{order.status || 'pending'}</span>
                </div>
              </div>
            ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
