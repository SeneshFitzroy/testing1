import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Plus,
  Eye,
  Edit2,
  Trash2,
  Copy,
  Palette,
  FolderOpen,
  Store,
  Calendar,
  BarChart3,
  Heart,
  ShoppingCart,
  Clock,
  TrendingUp,
  ArrowRight,
  Star,
  Crown,
  Zap
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import useAuthStore from '@/store/useAuthStore'
import useDesignStore from '@/store/useDesignStore'
import useCartStore from '@/store/useCartStore'
import { useTranslation } from 'react-i18next'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
}

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } }
}

export default function Dashboard() {
  const { userProfile } = useAuthStore()
  const { savedDesigns } = useDesignStore()
  const { getWishlistCount, getCartCount } = useCartStore()
  const { t } = useTranslation()

  const recentDesigns = savedDesigns.slice(0, 3)
  const cartCount = getCartCount()
  const wishlistCount = getWishlistCount()

  const stats = [
    {
      label: t('dashboard.savedDesigns'),
      value: savedDesigns.length,
      icon: FolderOpen,
      bgGradient: 'from-clay/10 to-clay/5 dark:from-clay/10 dark:to-clay/5',
      iconBg: 'bg-clay',
      change: t('dashboard.thisMonth.change')
    },
    {
      label: t('dashboard.wishlistItems'),
      value: wishlistCount,
      icon: Heart,
      bgGradient: 'from-red-50 to-red-100/50 dark:from-red-900/10 dark:to-red-800/10',
      iconBg: 'bg-red-500',
      change: t('dashboard.wishlistItems')
    },
    {
      label: t('dashboard.cartItems'),
      value: cartCount,
      icon: ShoppingCart,
      bgGradient: 'from-forest/10 to-forest/5 dark:from-forest/10 dark:to-forest/5',
      iconBg: 'bg-forest',
      change: t('dashboard.readyToCheckout')
    },
    {
      label: t('dashboard.thisMonth'),
      value: recentDesigns.filter(d => {
        const designDate = new Date(d.createdAt)
        const now = new Date()
        return designDate.getMonth() === now.getMonth() && designDate.getFullYear() === now.getFullYear()
      }).length,
      icon: TrendingUp,
      bgGradient: 'from-darkwood/10 to-darkwood/5 dark:from-darkwood-light/10 dark:to-darkwood-light/5',
      iconBg: 'bg-darkwood',
      change: t('dashboard.activeProjects')
    },
  ]

  const quickActions = [
    {
      to: '/editor',
      label: t('dashboard.newDesign'),
      description: t('dashboard.newDesign.desc'),
      icon: Plus,
      bg: 'bg-clay',
      shadow: 'shadow-clay/25'
    },
    {
      to: '/shop',
      label: t('dashboard.browseShop'),
      description: t('dashboard.browseShop.desc'),
      icon: Store,
      bg: 'bg-forest',
      shadow: 'shadow-forest/25'
    },
    {
      to: '/my-designs',
      label: t('dashboard.viewDesigns'),
      description: t('dashboard.viewDesigns.desc'),
      icon: FolderOpen,
      bg: 'bg-darkwood',
      shadow: 'shadow-darkwood/25'
    },
    {
      to: '/meet-designer',
      label: t('dashboard.bookConsultation'),
      description: t('dashboard.bookConsultation.desc'),
      icon: Calendar,
      bg: 'bg-clay-dark',
      shadow: 'shadow-clay-dark/25'
    },
  ]

  return (
    <div className="min-h-screen bg-warm-50 dark:bg-dark-bg">
      {/* Premium Header with Greeting */}
      <div className="relative bg-darkwood overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-clay/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-forest/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 lg:py-14 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
          >
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-4">
                <Crown className="h-4 w-4 text-amber-400" />
                <span className="text-white/90 text-sm font-medium">{t('dashboard.welcomeBack')}</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 tracking-tight font-display">
                {t('nav.dashboard')}
              </h1>
              <p className="text-warm-300 text-lg">
                {t('dashboard.welcome', { name: userProfile?.displayName || 'Designer' })}
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/editor"
                className="inline-flex items-center gap-2 bg-clay text-white px-6 py-3 rounded-xl font-semibold hover:bg-clay-dark hover:shadow-lg hover:shadow-clay/25 transition-all hover:-translate-y-0.5"
              >
                <Plus className="h-5 w-5" />
                {t('dashboard.newDesign')}
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-xl font-medium hover:bg-white/20 transition-all"
              >
                <Store className="h-5 w-5" />
                {t('dashboard.browseShop')}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 -mt-8 relative z-20 pb-12">
        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10"
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              className={`bg-gradient-to-br ${stat.bgGradient} backdrop-blur-sm rounded-2xl border border-warm-200/50 dark:border-dark-border p-5 hover:scale-105 transition-all duration-300 group`}
              variants={fadeInUp}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-11 h-11 ${stat.iconBg} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs font-medium text-darkwood/50 dark:text-gray-200 bg-white/50 dark:bg-dark-surface/50 px-2 py-1 rounded-full">{stat.change}</span>
              </div>
              <div className="text-3xl font-bold text-darkwood dark:text-warm-100 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-darkwood/60 dark:text-gray-200 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="mb-10"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-clay rounded-lg flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-darkwood dark:text-warm-100">
              {t('dashboard.quickActions')}
            </h2>
          </div>
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
            variants={stagger}
          >
            {quickActions.map((action) => (
              <motion.div key={action.to} variants={fadeInUp}>
                <Link
                  to={action.to}
                  className={`block p-6 rounded-2xl text-white text-center group hover:scale-105 hover:shadow-xl ${action.shadow} transition-all duration-300 relative overflow-hidden ${action.bg}`}
                >
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-x-6 -translate-y-6" />
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <action.icon className="h-7 w-7" />
                    </div>
                    <h3 className="font-bold mb-1">{action.label}</h3>
                    <p className="text-sm text-white/80">{action.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Recent Designs */}
        <motion.div
          className="mb-10"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-darkwood rounded-lg flex items-center justify-center">
                <Palette className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-xl font-bold text-darkwood dark:text-warm-100">
                {t('dashboard.recentDesigns')}
              </h2>
            </div>
            {savedDesigns.length > 3 && (
              <Link
                to="/my-designs"
                className="text-clay hover:text-clay-dark font-medium flex items-center gap-1.5 text-sm group"
              >
                <span>{t('dashboard.viewAll')}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>

          {recentDesigns.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={stagger}
            >
              {recentDesigns.map((design) => (
                <motion.div
                  key={design.id}
                  className="bg-white dark:bg-dark-card rounded-2xl border border-warm-100 dark:border-dark-border overflow-hidden group hover:shadow-xl hover:shadow-clay/5 hover:border-clay/20 transition-all duration-300"
                  variants={fadeInUp}
                  whileHover={{ y: -4 }}
                >
                  <div className="aspect-video bg-gradient-to-br from-warm-100 to-warm-50 dark:from-dark-surface dark:to-dark-card relative overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center">
                      <Palette className="h-12 w-12 text-warm-300 dark:text-dark-border" />
                    </div>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <div className="flex gap-2">
                        <Link
                          to={`/editor/${design.id}`}
                          className="p-2 bg-white/90 dark:bg-dark-card/90 backdrop-blur-sm rounded-lg shadow-lg hover:scale-110 transition-transform"
                        >
                          <Edit2 className="h-4 w-4 text-clay" />
                        </Link>
                        <button className="p-2 bg-white/90 dark:bg-dark-card/90 backdrop-blur-sm rounded-lg shadow-lg hover:scale-110 transition-transform">
                          <Copy className="h-4 w-4 text-darkwood dark:text-warm-300" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-darkwood dark:text-warm-100 mb-2 truncate">
                      {design.name}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-darkwood/50 dark:text-gray-200 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{formatDate(design.updatedAt)}</span>
                      </div>
                      <span className="bg-warm-100 dark:bg-dark-surface px-2 py-0.5 rounded-full text-xs font-medium">{design.furnitureItems?.length || 0} items</span>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/editor/${design.id}`}
                        className="flex-1 bg-clay text-white text-center text-sm font-semibold py-2.5 rounded-xl hover:bg-clay-dark hover:shadow-lg hover:shadow-clay/25 transition-all"
                      >
                        {t('dashboard.openEditor')}
                      </Link>
                      <button className="p-2.5 border border-warm-200 dark:border-dark-border rounded-xl text-darkwood/50 hover:text-clay hover:border-clay/20 transition-all">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="bg-white dark:bg-dark-card rounded-2xl border border-warm-100 dark:border-dark-border p-16 text-center"
              variants={fadeInUp}
            >
              <div className="w-20 h-20 bg-clay/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Palette className="h-10 w-10 text-clay" />
              </div>
              <h3 className="text-xl font-bold text-darkwood dark:text-warm-100 mb-2">
                {t('dashboard.noDesigns')}
              </h3>
              <p className="text-darkwood/50 dark:text-gray-200 mb-8 max-w-md mx-auto">
                {t('dashboard.noDesigns.desc')}
              </p>
              <Link
                to="/editor"
                className="inline-flex items-center gap-2 bg-clay text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-clay-dark hover:shadow-lg hover:shadow-clay/25 transition-all hover:-translate-y-0.5"
              >
                <Plus className="h-5 w-5" />
                <span>{t('dashboard.createFirst')}</span>
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* Tips & Ideas Section */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          {/* Design Tips */}
          <motion.div
            className="bg-white dark:bg-dark-card rounded-2xl border border-warm-100 dark:border-dark-border p-6"
            variants={fadeInUp}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-forest rounded-lg flex items-center justify-center">
                <Star className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-darkwood dark:text-warm-100">
                {t('dashboard.designTips')}
              </h3>
            </div>
            <div className="space-y-4">
              {[
                { color: 'bg-clay', title: t('dashboard.tip1'), desc: t('dashboard.tip1.desc') },
                { color: 'bg-forest', title: t('dashboard.tip2'), desc: t('dashboard.tip2.desc') },
                { color: 'bg-darkwood', title: t('dashboard.tip3'), desc: t('dashboard.tip3.desc') },
              ].map((tip, i) => (
                <div key={i} className="flex gap-3 p-3 bg-warm-50 dark:bg-dark-surface rounded-xl hover:bg-warm-100 dark:hover:bg-dark-border/50 transition-colors">
                  <div className={`w-2 h-2 ${tip.color} rounded-full mt-2 flex-shrink-0`} />
                  <div>
                    <p className="font-semibold text-darkwood dark:text-warm-100 text-sm">{tip.title}</p>
                    <p className="text-sm text-darkwood/50 dark:text-gray-200">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Getting Started */}
          <motion.div
            className="bg-white dark:bg-dark-card rounded-2xl border border-warm-100 dark:border-dark-border p-6"
            variants={fadeInUp}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-clay rounded-lg flex items-center justify-center">
                <Star className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-darkwood dark:text-warm-100">
                {t('dashboard.gettingStarted')}
              </h3>
            </div>
            <div className="space-y-3">
              {[
                { num: 1, bg: 'bg-clay', bgLight: 'bg-clay/10 dark:bg-clay/10', title: t('dashboard.step1'), desc: t('dashboard.step1.desc') },
                { num: 2, bg: 'bg-forest', bgLight: 'bg-forest/10 dark:bg-forest/10', title: t('dashboard.step2'), desc: t('dashboard.step2.desc') },
                { num: 3, bg: 'bg-darkwood', bgLight: 'bg-darkwood/10 dark:bg-darkwood-light/10', title: t('dashboard.step3'), desc: t('dashboard.step3.desc') },
              ].map((step) => (
                <div key={step.num} className={`flex items-center gap-4 p-4 ${step.bgLight} rounded-xl hover:scale-[1.02] transition-all`}>
                  <div className={`w-10 h-10 ${step.bg} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <span className="text-white text-sm font-bold">{step.num}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-darkwood dark:text-warm-100 text-sm">{step.title}</p>
                    <p className="text-sm text-darkwood/50 dark:text-gray-200">{step.desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-warm-400 ml-auto" />
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}