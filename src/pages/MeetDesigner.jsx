import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, Clock, Video, Award, Star, CheckCircle, ArrowRight,
  Users, Palette, Eye, Zap, X, ChevronLeft, ChevronRight, ExternalLink
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import useThemeStore from '@/store/useThemeStore'

/* ── Calendar helper ── */
function getMonthDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) days.push(d)
  return days
}

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]

const TIME_SLOTS = [
  '09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM',
  '01:00 PM','01:30 PM','02:00 PM','02:30 PM','03:00 PM','03:30 PM',
  '04:00 PM','04:30 PM','05:00 PM'
]

export default function MeetDesigner() {
  const { t } = useTranslation()
  const { formatPrice } = useThemeStore()

  const [selectedDesigner, setSelectedDesigner] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [bookingStep, setBookingStep] = useState(0) // 0=browse, 1=date, 2=time, 3=confirm, 4=done
  const [calMonth, setCalMonth] = useState(new Date().getMonth())
  const [calYear, setCalYear] = useState(new Date().getFullYear())
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientNote, setClientNote] = useState('')

  const today = new Date()
  const calDays = useMemo(() => getMonthDays(calYear, calMonth), [calYear, calMonth])

  const designers = [
    {
      id: 1, name: 'Sarah Henderson', title: 'Senior Interior Designer',
      specialty: 'Modern & Minimalist Design', experience: '8+ years', projects: 450, rating: 4.9,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=400&fit=crop',
      bio: 'Specializes in creating serene, functional spaces with clean lines and natural materials.',
      badges: ['Top Rated', 'Quick Response', '3D Expert']
    },
    {
      id: 2, name: 'Michael Chen', title: 'Lead Design Consultant',
      specialty: 'Luxury & Contemporary', experience: '12+ years', projects: 680, rating: 4.8,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      bio: 'Award-winning designer known for high-end residential and commercial spaces.',
      badges: ['Award Winner', 'Luxury Expert', 'Commercial']
    },
    {
      id: 3, name: 'Emma Rodriguez', title: 'Creative Design Director',
      specialty: 'Eclectic & Artistic', experience: '10+ years', projects: 520, rating: 4.9,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      bio: 'Creative visionary who blends colors, patterns, and textures to create unique spaces.',
      badges: ['Creative Director', 'Color Expert', 'Artistic Vision']
    }
  ]

  const consultationTypes = [
    {
      id: 'quick', title: 'Quick Design Chat', duration: '30 minutes', priceUSD: 0, label: 'Free',
      description: 'Perfect for initial ideas and general guidance',
      features: ['Basic design advice', 'Style consultation', 'Product recommendations', 'Q&A session'],
      icon: Clock, gradient: 'from-forest to-forest-light'
    },
    {
      id: 'comprehensive', title: 'Comprehensive Session', duration: '60 minutes', priceUSD: 49, originalUSD: 99,
      description: 'Deep dive into your space with detailed planning',
      features: ['Room analysis', '3D visualization', 'Detailed plan', 'Product sourcing', 'Timeline planning'],
      icon: Eye, gradient: 'from-clay to-clay-dark', popular: true
    },
    {
      id: 'premium', title: 'Premium Package', duration: '90 minutes', priceUSD: 79, originalUSD: 149,
      description: 'Complete design transformation with ongoing support',
      features: ['Full room design', '3D rendering', 'Shopping list', 'Installation guide', '30-day support'],
      icon: Award, gradient: 'from-darkwood to-clay'
    }
  ]

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1) }
    else setCalMonth(calMonth - 1)
  }
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1) }
    else setCalMonth(calMonth + 1)
  }

  const isDateAvailable = (day) => {
    if (!day) return false
    const d = new Date(calYear, calMonth, day)
    const dayOfWeek = d.getDay()
    if (dayOfWeek === 0 || dayOfWeek === 6) return false
    if (d < new Date(today.getFullYear(), today.getMonth(), today.getDate())) return false
    return true
  }

  const handleBook = (designer) => {
    setSelectedDesigner(designer)
    setBookingStep(1)
    setSelectedDate(null)
    setSelectedTime(null)
  }

  const confirmBooking = () => {
    if (!clientName.trim() || !clientEmail.trim()) {
      toast.error('Please fill in your name and email')
      return
    }
    setBookingStep(4)
    toast.success(t('meetDesigner.bookingConfirmed') || 'Booking Confirmed!')
  }

  const resetBooking = () => {
    setBookingStep(0)
    setSelectedDesigner(null)
    setSelectedDate(null)
    setSelectedTime(null)
    setSelectedPackage(null)
    setClientName('')
    setClientEmail('')
    setClientNote('')
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
  const stagger = { animate: { transition: { staggerChildren: 0.1 } } }

  return (
    <div className="min-h-screen bg-warm-50 dark:bg-dark-bg">

      {/* ── Booking Modal ── */}
      <AnimatePresence>
        {bookingStep > 0 && bookingStep < 4 && selectedDesigner && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => resetBooking()}
          >
            <motion.div
              className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl border border-warm-200 dark:border-dark-border max-w-lg w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-warm-200 dark:border-dark-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={selectedDesigner.image} alt="" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h3 className="font-bold text-darkwood dark:text-warm-100 text-sm">{selectedDesigner.name}</h3>
                    <p className="text-xs text-darkwood/50 dark:text-white">
                      {bookingStep === 1 && (t('meetDesigner.selectDate') || 'Select a Date')}
                      {bookingStep === 2 && (t('meetDesigner.selectTime') || 'Select a Time')}
                      {bookingStep === 3 && 'Confirm Details'}
                    </p>
                  </div>
                </div>
                <button onClick={resetBooking} className="p-2 hover:bg-warm-100 dark:hover:bg-dark-surface rounded-lg">
                  <X className="h-5 w-5 text-darkwood/50 dark:text-white" />
                </button>
              </div>

              {/* Step Progress */}
              <div className="px-6 pt-4 flex gap-2">
                {[1,2,3].map(s => (
                  <div key={s} className={`flex-1 h-1.5 rounded-full transition-colors ${bookingStep >= s ? 'bg-clay' : 'bg-warm-200 dark:bg-dark-border'}`} />
                ))}
              </div>

              <div className="p-6">
                {/* Step 1: Calendar */}
                {bookingStep === 1 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <button onClick={prevMonth} className="p-2 hover:bg-warm-100 dark:hover:bg-dark-surface rounded-lg">
                        <ChevronLeft className="h-5 w-5 text-darkwood dark:text-warm-200" />
                      </button>
                      <span className="font-bold text-darkwood dark:text-warm-100">
                        {MONTH_NAMES[calMonth]} {calYear}
                      </span>
                      <button onClick={nextMonth} className="p-2 hover:bg-warm-100 dark:hover:bg-dark-surface rounded-lg">
                        <ChevronRight className="h-5 w-5 text-darkwood dark:text-warm-200" />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                      {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                        <div key={d} className="text-xs font-semibold text-darkwood/40 dark:text-warm-600 py-1">{d}</div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {calDays.map((day, i) => {
                        if (!day) return <div key={`e-${i}`} />
                        const available = isDateAvailable(day)
                        const isToday = day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear()
                        const isSelected = selectedDate?.day === day && selectedDate?.month === calMonth && selectedDate?.year === calYear

                        return (
                          <button
                            key={day}
                            disabled={!available}
                            onClick={() => { setSelectedDate({ day, month: calMonth, year: calYear }); setBookingStep(2) }}
                            className={`h-10 rounded-lg text-sm font-medium transition-all ${
                              isSelected
                                ? 'bg-clay text-white shadow-md'
                                : isToday
                                  ? 'bg-forest/10 text-forest dark:text-forest-light font-bold'
                                  : available
                                    ? 'text-darkwood dark:text-warm-200 hover:bg-warm-100 dark:hover:bg-dark-surface'
                                    : 'text-warm-300 dark:text-dark-border cursor-not-allowed'
                            }`}
                          >
                            {day}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Step 2: Time + Package */}
                {bookingStep === 2 && (
                  <div>
                    <p className="text-sm text-darkwood/50 dark:text-white mb-4 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {selectedDate && `${MONTH_NAMES[selectedDate.month]} ${selectedDate.day}, ${selectedDate.year}`}
                      <button onClick={() => setBookingStep(1)} className="text-clay text-xs underline ml-auto">Change</button>
                    </p>

                    <h4 className="text-sm font-semibold text-darkwood dark:text-warm-100 mb-3">Choose a Time</h4>
                    <div className="grid grid-cols-3 gap-2 mb-6">
                      {TIME_SLOTS.map(slot => (
                        <button
                          key={slot}
                          onClick={() => setSelectedTime(slot)}
                          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                            selectedTime === slot
                              ? 'bg-clay text-white shadow-sm'
                              : 'bg-warm-100 dark:bg-dark-surface text-darkwood dark:text-warm-200 hover:bg-warm-200 dark:hover:bg-dark-border'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>

                    <h4 className="text-sm font-semibold text-darkwood dark:text-warm-100 mb-3">Select Package</h4>
                    <div className="space-y-2 mb-4">
                      {consultationTypes.map(pkg => (
                        <button
                          key={pkg.id}
                          onClick={() => setSelectedPackage(pkg)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all ${
                            selectedPackage?.id === pkg.id
                              ? 'border-clay bg-clay/5 dark:bg-clay/10'
                              : 'border-warm-200 dark:border-dark-border hover:border-clay/50'
                          }`}
                        >
                          <div>
                            <span className="text-sm font-semibold text-darkwood dark:text-warm-100">{pkg.title}</span>
                            <span className="text-xs text-darkwood/50 dark:text-white ml-2">{pkg.duration}</span>
                          </div>
                          <span className="text-sm font-bold text-clay">
                            {pkg.priceUSD === 0 ? 'Free' : formatPrice(pkg.priceUSD)}
                          </span>
                        </button>
                      ))}
                    </div>

                    <button
                      disabled={!selectedTime || !selectedPackage}
                      onClick={() => setBookingStep(3)}
                      className="w-full py-3 bg-gradient-to-r from-clay to-clay-dark hover:from-clay-dark hover:to-clay text-white font-semibold rounded-xl disabled:opacity-40 transition-all"
                    >
                      Continue
                    </button>
                  </div>
                )}

                {/* Step 3: Contact Info */}
                {bookingStep === 3 && (
                  <div>
                    <div className="bg-warm-50 dark:bg-dark-surface rounded-xl p-4 mb-6 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-darkwood/60 dark:text-white">Designer</span>
                        <span className="font-medium text-darkwood dark:text-warm-100">{selectedDesigner.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-darkwood/60 dark:text-white">Date</span>
                        <span className="font-medium text-darkwood dark:text-warm-100">
                          {selectedDate && `${MONTH_NAMES[selectedDate.month]} ${selectedDate.day}, ${selectedDate.year}`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-darkwood/60 dark:text-white">Time</span>
                        <span className="font-medium text-darkwood dark:text-warm-100">{selectedTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-darkwood/60 dark:text-white">Package</span>
                        <span className="font-medium text-clay">{selectedPackage?.title}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-warm-200 dark:border-dark-border">
                        <span className="text-darkwood/60 dark:text-white font-semibold">Total</span>
                        <span className="font-bold text-clay">
                          {selectedPackage?.priceUSD === 0 ? 'Free' : formatPrice(selectedPackage?.priceUSD || 0)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <input
                        type="text"
                        placeholder="Full Name *"
                        value={clientName}
                        onChange={e => setClientName(e.target.value)}
                        className="w-full px-4 py-3 border border-warm-200 dark:border-dark-border bg-white dark:bg-dark-surface rounded-xl text-sm text-darkwood dark:text-warm-100 placeholder:text-warm-400 focus:ring-2 focus:ring-clay/30 focus:border-clay outline-none"
                      />
                      <input
                        type="email"
                        placeholder="Email Address *"
                        value={clientEmail}
                        onChange={e => setClientEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-warm-200 dark:border-dark-border bg-white dark:bg-dark-surface rounded-xl text-sm text-darkwood dark:text-warm-100 placeholder:text-warm-400 focus:ring-2 focus:ring-clay/30 focus:border-clay outline-none"
                      />
                      <textarea
                        placeholder="Notes about your project"
                        value={clientNote}
                        onChange={e => setClientNote(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-warm-200 dark:border-dark-border bg-white dark:bg-dark-surface rounded-xl text-sm text-darkwood dark:text-warm-100 placeholder:text-warm-400 focus:ring-2 focus:ring-clay/30 focus:border-clay outline-none resize-none"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setBookingStep(2)}
                        className="flex-1 py-3 border border-warm-200 dark:border-dark-border text-darkwood dark:text-warm-200 font-medium rounded-xl hover:bg-warm-100 dark:hover:bg-dark-surface transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={confirmBooking}
                        className="flex-1 py-3 bg-gradient-to-r from-clay to-clay-dark hover:from-clay-dark hover:to-clay text-white font-semibold rounded-xl transition-all shadow-md"
                      >
                        {t('meetDesigner.confirmBooking') || 'Confirm Booking'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Booking Confirmed Modal ── */}
      <AnimatePresence>
        {bookingStep === 4 && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl border border-warm-200 dark:border-dark-border max-w-md w-full p-8 text-center"
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            >
              <div className="w-20 h-20 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-forest" />
              </div>
              <h2 className="text-2xl font-bold text-darkwood dark:text-warm-100 mb-2">
                {t('meetDesigner.bookingConfirmed') || 'Booking Confirmed!'}
              </h2>
              <p className="text-darkwood/60 dark:text-white text-sm mb-6">
                {t('meetDesigner.bookingMsg') || 'Your consultation has been scheduled. You will receive a confirmation email shortly.'}
              </p>
              <div className="bg-warm-50 dark:bg-dark-surface rounded-xl p-4 mb-6 text-sm text-left space-y-1">
                <div className="flex justify-between"><span className="text-darkwood/50 dark:text-white">Designer</span><span className="text-darkwood dark:text-warm-100 font-medium">{selectedDesigner?.name}</span></div>
                <div className="flex justify-between"><span className="text-darkwood/50 dark:text-white">Date</span><span className="text-darkwood dark:text-warm-100 font-medium">{selectedDate && `${MONTH_NAMES[selectedDate.month]} ${selectedDate.day}, ${selectedDate.year}`}</span></div>
                <div className="flex justify-between"><span className="text-darkwood/50 dark:text-white">Time</span><span className="text-darkwood dark:text-warm-100 font-medium">{selectedTime}</span></div>
                <div className="flex justify-between"><span className="text-darkwood/50 dark:text-white">Package</span><span className="text-clay font-medium">{selectedPackage?.title}</span></div>
              </div>
              <div className="flex gap-3">
                <button onClick={resetBooking} className="flex-1 py-3 border border-warm-200 dark:border-dark-border text-darkwood dark:text-warm-200 font-medium rounded-xl hover:bg-warm-100 dark:hover:bg-dark-surface transition-colors">
                  Book Another
                </button>
                <Link to="/shop" className="flex-1 py-3 bg-gradient-to-r from-clay to-clay-dark text-white font-semibold rounded-xl text-center transition-all hover:shadow-md">
                  Browse Shop
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero Section ── */}
      <section className="py-20 bg-gradient-to-br from-darkwood via-clay-dark to-clay text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center max-w-4xl mx-auto" initial="initial" animate="animate" variants={stagger}>
            <motion.div variants={fadeInUp} className="inline-flex items-center px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
              <Calendar className="h-5 w-5 text-white mr-2" />
              <span className="text-white/90 font-semibold text-sm">{t('meetDesigner.title') || 'Book Your Design Consultation'}</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-[1.1] font-display">
              Meet World-Class{' '}
              <span className="bg-gradient-to-r from-warm-200 to-warm-100 bg-clip-text text-transparent">Interior Designers</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg text-white/80 mb-10 leading-relaxed max-w-3xl mx-auto">
              {t('meetDesigner.subtitle') || 'Connect with certified professionals who transform your vision into reality. Get personalized design advice, 3D visualizations, and expert guidance.'}
            </motion.p>

            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {[
                { icon: Users, label: '500+ Designers', value: 'Expert Team' },
                { icon: Award, label: '10K+ Projects', value: 'Completed' },
                { icon: Star, label: '4.9/5 Rating', value: 'Customer Love' }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="text-xl font-bold mb-0.5">{stat.label}</div>
                  <div className="text-white/70 text-sm">{stat.value}</div>
                </div>
              ))}
            </motion.div>

            <motion.a variants={fadeInUp} href="#designers"
              className="inline-flex items-center px-8 py-4 bg-white hover:bg-warm-50 text-darkwood font-bold rounded-full transition-all duration-300 group shadow-2xl hover:scale-105"
            >
              <span>Browse Designers</span>
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ── Consultation Types ── */}
      <section className="py-20 bg-white dark:bg-dark-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-14" initial="initial" whileInView="animate" viewport={{ once: true }} variants={fadeInUp}>
            <h2 className="text-3xl sm:text-4xl font-black text-darkwood dark:text-warm-100 mb-4 font-display">Choose Your Consultation</h2>
            <p className="text-lg text-darkwood/60 dark:text-white max-w-2xl mx-auto">
              From quick advice to comprehensive design packages
            </p>
          </motion.div>

          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" initial="initial" whileInView="animate" viewport={{ once: true }} variants={stagger}>
            {consultationTypes.map((c, i) => (
              <motion.div key={i} variants={fadeInUp} whileHover={{ y: -5 }}
                className={`bg-warm-50 dark:bg-dark-bg rounded-2xl p-7 border transition-all relative ${
                  c.popular
                    ? 'border-clay shadow-xl shadow-clay/10 ring-2 ring-clay/20'
                    : 'border-warm-200 dark:border-dark-border shadow-lg'
                }`}
              >
                {c.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-clay to-clay-dark text-white text-xs font-bold px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${c.gradient} flex items-center justify-center mb-5`}>
                  <c.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-darkwood dark:text-warm-100 mb-2">{c.title}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl font-black text-darkwood dark:text-warm-100">
                    {c.priceUSD === 0 ? 'Free' : formatPrice(c.priceUSD)}
                  </span>
                  {c.originalUSD && (
                    <span className="text-sm text-warm-400 line-through">{formatPrice(c.originalUSD)}</span>
                  )}
                </div>
                <div className="flex items-center text-darkwood/50 dark:text-white text-sm mb-4">
                  <Clock className="h-4 w-4 mr-1.5" />{c.duration}
                </div>
                <p className="text-sm text-darkwood/60 dark:text-white mb-5">{c.description}</p>
                <ul className="space-y-2 mb-6">
                  {c.features.map((f, fi) => (
                    <li key={fi} className="flex items-center text-sm text-darkwood/70 dark:text-white">
                      <CheckCircle className="h-4 w-4 text-forest mr-2 flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <a href="#designers"
                  className={`w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r ${c.gradient} text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:scale-[1.02]`}
                >
                  Select Package
                </a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Designers ── */}
      <section id="designers" className="py-20 bg-warm-50 dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-14" initial="initial" whileInView="animate" viewport={{ once: true }} variants={fadeInUp}>
            <h2 className="text-3xl sm:text-4xl font-black text-darkwood dark:text-warm-100 mb-4 font-display">Meet Our Expert Designers</h2>
            <p className="text-lg text-darkwood/60 dark:text-white max-w-2xl mx-auto">
              Certified professionals with years of experience
            </p>
          </motion.div>

          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" initial="initial" whileInView="animate" viewport={{ once: true }} variants={stagger}>
            {designers.map((designer) => (
              <motion.div key={designer.id} variants={fadeInUp} whileHover={{ y: -5 }}
                className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-xl border border-warm-200/50 dark:border-dark-border group"
              >
                <div className="relative">
                  <img src={designer.image} alt={designer.name} className="w-full h-56 object-cover" />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {designer.badges.map((badge, bi) => (
                      <span key={bi} className="px-2.5 py-1 bg-gradient-to-r from-clay to-clay-dark text-white text-[10px] font-bold rounded-full">{badge}</span>
                    ))}
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 dark:bg-dark-card/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-bold text-darkwood dark:text-warm-100">{designer.rating}</span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-darkwood dark:text-warm-100 mb-1">{designer.name}</h3>
                  <p className="text-clay font-semibold text-sm mb-1">{designer.title}</p>
                  <p className="text-darkwood/50 dark:text-white text-xs mb-4">{designer.specialty}</p>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center bg-warm-50 dark:bg-dark-surface rounded-xl py-2">
                      <div className="text-lg font-bold text-darkwood dark:text-warm-100">{designer.experience}</div>
                      <div className="text-[10px] text-darkwood/40 dark:text-warm-600">Experience</div>
                    </div>
                    <div className="text-center bg-warm-50 dark:bg-dark-surface rounded-xl py-2">
                      <div className="text-lg font-bold text-darkwood dark:text-warm-100">{designer.projects}</div>
                      <div className="text-[10px] text-darkwood/40 dark:text-warm-600">Projects</div>
                    </div>
                  </div>

                  <p className="text-sm text-darkwood/60 dark:text-white mb-5 leading-relaxed">{designer.bio}</p>

                  <button
                    onClick={() => handleBook(designer)}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-clay to-clay-dark hover:from-clay-dark hover:to-clay text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg group"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>{t('meetDesigner.bookNow') || 'Book Now'}</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Cal.com Quick Booking ── */}
      <section className="py-16 bg-warm-50 dark:bg-dark-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-10" initial="initial" whileInView="animate" viewport={{ once: true }} variants={fadeInUp}>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-forest/10 dark:bg-forest/20 mb-4">
              <ExternalLink className="h-4 w-4 text-forest mr-2" />
              <span className="text-sm font-semibold text-forest dark:text-forest-light">Quick Online Booking</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-darkwood dark:text-warm-100 mb-4 font-display">
              Schedule via Cal.com
            </h2>
            <p className="text-lg text-darkwood/60 dark:text-white max-w-2xl mx-auto">
              Prefer a direct scheduling link? Use our Cal.com integration for instant booking with real-time availability.
            </p>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-dark-card rounded-2xl shadow-xl border border-warm-200 dark:border-dark-border overflow-hidden"
            initial="initial" whileInView="animate" viewport={{ once: true }} variants={fadeInUp}
          >
            {/* Cal.com embed — responsive iframe */}
            <div className="w-full" style={{ minHeight: '500px' }}>
              <iframe
                src="https://cal.com/leeroo/consultation?embed=true&theme=auto"
                title="Book a consultation via Cal.com"
                className="w-full border-0"
                style={{ height: '600px', minHeight: '500px' }}
                loading="lazy"
                allow="payment"
              />
            </div>
            <div className="p-6 bg-warm-50 dark:bg-dark-surface border-t border-warm-200 dark:border-dark-border">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-forest/10 rounded-xl flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-forest" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-darkwood dark:text-warm-100">Powered by Cal.com</p>
                    <p className="text-xs text-darkwood/50 dark:text-white">Free open-source scheduling</p>
                  </div>
                </div>
                <a
                  href="https://cal.com/leeroo/consultation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-forest to-forest-light text-white font-semibold rounded-xl hover:shadow-lg transition-all text-sm"
                >
                  Open Full Calendar
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 bg-white dark:bg-dark-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-14" initial="initial" whileInView="animate" viewport={{ once: true }} variants={fadeInUp}>
            <h2 className="text-3xl sm:text-4xl font-black text-darkwood dark:text-warm-100 mb-4 font-display">How It Works</h2>
            <p className="text-lg text-darkwood/60 dark:text-white max-w-2xl mx-auto">
              Simple 4-step process to transform your space
            </p>
          </motion.div>

          <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-6" initial="initial" whileInView="animate" viewport={{ once: true }} variants={stagger}>
            {[
              { step: '01', title: 'Book Consultation', desc: 'Choose your designer and pick a date & time', icon: Calendar, gradient: 'from-forest to-forest-light' },
              { step: '02', title: 'Virtual Meeting', desc: 'Discuss your vision and requirements', icon: Video, gradient: 'from-clay to-clay-dark' },
              { step: '03', title: 'Get Design Plan', desc: 'Receive 3D visualizations and recommendations', icon: Palette, gradient: 'from-darkwood to-clay' },
              { step: '04', title: 'Transform Space', desc: 'Shop curated items and bring your vision to life', icon: Zap, gradient: 'from-forest to-clay' }
            ].map((s, i) => (
              <motion.div key={i} variants={fadeInUp} whileHover={{ y: -8 }} className="text-center group">
                <div className="relative mb-6">
                  <div className="text-7xl font-black text-warm-100 dark:text-dark-border">{s.step}</div>
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-2xl bg-gradient-to-r ${s.gradient} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                    <s.icon className="h-7 w-7 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-darkwood dark:text-warm-100 mb-2">{s.title}</h3>
                <p className="text-sm text-darkwood/60 dark:text-white">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-gradient-to-br from-darkwood via-clay-dark to-clay text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="initial" whileInView="animate" viewport={{ once: true }} variants={fadeInUp}>
            <h2 className="text-3xl lg:text-4xl font-black mb-6 font-display">Ready to Transform Your Space?</h2>
            <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have created their dream homes with our expert designers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#designers"
                className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-warm-50 text-darkwood font-bold rounded-full transition-all group shadow-2xl hover:scale-105"
              >
                <Calendar className="h-5 w-5 mr-2" />
                <span>Book Free Consultation</span>
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
              <Link to="/shop"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white hover:bg-white hover:text-darkwood text-white font-bold rounded-full transition-all group shadow-xl"
              >
                <span>Browse Furniture</span>
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
