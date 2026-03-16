import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  Truck,
  Shield,
  RotateCcw,
  X,
  CreditCard,
  Gift,
  ChevronRight,
  Heart
} from 'lucide-react'
import useCartStore from '@/store/useCartStore'
import useThemeStore from '@/store/useThemeStore'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/constants'
import Mini3DPreview from '@/components/Mini3DPreview'
import { useTranslation } from 'react-i18next'

export default function Cart() {
  const { items: cart, removeFromCart, clearCart, updateQuantity, addToWishlist } = useCartStore()
  const { formatPrice } = useThemeStore()
  const { t } = useTranslation()

  const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 9.99
  const total = subtotal + shipping

  const handleQuantityChange = (item, newQty) => {
    if (newQty < 1) return
    if (updateQuantity) {
      updateQuantity(item.id, newQty)
    }
  }

  return (
    <div className="min-h-screen bg-warm-50 dark:bg-dark-bg">
      {/* Header */}
      <div className="bg-white dark:bg-dark-card border-b border-warm-100 dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-clay rounded-xl flex items-center justify-center shadow-lg shadow-clay/20">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-darkwood dark:text-white font-display">
                {t('cart.title')}
              </h1>
              <p className="text-darkwood/50 dark:text-white text-sm">
                {cart.length} {cart.length === 1 ? t('cart.item') : t('cart.items')} {t('cart.inYourCart')}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {cart.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-28 h-28 bg-clay/10 dark:bg-clay/5 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="h-14 w-14 text-clay" />
            </div>
            <h2 className="text-2xl font-bold text-darkwood dark:text-white mb-3">
              {t('cart.empty')}
            </h2>
            <p className="text-darkwood/50 dark:text-white mb-8 max-w-md mx-auto">
              {t('cart.empty.desc')}
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-clay text-white font-semibold px-8 py-4 rounded-xl hover:bg-clay-dark hover:shadow-xl hover:shadow-clay/25 transition-all hover:-translate-y-0.5"
            >
              <ShoppingBag className="h-5 w-5" />
              {t('cart.continueShopping')}
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <motion.div
                className="flex items-center justify-between pb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h2 className="text-lg font-bold text-darkwood dark:text-white">{t('cart.cartItems')}</h2>
                <button
                  onClick={clearCart}
                  className="text-sm text-warm-400 hover:text-red-500 dark:hover:text-red-400 font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {t('cart.clearAll')}
                </button>
              </motion.div>

              <AnimatePresence>
                {cart.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: index * 0.05 } }}
                    exit={{ opacity: 0, x: -200, transition: { duration: 0.3 } }}
                    className="bg-white dark:bg-dark-card rounded-2xl border border-warm-100 dark:border-dark-border p-5 flex items-center gap-5 group hover:shadow-lg hover:shadow-clay/5 hover:border-clay/30 dark:hover:border-clay/20 transition-all duration-300"
                  >
                    <div className="w-24 h-24 bg-gradient-to-br from-warm-100 to-warm-50 dark:from-dark-surface dark:to-dark-card rounded-xl flex-shrink-0 overflow-hidden">
                      {item.image && (item.image.startsWith('/') || item.image.startsWith('http')) ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <Mini3DPreview
                          productId={item.id}
                          color={item.selectedColor || item.colors?.[0] || '#8B6F47'}
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link to={`/shop/${item.id}`} className="block">
                        <h3 className="font-bold text-darkwood dark:text-white truncate group-hover:text-clay transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-darkwood/50 dark:text-white mt-0.5 capitalize">{item.category}</p>

                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center bg-warm-100 dark:bg-dark-surface rounded-xl overflow-hidden">
                          <button
                            onClick={() => handleQuantityChange(item, (item.quantity || 1) - 1)}
                            className="p-2 hover:bg-warm-200 dark:hover:bg-dark-border transition-colors"
                          >
                            <Minus className="h-3.5 w-3.5 text-darkwood/60 dark:text-white" />
                          </button>
                          <span className="px-4 py-1.5 text-sm font-bold text-darkwood dark:text-white min-w-[40px] text-center">
                            {item.quantity || 1}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item, (item.quantity || 1) + 1)}
                            className="p-2 hover:bg-warm-200 dark:hover:bg-dark-border transition-colors"
                          >
                            <Plus className="h-3.5 w-3.5 text-darkwood/60 dark:text-white" />
                          </button>
                        </div>
                        <span className="text-xs text-warm-400">x {formatPrice(item.price)}</span>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end gap-2">
                      <span className="text-lg font-bold text-clay">
                        {formatPrice(item.price * (item.quantity || 1))}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => { addToWishlist(item); removeFromCart(item.id) }}
                          className="p-2 text-warm-400 dark:text-white hover:text-clay dark:hover:text-clay rounded-lg transition-all"
                          title={t('cart.saveForLater')}
                        >
                          <Heart className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-warm-300 dark:text-dark-border hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 text-clay font-medium hover:text-clay-dark text-sm mt-2 group"
                >
                  <ArrowRight className="h-4 w-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                  {t('cart.continueShopping')}
                </Link>
              </motion.div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                className="bg-white dark:bg-dark-card rounded-2xl border border-warm-100 dark:border-dark-border p-6 sticky top-24 space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-lg font-bold text-darkwood dark:text-white flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-clay" />
                  {t('cart.orderSummary')}
                </h3>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warm-400" />
                    <input
                      type="text"
                      placeholder={t('cart.promoCode')}
                      className="w-full pl-10 pr-4 py-2.5 bg-warm-50 dark:bg-dark-bg border border-warm-200 dark:border-dark-border rounded-xl text-sm text-darkwood dark:text-white placeholder-warm-400 focus:outline-none focus:ring-2 focus:ring-clay/40 focus:border-clay transition-all"
                    />
                  </div>
                  <button className="px-4 py-2.5 bg-warm-100 dark:bg-dark-surface text-darkwood/70 dark:text-white rounded-xl text-sm font-semibold hover:bg-warm-200 dark:hover:bg-dark-border transition-colors">
                    {t('cart.apply')}
                  </button>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-darkwood/50 dark:text-white">{t('cart.subtotal')} ({cart.length} {t('cart.items')})</span>
                    <span className="font-semibold text-darkwood dark:text-white">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-darkwood/50 dark:text-white">{t('cart.shipping')}</span>
                    <span className={`font-semibold ${shipping === 0 ? 'text-forest dark:text-forest-light' : 'text-darkwood dark:text-white'}`}>
                      {shipping === 0 ? t('cart.free') : formatPrice(shipping)}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <div className="flex items-center gap-2 bg-clay/10 rounded-xl px-3 py-2">
                      <Truck className="h-4 w-4 text-clay" />
                      <p className="text-xs text-clay dark:text-clay">
                        {t('cart.freeShippingMsg', { amount: formatPrice(Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)) })}
                      </p>
                    </div>
                  )}
                  <div className="border-t border-warm-100 dark:border-dark-border pt-3 mt-3">
                    <div className="flex justify-between">
                      <span className="text-base font-bold text-darkwood dark:text-white">{t('cart.total')}</span>
                      <span className="text-xl font-bold text-clay">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="block w-full bg-clay text-white text-center font-bold py-4 rounded-xl hover:bg-clay-dark hover:shadow-xl hover:shadow-clay/25 transition-all hover:-translate-y-0.5 group"
                >
                  <span className="flex items-center justify-center gap-2">
                    {t('cart.proceedToCheckout')}
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>

                <div className="space-y-3 pt-2">
                  {[
                    { icon: Shield, text: t('cart.secureCheckout'), color: 'text-forest' },
                    { icon: Truck, text: `${t('shop.freeDelivery')} ${t('shop.ordersOver')} ${formatPrice(FREE_SHIPPING_THRESHOLD)}`, color: 'text-clay' },
                    { icon: RotateCcw, text: t('cart.easyReturns'), color: 'text-darkwood dark:text-white' },
                    { icon: Gift, text: t('cart.giftWrapping'), color: 'text-amber-600 dark:text-amber-400' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <item.icon className={`h-4 w-4 ${item.color} flex-shrink-0`} />
                      <span className="text-darkwood/60 dark:text-white">{item.text}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-warm-100 dark:border-dark-border">
                  <p className="text-xs text-warm-400 dark:text-white mb-2 text-center">{t('cart.weAccept')}</p>
                  <div className="flex items-center justify-center gap-3">
                    {['Visa', 'MC', 'PayPal', 'Apple'].map((method) => (
                      <div key={method} className="bg-warm-50 dark:bg-dark-surface rounded-lg px-3 py-1.5 text-xs font-bold text-darkwood/50 dark:text-white">
                        {method}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}