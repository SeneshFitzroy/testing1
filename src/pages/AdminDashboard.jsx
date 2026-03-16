import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  DollarSign,
  Eye,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  Settings,
  BarChart3,
  PieChart,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Star,
  Heart,
  MessageCircle,
  Truck,
  CreditCard,
  Layers,
  Tag,
  Image,
  Palette,
  Globe,
  Shield,
  Zap,
  Target,
  Award,
  Mail,
  Phone,
  MapPin,
  Building,
  Megaphone,
  FileText,
  Database,
  Activity,
  UserPlus,
  X
} from 'lucide-react'
import useAuthStore from '@/store/useAuthStore'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore'
import { toast } from 'sonner'
import { AnimatePresence } from 'framer-motion'

export default function AdminDashboard() {
  const { userProfile } = useAuthStore()
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState('7d')
  const [addAdminOpen, setAddAdminOpen] = useState(false)
  const [addAdminEmail, setAddAdminEmail] = useState('')
  const [addAdminLoading, setAddAdminLoading] = useState(false)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1500)
  }, [])

  // Mock data - Replace with real API calls
  const dashboardStats = {
    totalRevenue: '$125,430',
    revenueChange: '+12.5%',
    totalOrders: '1,247',
    ordersChange: '+8.2%',
    totalCustomers: '2,891',
    customersChange: '+15.3%',
    conversionRate: '3.4%',
    conversionChange: '+2.1%'
  }

  const recentOrders = [
    { id: '#ORD-001', customer: 'Sarah Johnson', amount: '$1,234', status: 'completed', date: '2024-02-27', items: 3 },
    { id: '#ORD-002', customer: 'Michael Chen', amount: '$856', status: 'pending', date: '2024-02-27', items: 2 },
    { id: '#ORD-003', customer: 'Emma Davis', amount: '$2,341', status: 'processing', date: '2024-02-26', items: 5 },
    { id: '#ORD-004', customer: 'David Wilson', amount: '$432', status: 'shipped', date: '2024-02-26', items: 1 },
    { id: '#ORD-005', customer: 'Lisa Zhang', amount: '$967', status: 'completed', date: '2024-02-25', items: 4 }
  ]

  const topProducts = [
    { id: 1, name: 'Modern Sofa Set', sales: 145, revenue: '$72,500', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400' },
    { id: 2, name: 'Dining Table Oak', sales: 98, revenue: '$49,000', image: 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=400' },
    { id: 3, name: 'Office Chair Premium', sales: 87, revenue: '$26,100', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400' },
    { id: 4, name: 'Bedroom Set Luxury', sales: 65, revenue: '$97,500', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400' },
    { id: 5, name: 'Coffee Table Modern', sales: 54, revenue: '$16,200', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400' }
  ]

  const managementSections = [
    {
      id: 'products',
      title: t('admin.productMgmt'),
      description: t('admin.productMgmt.desc'),
      icon: Package,
      color: 'from-blue-500 to-cyan-500',
      features: ['Add New Products', 'Edit/Delete Products', 'Bulk Upload', 'Product Status', 'Inventory Tracking'],
      stats: { total: 1247, active: 1205, draft: 42 }
    },
    {
      id: 'categories',
      title: t('admin.categoryMgmt'),
      description: t('admin.categoryMgmt.desc'),
      icon: Layers,
      color: 'from-purple-500 to-pink-500',
      features: ['Add/Edit Categories', 'Category Hierarchy', 'SEO Settings', 'Image Management'],
      stats: { total: 24, active: 22, subcategories: 67 }
    },
    {
      id: 'variants',
      title: t('admin.variantMgmt'),
      description: t('admin.variantMgmt.desc'),
      icon: Palette,
      color: 'from-green-500 to-teal-500',
      features: ['Color Management', 'Material Library', 'Size Charts', 'Custom Attributes'],
      stats: { colors: 156, materials: 89, sizes: 34 }
    },
    {
      id: 'orders',
      title: t('admin.orderMgmt'),
      description: t('admin.orderMgmt.desc'),
      icon: ShoppingCart,
      color: 'from-orange-500 to-red-500',
      features: ['Order Processing', 'Status Updates', 'Refunds', 'Order Analytics'],
      stats: { pending: 23, processing: 45, shipped: 112 }
    },
    {
      id: 'customers',
      title: t('admin.customerMgmt'),
      description: t('admin.customerMgmt.desc'),
      icon: Users,
      color: 'from-indigo-500 to-purple-500',
      features: ['Customer Profiles', 'Order History', 'Communication', 'Loyalty Programs'],
      stats: { total: 2891, active: 2456, vip: 145 }
    },
    {
      id: 'delivery',
      title: t('admin.deliveryMgmt'),
      description: t('admin.deliveryMgmt.desc'),
      icon: Truck,
      color: 'from-yellow-500 to-orange-500',
      features: ['Shipping Zones', 'Delivery Tracking', 'Logistics Partners', 'Delivery Analytics'],
      stats: { inTransit: 89, delivered: 445, returned: 12 }
    },
    {
      id: 'analytics',
      title: t('admin.analytics'),
      description: t('admin.analytics.desc'),
      icon: BarChart3,
      color: 'from-teal-500 to-green-500',
      features: ['Sales Reports', 'Customer Insights', 'Product Performance', 'Revenue Analytics'],
      stats: { reports: 12, insights: 34, alerts: 7 }
    },
    {
      id: 'marketing',
      title: t('admin.marketing'),
      description: t('admin.marketing.desc'),
      icon: Megaphone,
      color: 'from-pink-500 to-rose-500',
      features: ['Email Campaigns', 'Discount Codes', 'Social Media', 'SEO Tools'],
      stats: { campaigns: 8, subscribers: 12450, coupons: 23 }
    }
  ]

  const getStatusColor = (status) => {
    const colors = {
      'completed': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      'processing': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'shipped': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    }
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warm-50 dark:bg-dark-bg flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-16 h-16 bg-clay rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-darkwood dark:text-warm-100 mb-2">{t('admin.loading')}</h2>
          <p className="text-darkwood/60 dark:text-warm-400">{t('admin.preparingDashboard')}</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-warm-50 dark:bg-dark-bg">
      {/* Header Section */}
      <motion.div
        className="bg-white dark:bg-dark-card shadow-sm border-b border-warm-100 dark:border-dark-border"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-clay rounded-2xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-darkwood dark:text-warm-100 font-display">
                  {t('admin.dashboard')}
                </h1>
                <p className="text-darkwood/60 dark:text-warm-400">
                  {t('admin.welcomeBack', { name: userProfile?.name || t('admin.administrator') })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-4 py-2 bg-forest hover:bg-forest-light text-white font-semibold rounded-lg transition-all duration-300 shadow-lg"
              >
                <Download className="h-4 w-4" />
                <span>{t('admin.exportData')}</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-4 py-2 bg-clay hover:bg-clay-dark text-white font-semibold rounded-lg transition-all duration-300 shadow-lg"
              >
                <Plus className="h-4 w-4" />
                <span>{t('admin.quickAdd')}</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          {[
            {
              title: t('admin.totalRevenue'),
              value: dashboardStats.totalRevenue,
              change: dashboardStats.revenueChange,
              icon: DollarSign,
              color: 'from-green-500 to-emerald-500'
            },
            {
              title: t('admin.totalOrders'),
              value: dashboardStats.totalOrders,
              change: dashboardStats.ordersChange,
              icon: ShoppingCart,
              color: 'from-blue-500 to-cyan-500'
            },
            {
              title: t('admin.totalCustomers'),
              value: dashboardStats.totalCustomers,
              change: dashboardStats.customersChange,
              icon: Users,
              color: 'from-purple-500 to-pink-500'
            },
            {
              title: t('admin.conversionRate'),
              value: dashboardStats.conversionRate,
              change: dashboardStats.conversionChange,
              icon: TrendingUp,
              color: 'from-orange-500 to-red-500'
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-lg border border-warm-100 dark:border-dark-border hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-darkwood/60 dark:text-warm-400 text-sm font-medium mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-black text-darkwood dark:text-warm-100">
                    {stat.value}
                  </p>
                  <p className="text-green-600 dark:text-green-400 text-sm font-semibold mt-1">
                    {stat.change} {t('admin.fromLastPeriod')}
                  </p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Management Sections Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          {managementSections.map((section, index) => (
            <motion.div
              key={section.id}
              variants={fadeInUp}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-lg border border-warm-100 dark:border-dark-border hover:shadow-xl transition-all duration-300 group"
            >
              <div className={`h-2 bg-gradient-to-r ${section.color}`} />
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${section.color} rounded-xl flex items-center justify-center`}>
                    <section.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="flex space-x-1">
                      {Object.entries(section.stats).map(([key, value], statIndex) => (
                        <div key={statIndex} className="text-center">
                          <div className="text-sm font-bold text-darkwood dark:text-warm-100">{value}</div>
                          <div className="text-xs text-darkwood/50 dark:text-warm-400 capitalize">{key}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-darkwood dark:text-warm-100 mb-2 group-hover:text-clay transition-colors">
                  {section.title}
                </h3>
                <p className="text-darkwood/60 dark:text-warm-400 text-sm mb-4">
                  {section.description}
                </p>
                
                <div className="space-y-1 mb-4">
                  {section.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-xs text-darkwood/50 dark:text-warm-400">
                      <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>
                
                <Link
                  to={`/admin/${section.id}`}
                  className={`w-full inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r ${section.color} hover:opacity-90 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg group`}
                >
                  <span>Manage {section.title.split(' ')[0]}</span>
                  <Edit className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <motion.div
            className="bg-white dark:bg-dark-card rounded-2xl shadow-lg border border-warm-100 dark:border-dark-border"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <div className="p-6 border-b border-warm-100 dark:border-dark-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-clay rounded-lg flex items-center justify-center">
                    <ShoppingCart className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-darkwood dark:text-warm-100">{ t('admin.recentOrders')}</h3>
                </div>
                <Link
                  to="/admin/orders"
                  className="text-clay hover:text-clay-dark font-medium text-sm"
                >
                  {t('admin.viewAll')}
                </Link>
              </div>
            </div>
            
            <div className="divide-y divide-warm-100 dark:divide-dark-border">
              {recentOrders.map((order, index) => (
                <div key={order.id} className="p-6 hover:bg-warm-50 dark:hover:bg-dark-surface/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-warm-100 dark:bg-dark-surface rounded-full flex items-center justify-center">
                            <Users className="h-4 w-4 text-darkwood/60 dark:text-warm-400" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-darkwood dark:text-warm-100">{order.customer}</p>
                            <p className="text-xs text-darkwood/50 dark:text-warm-400">{order.id}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-darkwood dark:text-warm-100">{order.amount}</p>
                          <p className="text-xs text-darkwood/50 dark:text-warm-400">{order.items} items</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <span className="text-xs text-darkwood/50 dark:text-warm-400">{order.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Products */}
          <motion.div
            className="bg-white dark:bg-dark-card rounded-2xl shadow-lg border border-warm-100 dark:border-dark-border"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <div className="p-6 border-b border-warm-100 dark:border-dark-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-darkwood rounded-lg flex items-center justify-center">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-darkwood dark:text-warm-100">{t('admin.topProducts')}</h3>
                </div>
                <Link
                  to="/admin/products"
                  className="text-darkwood hover:text-darkwood-light dark:text-warm-300 font-medium text-sm"
                >
                  {t('admin.viewAll')}
                </Link>
              </div>
            </div>
            
            <div className="divide-y divide-warm-100 dark:divide-dark-border">
              {topProducts.map((product, index) => (
                <div key={product.id} className="p-6 hover:bg-warm-50 dark:hover:bg-dark-surface/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-darkwood dark:text-warm-100 mb-1">{product.name}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="text-xs text-darkwood/50 dark:text-warm-400">{product.sales} sales</span>
                          <span className="text-xs font-bold text-green-600 dark:text-green-400">{product.revenue}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, starIndex) => (
                            <Star
                              key={starIndex}
                              className="h-3 w-3 text-yellow-400 fill-current"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          className="mt-8 bg-white dark:bg-dark-card rounded-2xl shadow-lg border border-warm-100 dark:border-dark-border p-6"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <h3 className="text-lg font-bold text-darkwood dark:text-warm-100 mb-6 flex items-center">
            <Zap className="h-5 w-5 text-yellow-500 mr-2" />
            {t('admin.quickActions')}
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {[
              { label: t('admin.addProduct'), icon: Plus, color: 'from-blue-500 to-cyan-500', action: '/admin/products/new' },
              { label: t('admin.viewOrders'), icon: ShoppingCart, color: 'from-green-500 to-teal-500', action: '/admin/orders' },
              { label: t('admin.customers'), icon: Users, color: 'from-purple-500 to-pink-500', action: '/admin/customers' },
              { label: t('admin.analyticsLabel'), icon: BarChart3, color: 'from-orange-500 to-red-500', action: '/admin/analytics' },
              { label: t('admin.categories'), icon: Layers, color: 'from-indigo-500 to-purple-500', action: '/admin/categories' },
              { label: t('admin.settings'), icon: Settings, color: 'from-gray-500 to-gray-600', action: '/admin/settings' },
              { label: t('admin.reports'), icon: FileText, color: 'from-teal-500 to-green-500', action: '/admin/reports' },
              { label: t('admin.backup'), icon: Database, color: 'from-yellow-500 to-orange-500', action: '/admin/backup' }
            ].map((action, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center p-4 rounded-xl bg-warm-50 dark:bg-dark-surface hover:bg-warm-100 dark:hover:bg-dark-border transition-all duration-300 group"
              >
                <div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs font-medium text-darkwood/70 dark:text-warm-300 text-center">
                  {action.label}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}