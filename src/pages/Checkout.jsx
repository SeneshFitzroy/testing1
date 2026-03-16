import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CreditCard, Truck, Shield, MapPin, Phone, Mail, User, ChevronRight, ChevronLeft,
  Check, Loader2, Package, ArrowRight, Lock, Gift, ShoppingBag,
} from 'lucide-react'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import useCartStore from '@/store/useCartStore'
import useAuthStore from '@/store/useAuthStore'
import useThemeStore from '@/store/useThemeStore'
import Mini3DPreview from '@/components/Mini3DPreview'

const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } }

export default function Checkout() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { items: cart, clearCart } = useCartStore()
  const { user, userProfile } = useAuthStore()
  const { formatPrice, currency } = useThemeStore()

  const [step, setStep] = useState(1)
  const [processing, setProcessing] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState(null)

  const [shipping, setShipping] = useState({
    fullName: userProfile?.displayName || '', email: user?.email || '',
    phone: '', address: '', city: '', state: '', zip: '', country: 'United Kingdom',
  })
  const [payment, setPayment] = useState({
    cardNumber: '', cardName: '', expiry: '', cvv: '', method: 'card',
  })
  const [errors, setErrors] = useState({})

  const subtotal = cart.reduce((s, i) => s + i.price * (i.quantity || 1), 0)
  const shippingCost = subtotal > 50 ? 0 : 9.99
  const tax = subtotal * 0.1
  const total = subtotal + shippingCost + tax

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-warm-50 dark:bg-dark-bg flex items-center justify-center px-4">
        <motion.div className="text-center max-w-md" {...fadeInUp}>
          <div className="w-24 h-24 bg-clay/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-12 w-12 text-clay" />
          </div>
          <h2 className="text-2xl font-bold text-darkwood dark:text-warm-100 mb-3 font-display">{t('cart.empty')}</h2>
          <p className="text-darkwood/50 dark:text-white mb-6">{t('cart.empty.desc')}</p>
          <Link to="/shop" className="inline-flex items-center gap-2 bg-clay text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-clay-dark transition-all">
            <ShoppingBag className="h-5 w-5" /> {t('cart.continueShopping')}
          </Link>
        </motion.div>
      </div>
    )
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-warm-50 dark:bg-dark-bg flex items-center justify-center px-4">
        <motion.div className="text-center max-w-lg bg-white dark:bg-dark-card rounded-3xl border border-warm-100 dark:border-dark-border p-8 sm:p-10 shadow-xl"
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
          <motion.div className="w-20 h-20 bg-forest rounded-full flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}>
            <Check className="h-10 w-10 text-white" />
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold text-darkwood dark:text-warm-100 mb-3 font-display">{t('checkout.orderPlaced')}</h2>
          <p className="text-darkwood/60 dark:text-white mb-2">{t('checkout.thankYou')}</p>
          {orderId && <p className="text-sm text-clay font-semibold mb-6">{t('checkout.orderId')}: #{orderId.slice(0, 8).toUpperCase()}</p>}
          <p className="text-sm text-darkwood/50 dark:text-white mb-8">{t('checkout.confirmationEmail')}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/shop" className="inline-flex items-center justify-center gap-2 bg-clay text-white font-semibold px-6 py-3 rounded-xl hover:bg-clay-dark transition-all">
              {t('cart.continueShopping')} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/shop" className="inline-flex items-center justify-center gap-2 border-2 border-warm-200 dark:border-dark-border text-darkwood dark:text-warm-200 font-semibold px-6 py-3 rounded-xl hover:bg-warm-100 dark:hover:bg-dark-surface transition-all">
              {t('checkout.backToShop')}
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  const validateShipping = () => {
    const e = {}
    if (!shipping.fullName.trim()) e.fullName = t('checkout.required')
    if (!shipping.email.trim()) e.email = t('checkout.required')
    else if (!/\S+@\S+\.\S+/.test(shipping.email)) e.email = t('auth.validation.emailInvalid')
    if (!shipping.phone.trim()) e.phone = t('checkout.required')
    if (!shipping.address.trim()) e.address = t('checkout.required')
    if (!shipping.city.trim()) e.city = t('checkout.required')
    if (!shipping.zip.trim()) e.zip = t('checkout.required')
    setErrors(e); return Object.keys(e).length === 0
  }
  const validatePayment = () => {
    const e = {}
    if (payment.method === 'card') {
      if (!payment.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) e.cardNumber = t('checkout.invalidCard')
      if (!payment.cardName.trim()) e.cardName = t('checkout.required')
      if (!payment.expiry.match(/^\d{2}\/\d{2}$/)) e.expiry = t('checkout.invalidExpiry')
      if (!payment.cvv.match(/^\d{3,4}$/)) e.cvv = t('checkout.invalidCvv')
    }
    setErrors(e); return Object.keys(e).length === 0
  }
  const handleNext = () => {
    if (step === 1 && validateShipping()) setStep(2)
    else if (step === 2 && validatePayment()) setStep(3)
  }

  const handlePlaceOrder = async () => {
    setProcessing(true)
    try {
      const orderData = {
        userId: user?.uid, userEmail: shipping.email, shipping: { ...shipping },
        paymentMethod: payment.method,
        items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity || 1, selectedColor: i.selectedColor, category: i.category })),
        subtotal, shippingCost, tax, total, currency, status: 'confirmed', createdAt: serverTimestamp(),
      }
      const docRef = await addDoc(collection(db, 'orders'), orderData)
      setOrderId(docRef.id); clearCart(); setOrderPlaced(true)
      toast.success(t('checkout.orderPlaced'))
    } catch (err) {
      console.error('Order failed:', err); toast.error(t('checkout.orderFailed'))
    } finally { setProcessing(false) }
  }

  const fmtCard = (v) => { const c = v.replace(/\D/g, '').slice(0, 16); return c.replace(/(\d{4})(?=\d)/g, '$1 ') }
  const fmtExp = (v) => { const c = v.replace(/\D/g, '').slice(0, 4); return c.length >= 3 ? c.slice(0, 2) + '/' + c.slice(2) : c }

  const stepsArr = [
    { id: 1, label: t('checkout.shipping'), icon: Truck },
    { id: 2, label: t('checkout.payment'), icon: CreditCard },
    { id: 3, label: t('checkout.review'), icon: Package },
  ]

  const COUNTRIES = ['United Kingdom', 'United States', 'Ireland', 'Germany', 'France', 'Spain', 'Italy', 'Netherlands', 'Belgium', 'Canada', 'Australia', 'Japan', 'India', 'Sri Lanka', 'Singapore', 'United Arab Emirates', 'Other']

  const CountrySelect = ({ label, value, onChange }) => (
    <div>
      <label className="block text-sm font-semibold text-darkwood dark:text-warm-200 mb-1.5">{label}</label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warm-400 pointer-events-none" />
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border bg-white dark:bg-dark-surface text-darkwood dark:text-warm-100 focus:outline-none focus:ring-2 focus:ring-clay/40 focus:border-clay transition-all text-sm border-warm-200 dark:border-dark-border appearance-none cursor-pointer"
        >
          {COUNTRIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warm-400 pointer-events-none rotate-90" />
      </div>
    </div>
  )

  const Inp = ({ label, name, value, onChange, type = 'text', placeholder, error, icon: Ic, disabled }) => (
    <div>
      <label className="block text-sm font-semibold text-darkwood dark:text-warm-200 mb-1.5">{label}</label>
      <div className="relative">
        {Ic && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Ic className="h-4 w-4 text-warm-400" /></div>}
        <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled}
          className={`w-full px-4 py-3 ${Ic ? 'pl-10' : ''} rounded-xl border bg-white dark:bg-dark-surface text-darkwood dark:text-warm-100 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-clay/40 focus:border-clay transition-all text-sm ${error ? 'border-red-300 dark:border-red-500' : 'border-warm-200 dark:border-dark-border'}`} />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )

  return (
    <div className="min-h-screen bg-warm-50 dark:bg-dark-bg">
      {/* Header + Stepper */}
      <div className="bg-white dark:bg-dark-card border-b border-warm-100 dark:border-dark-border">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-clay rounded-xl flex items-center justify-center shadow-lg shadow-clay/20">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-darkwood dark:text-warm-100 font-display">{t('checkout.title')}</h1>
              <p className="text-darkwood/50 dark:text-white text-sm">{t('checkout.secureCheckout')}</p>
            </div>
          </div>
          <div className="flex items-center justify-between max-w-md mx-auto">
            {stepsArr.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step > s.id ? 'bg-forest text-white' : step === s.id ? 'bg-clay text-white shadow-lg shadow-clay/25' : 'bg-warm-100 dark:bg-dark-surface text-warm-400'}`}>
                    {step > s.id ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
                  </div>
                  <span className={`text-[10px] sm:text-xs mt-1.5 font-medium ${step >= s.id ? 'text-darkwood dark:text-warm-100' : 'text-warm-400'}`}>{s.label}</span>
                </div>
                {i < stepsArr.length - 1 && <div className={`w-10 sm:w-24 h-0.5 mx-1 sm:mx-2 rounded-full transition-all ${step > s.id ? 'bg-forest' : 'bg-warm-200 dark:bg-dark-border'}`} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="ship" className="bg-white dark:bg-dark-card rounded-2xl border border-warm-100 dark:border-dark-border p-5 sm:p-8"
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <h2 className="text-lg sm:text-xl font-bold text-darkwood dark:text-warm-100 mb-6 flex items-center gap-2">
                    <Truck className="h-5 w-5 text-clay" /> {t('checkout.shippingInfo')}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Inp label={t('checkout.fullName')} name="fullName" value={shipping.fullName} onChange={e => setShipping({...shipping, fullName: e.target.value})} placeholder="John Doe" error={errors.fullName} icon={User} />
                    <Inp label={t('auth.email')} name="email" type="email" value={shipping.email} onChange={e => setShipping({...shipping, email: e.target.value})} placeholder="john@example.com" error={errors.email} icon={Mail} />
                    <Inp label={t('checkout.phone')} name="phone" type="tel" value={shipping.phone} onChange={e => setShipping({...shipping, phone: e.target.value})} placeholder="+44 7123 456789" error={errors.phone} icon={Phone} />
                    <CountrySelect label={t('checkout.country')} value={shipping.country} onChange={v => setShipping({...shipping, country: v})} />
                    <div className="sm:col-span-2">
                      <Inp label={t('checkout.address')} name="address" value={shipping.address} onChange={e => setShipping({...shipping, address: e.target.value})} placeholder="123 Baker Street" error={errors.address} icon={MapPin} />
                    </div>
                    <Inp label={t('checkout.city')} name="city" value={shipping.city} onChange={e => setShipping({...shipping, city: e.target.value})} placeholder="London" error={errors.city} />
                    <div className="grid grid-cols-2 gap-4">
                      <Inp label={t('checkout.state')} name="state" value={shipping.state} onChange={e => setShipping({...shipping, state: e.target.value})} placeholder="England" />
                      <Inp label={t('checkout.zip')} name="zip" value={shipping.zip} onChange={e => setShipping({...shipping, zip: e.target.value})} placeholder="W1B 1JA" error={errors.zip} />
                    </div>
                  </div>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key="pay" className="bg-white dark:bg-dark-card rounded-2xl border border-warm-100 dark:border-dark-border p-5 sm:p-8"
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <h2 className="text-lg sm:text-xl font-bold text-darkwood dark:text-warm-100 mb-6 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-clay" /> {t('checkout.paymentMethod')}
                  </h2>
                  <div className="flex flex-wrap gap-3 mb-6">
                    {[
                      { id: 'card', label: t('checkout.creditCard'), icon: CreditCard },
                      { id: 'paypal', label: 'PayPal', icon: CreditCard },
                      { id: 'applepay', label: 'Apple Pay', icon: CreditCard },
                      { id: 'cod', label: t('checkout.cod'), icon: Package }
                    ].map(m => (
                      <button key={m.id} onClick={() => setPayment({...payment, method: m.id})}
                        className={`flex-1 flex items-center justify-center gap-2 p-3 sm:p-4 rounded-xl border-2 text-sm font-semibold transition-all ${payment.method === m.id ? 'border-clay bg-clay/5 text-clay' : 'border-warm-200 dark:border-dark-border text-darkwood/50 dark:text-white hover:border-warm-300'}`}>
                        <m.icon className="h-5 w-5" /> <span className="hidden sm:inline">{m.label}</span>
                      </button>
                    ))}
                  </div>
                  {(payment.method === 'card' || payment.method === 'paypal' || payment.method === 'applepay') && payment.method !== 'cod' && (
                    <div className="space-y-4">
                      {payment.method === 'card' && (
                        <>
                      <Inp label={t('checkout.cardNumber')} name="cardNumber" value={payment.cardNumber} onChange={e => setPayment({...payment, cardNumber: fmtCard(e.target.value)})} placeholder="1234 5678 9012 3456" error={errors.cardNumber} icon={CreditCard} />
                      <Inp label={t('checkout.cardName')} name="cardName" value={payment.cardName} onChange={e => setPayment({...payment, cardName: e.target.value})} placeholder="John Doe" error={errors.cardName} icon={User} />
                      <div className="grid grid-cols-2 gap-4">
                        <Inp label={t('checkout.expiry')} name="expiry" value={payment.expiry} onChange={e => setPayment({...payment, expiry: fmtExp(e.target.value)})} placeholder="MM/YY" error={errors.expiry} />
                        <Inp label={t('checkout.cvv')} name="cvv" value={payment.cvv} onChange={e => setPayment({...payment, cvv: e.target.value.replace(/\D/g,'').slice(0,4)})} placeholder="123" error={errors.cvv} icon={Lock} />
                      </div>
                      <div className="flex items-center gap-2 bg-forest/10 rounded-xl p-3 mt-2">
                        <Shield className="h-4 w-4 text-forest flex-shrink-0" />
                        <p className="text-xs text-forest dark:text-forest-light">{t('checkout.secureNote')}</p>
                      </div>
                        </>
                      )}
                      {(payment.method === 'paypal' || payment.method === 'applepay') && (
                        <div className="bg-warm-50 dark:bg-dark-surface rounded-xl p-6 text-center">
                          <CreditCard className="h-10 w-10 text-clay mx-auto mb-3" />
                          <p className="text-sm text-darkwood/70 dark:text-gray-100">
                            {payment.method === 'applepay' ? 'You will be redirected to Apple Pay at checkout.' : 'You will be redirected to PayPal to complete payment.'}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  {payment.method === 'cod' && (
                    <div className="bg-warm-50 dark:bg-dark-surface rounded-xl p-6 text-center">
                      <Package className="h-10 w-10 text-clay mx-auto mb-3" />
                      <p className="text-sm text-darkwood/70 dark:text-gray-100">{t('checkout.codNote')}</p>
                    </div>
                  )}
                </motion.div>
              )}
              {step === 3 && (
                <motion.div key="review" className="bg-white dark:bg-dark-card rounded-2xl border border-warm-100 dark:border-dark-border p-5 sm:p-8 space-y-6"
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <h2 className="text-lg sm:text-xl font-bold text-darkwood dark:text-warm-100 flex items-center gap-2">
                    <Package className="h-5 w-5 text-clay" /> {t('checkout.reviewOrder')}
                  </h2>
                  <div className="bg-warm-50 dark:bg-dark-surface rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-darkwood dark:text-warm-100 flex items-center gap-2"><Truck className="h-4 w-4 text-clay" />{t('checkout.shippingTo')}</h3>
                      <button onClick={() => setStep(1)} className="text-xs text-clay hover:text-clay-dark font-medium">{t('checkout.edit')}</button>
                    </div>
                    <p className="text-sm text-darkwood/70 dark:text-gray-100">{shipping.fullName}<br />{shipping.address}<br />{shipping.city}, {shipping.state} {shipping.zip}<br />{shipping.country}</p>
                  </div>
                  <div className="bg-warm-50 dark:bg-dark-surface rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-darkwood dark:text-warm-100 flex items-center gap-2"><CreditCard className="h-4 w-4 text-clay" />{t('checkout.paymentMethod')}</h3>
                      <button onClick={() => setStep(2)} className="text-xs text-clay hover:text-clay-dark font-medium">{t('checkout.edit')}</button>
                    </div>
                    <p className="text-sm text-darkwood/70 dark:text-gray-100">
                      {payment.method === 'card' ? `${t('checkout.creditCard')} •••• ${payment.cardNumber.slice(-4)}` : payment.method === 'paypal' ? 'PayPal' : payment.method === 'applepay' ? 'Apple Pay' : t('checkout.cod')}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-darkwood dark:text-warm-100 mb-3">{t('checkout.items')} ({cart.length})</h3>
                    <div className="space-y-3">
                      {cart.map(item => (
                        <div key={item.id} className="flex items-center gap-3 sm:gap-4 bg-warm-50 dark:bg-dark-surface rounded-xl p-3">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-warm-100 dark:bg-dark-card flex-shrink-0">
                            <Mini3DPreview productId={item.id} color={item.selectedColor || '#8B6F47'} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-darkwood dark:text-warm-100 truncate">{item.name}</p>
                            <p className="text-xs text-darkwood/50 dark:text-white">{t('checkout.qty')}: {item.quantity || 1}</p>
                          </div>
                          <span className="text-sm font-bold text-clay">{formatPrice(item.price * (item.quantity || 1))}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between mt-6">
              {step > 1 ? (
                <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 px-5 sm:px-6 py-3 border-2 border-warm-200 dark:border-dark-border text-darkwood dark:text-warm-200 font-semibold rounded-xl hover:bg-warm-100 dark:hover:bg-dark-surface transition-all text-sm">
                  <ChevronLeft className="h-4 w-4" /> {t('checkout.back')}
                </button>
              ) : (
                <Link to="/cart" className="flex items-center gap-2 px-5 sm:px-6 py-3 border-2 border-warm-200 dark:border-dark-border text-darkwood dark:text-warm-200 font-semibold rounded-xl hover:bg-warm-100 dark:hover:bg-dark-surface transition-all text-sm">
                  <ChevronLeft className="h-4 w-4" /> {t('checkout.backToCart')}
                </Link>
              )}
              {step < 3 ? (
                <button onClick={handleNext} className="flex items-center gap-2 bg-clay text-white font-semibold px-6 sm:px-8 py-3 rounded-xl hover:bg-clay-dark hover:shadow-lg hover:shadow-clay/25 transition-all text-sm">
                  {t('checkout.continue')} <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button onClick={handlePlaceOrder} disabled={processing} className="flex items-center gap-2 bg-forest text-white font-bold px-6 sm:px-8 py-3.5 rounded-xl hover:bg-forest-light hover:shadow-lg hover:shadow-forest/25 transition-all disabled:opacity-50 text-sm">
                  {processing ? <><Loader2 className="h-5 w-5 animate-spin" /> {t('checkout.processing')}</> : <><Lock className="h-4 w-4" /> {t('checkout.placeOrder')}</>}
                </button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div className="bg-white dark:bg-dark-card rounded-2xl border border-warm-100 dark:border-dark-border p-5 sm:p-6 sticky top-24 space-y-5" {...fadeInUp}>
              <h3 className="text-lg font-bold text-darkwood dark:text-warm-100 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-clay" /> {t('cart.orderSummary')}
              </h3>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-warm-100 dark:bg-dark-surface rounded-lg overflow-hidden flex-shrink-0">
                      <Mini3DPreview productId={item.id} color={item.selectedColor || '#8B6F47'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-darkwood dark:text-warm-100 truncate">{item.name}</p>
                      <p className="text-[10px] text-warm-400">x{item.quantity || 1}</p>
                    </div>
                    <span className="text-xs font-bold text-darkwood dark:text-warm-100">{formatPrice(item.price * (item.quantity || 1))}</span>
                  </div>
                ))}
              </div>
              <hr className="border-warm-100 dark:border-dark-border" />
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between"><span className="text-darkwood/50 dark:text-white">{t('cart.subtotal')}</span><span className="font-semibold text-darkwood dark:text-warm-100">{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-darkwood/50 dark:text-white">{t('cart.shipping')}</span><span className={`font-semibold ${shippingCost === 0 ? 'text-forest' : 'text-darkwood dark:text-warm-100'}`}>{shippingCost === 0 ? t('cart.free') : formatPrice(shippingCost)}</span></div>
                <div className="flex justify-between"><span className="text-darkwood/50 dark:text-white">{t('checkout.tax')}</span><span className="font-semibold text-darkwood dark:text-warm-100">{formatPrice(tax)}</span></div>
                <hr className="border-warm-100 dark:border-dark-border" />
                <div className="flex justify-between"><span className="text-base font-bold text-darkwood dark:text-warm-100">{t('cart.total')}</span><span className="text-xl font-bold text-clay">{formatPrice(total)}</span></div>
              </div>
              <div className="space-y-2.5 pt-2">
                {[{ icon: Lock, text: t('checkout.ssl'), color: 'text-forest' }, { icon: Shield, text: t('cart.secureCheckout'), color: 'text-clay' }, { icon: Gift, text: t('cart.giftWrapping'), color: 'text-amber-600 dark:text-amber-400' }].map((b, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs"><b.icon className={`h-3.5 w-3.5 ${b.color} flex-shrink-0`} /><span className="text-darkwood/60 dark:text-white">{b.text}</span></div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}