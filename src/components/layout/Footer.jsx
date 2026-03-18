import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  Mail, Phone, MapPin, Facebook, Instagram, Twitter,
  ArrowRight, ArrowUp, Send, Heart, Shield, Globe, Truck, RotateCcw, CreditCard
} from 'lucide-react'
import { LogoIcon } from '@/components/Logo'
import useThemeStore from '@/store/useThemeStore'
import { FREE_SHIPPING_DISPLAY } from '@/lib/constants'
import useInView from '@/hooks/useInView'

function AnimatedFooterSection({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const visible = useInView(ref)
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export default function Footer() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const { formatPrice } = useThemeStore()
  const isHomePage = pathname === '/'
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleNewsletter = (e) => {
    e.preventDefault()
    if (email && /\S+@\S+\.\S+/.test(email)) {
      setSubscribed(true)
      // Open email client to send signup request to hello@leeroo.com
      const subject = encodeURIComponent('Lee Roo Newsletter Signup')
      const body = encodeURIComponent(`Please add this email to your newsletter: ${email}`)
      window.open(`mailto:hello@leeroo.com?subject=${subject}&body=${body}`, '_blank')
      setEmail('')
      setTimeout(() => setSubscribed(false), 4000)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-darkwood text-white mt-auto" role="contentinfo">
      {/* CTA Banner — only on homepage (redirect home → shop) */}
      {isHomePage && (
      <div className="relative overflow-hidden bg-gradient-to-r from-clay to-clay-dark">
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/4" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-white font-display">{t('footer.readyToFind')}</h3>
            <p className="text-white/90 text-sm mt-1.5 max-w-lg">{t('footer.exploreCollection')}</p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white rounded-xl hover:bg-stone-50 transition-all text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-semibold"
            style={{ color: '#5C3A2A' }}
          >
            {t('footer.shopCollection')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
      )}

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand Column */}
          <AnimatedFooterSection className="lg:col-span-4" delay={0}>
            <div className="flex items-center gap-2.5 mb-4">
              <LogoIcon size={40} />
              <div className="flex flex-col leading-tight">
                <span className="text-xl font-bold text-white font-display">Lee Roo</span>
                <span className="text-[10px] text-white -mt-0.5">{String.fromCharCode(0x0DBD, 0x0DD3)} {String.fromCharCode(0x0DBB, 0x0DD6)} &middot; Wood Designs</span>
              </div>
            </div>
            <p className="text-white text-sm leading-relaxed mb-6 max-w-xs">
              {t('footer.brandDesc')}
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, label: 'Facebook', href: '#' },
                { icon: Instagram, label: 'Instagram', href: '#' },
                { icon: Twitter, label: 'Twitter', href: '#' },
                { icon: ({ className }) => (
                  <svg className={className || 'h-4 w-4'} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                ), label: 'TikTok', href: '#' },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={`Follow us on ${label}`}
                  className="w-10 h-10 bg-white/10 hover:bg-clay/80 rounded-xl flex items-center justify-center text-white hover:text-white transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </AnimatedFooterSection>

          {/* Quick Links */}
          <AnimatedFooterSection className="lg:col-span-2" delay={100}>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { to: '/shop', label: t('footer.shopFurniture') },
                { to: '/cart', label: t('footer.shoppingCart') },
                { to: '/wishlist', label: t('footer.wishlist') },
                { to: '/editor', label: t('footer.roomDesigner') },
                { to: '/my-designs', label: t('footer.myDesigns') },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-white hover:text-white transition-colors inline-flex items-center gap-1 group">
                    <span className="w-0 group-hover:w-3 overflow-hidden transition-all duration-200">
                      <ArrowRight className="h-3 w-3 text-clay" />
                    </span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </AnimatedFooterSection>

          {/* Services — Interior Define style */}
          <AnimatedFooterSection className="lg:col-span-2" delay={200}>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{t('footer.services')}</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { to: '/shop?gift-cards', label: t('footer.giftCards') },
                { to: '/shop?swatches', label: t('footer.freeSwatches') },
                { to: '/meet-designer', label: t('footer.freeDesignServices') },
                { to: '/locations', label: t('footer.locations') },
                { to: '/support', label: t('footer.support') },
                { to: '/trade-program', label: t('footer.tradeProgram') },
              ].map(({ to, label }) => (
                <li key={`svc-${to}`}>
                  <Link to={to} className="text-white hover:text-white transition-colors inline-flex items-center gap-1 group">
                    <span className="w-0 group-hover:w-3 overflow-hidden transition-all duration-200">
                      <ArrowRight className="h-3 w-3 text-clay" />
                    </span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </AnimatedFooterSection>

          {/* Contact & Newsletter */}
          <AnimatedFooterSection className="lg:col-span-4" delay={300}>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{t('footer.contact')}</h4>
            <ul className="space-y-3 text-sm text-white mb-6">
              <li className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="h-4 w-4 text-forest-light" />
                </div>
                <a href="tel:+94761120457" className="hover:text-white transition-colors">076 112 0457</a>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="h-4 w-4 text-forest-light" />
                </div>
                <a href="tel:+94112345678" className="hover:text-white transition-colors">+94 11 234 5678</a>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="h-4 w-4 text-clay" />
                </div>
                <a href="mailto:hello@leeroo.com" className="hover:text-white transition-colors">hello@leeroo.com</a>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4 w-4 text-clay" />
                </div>
                <span>Colombo, Sri Lanka</span>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h5 className="text-sm font-semibold text-white mb-2">{t('footer.stayInspired')}</h5>
              <p className="text-xs text-white/90 mb-3">{t('footer.newsletterDesc')}</p>
              <form onSubmit={handleNewsletter} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/90 focus:outline-none focus:border-clay/50 focus:ring-1 focus:ring-clay/30 transition-colors"
                    aria-label="Email for newsletter"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-2 bg-clay hover:bg-clay-dark rounded-lg transition-colors flex items-center gap-1.5 text-white text-sm font-medium flex-shrink-0"
                  aria-label="Subscribe to newsletter"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
              {subscribed && (
                <motion.p
                  className="text-xs text-green-400 mt-2 flex items-center gap-1"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Heart className="h-3 w-3" /> {t('footer.thanksSubscribe')}
                </motion.p>
              )}
            </div>
          </AnimatedFooterSection>
        </div>
      </div>

      {/* Trust Badges — consistent with app-wide policies */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 text-xs sm:text-sm text-white font-medium">
            <span className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-clay" />
              {t('footer.freeShippingOver')} {FREE_SHIPPING_DISPLAY}
            </span>
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-forest-light" />
              {t('footer.warranty2yr')}
            </span>
            <span className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-clay" />
              {t('footer.returns30d')}
            </span>
            <span className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-clay" />
              {t('footer.securePayment')}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span className="text-xs text-white/90 text-center sm:text-left">
            &copy; {currentYear} ලී රූ (Lee Roo) &middot; Wood Designs. {t('footer.allRights')}
          </span>
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/90">{t('footer.handcrafted')}</span>
            <button
              onClick={scrollToTop}
              className="w-8 h-8 bg-white/10 hover:bg-clay/80 rounded-lg flex items-center justify-center text-white hover:text-white transition-all duration-200 hover:-translate-y-0.5"
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
