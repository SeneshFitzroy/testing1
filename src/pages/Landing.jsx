import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  ArrowRight,
  Star,
  ShoppingCart,
  Truck,
  RotateCcw,
  Heart,
  Eye,
  CreditCard,
  Shield,
} from 'lucide-react'
import { SHOP_PRODUCTS, FREE_SHIPPING_THRESHOLD } from '@/lib/constants'
import useAuthStore from '@/store/useAuthStore'
import useCartStore from '@/store/useCartStore'
import useThemeStore from '@/store/useThemeStore'
import { useState, useEffect, useRef } from 'react'

const CATEGORY_LABEL_KEYS = {
  'Living Room': 'shop.category.livingRoom',
  'Dining Room': 'shop.category.diningRoom',
  Bedroom: 'shop.category.bedroom',
  Storage: 'shop.category.storage',
  Lighting: 'shop.category.lighting',
  Decor: 'shop.category.decor',
  Entertainment: 'shop.category.entertainment',
  Office: 'shop.category.office',
}

function useInView(ref, threshold = 0.15) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, threshold])
  return visible
}

/** Local poster — video screenshot, instant load, preloaded in index.html */
const HERO_POSTER = '/hero-poster.png'
const HERO_POSTER_FALLBACK = 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1920&h=1080&fit=crop&q=80'

/** Hero: poster shows INSTANTLY. Video loads in background and auto-plays when ready. */
function LandingHeroMedia() {
  const [videoReady, setVideoReady] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [useFallbackPoster, setUseFallbackPoster] = useState(false)
  const videoRef = useRef(null)

  const posterSrc = useFallbackPoster ? HERO_POSTER_FALLBACK : HERO_POSTER

  useEffect(() => {
    const img = new Image()
    img.onerror = () => setUseFallbackPoster(true)
    img.src = HERO_POSTER
  }, [])

  const handleReady = () => {
    setVideoReady(true)
    const v = videoRef.current
    if (v) v.play().catch(() => {})
  }

  // Start play as soon as we have enough data (loadedmetadata = earliest)
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (v.readyState >= 2) handleReady()
    else v.addEventListener('canplay', handleReady)
    return () => v.removeEventListener('canplay', handleReady)
  }, [])

  return (
    <div className="absolute inset-0 w-full h-full">
      {/* Poster layer — always visible first, instant load */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-500"
        style={{
          backgroundImage: `url(${posterSrc})`,
          opacity: videoReady ? 0 : 1,
        }}
        aria-hidden="true"
      />
      {/* Video layer — loads in background, fades in when ready */}
      {!videoError && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          style={{ opacity: videoReady ? 1 : 0 }}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label="Background video of furniture and living spaces"
          onError={() => setVideoError(true)}
          onCanPlay={handleReady}
          onLoadedData={handleReady}
          onLoadedMetadata={handleReady}
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
      )}
    </div>
  )
}

function AnimatedSection({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const visible = useInView(ref)
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export default function Landing() {
  const { user } = useAuthStore()
  const { addToCart, addToWishlist } = useCartStore()
  const { formatPrice } = useThemeStore()
  const { t } = useTranslation()
  const heroRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const bestSellingProducts = SHOP_PRODUCTS.filter((p) => p.rating >= 4.7).slice(0, 6)
  const latestProducts = SHOP_PRODUCTS.slice(0, 3)

  return (
    <div className="bg-stone-50 dark:bg-dark-bg min-h-screen">

      {/* ═══════════ CINEMATIC VIDEO HERO (Floyd / Arhaus Inspired) ═══════════ */}
      <section
        ref={heroRef}
        className="relative h-[100vh] min-h-[600px] flex items-center justify-center overflow-hidden -mt-16 pt-16"
        aria-label="Hero section"
      >
        {/* Full-bleed video or static poster fallback (video files optional in public/) */}
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <LandingHeroMedia />
          {/* Stronger gradient overlay (35–55%) for clear text readability over video */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.55) 100%)',
            }}
          />
        </motion.div>

        {/* Hero content — centered, minimal (Floyd style) */}
        <motion.div
          className="relative z-10 px-6 sm:px-8 text-center max-w-4xl mx-auto"
          style={{ opacity: heroOpacity }}
        >
          <motion.p
            className="text-sm sm:text-base uppercase tracking-[0.3em] text-white font-medium mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {String.fromCharCode(0x0DBD, 0x0DD3)} {String.fromCharCode(0x0DBB, 0x0DD6)} · {t('landing.hero.tagline')}
          </motion.p>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-light text-white leading-[1.05] mb-8 tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            {t('landing.hero.title')}
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-white/95 max-w-xl mx-auto mb-12 leading-relaxed font-sans drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {t('landing.hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
          >
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2.5 px-10 py-4 border-2 border-white bg-white/95 text-charcoal font-medium text-sm uppercase tracking-widest hover:bg-white hover:border-white transition-all duration-300 drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent focus:ring-offset-4"
            >
              {t('footer.shopCollection')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════ TRUST BAR — Professional, consistent across app ═══════════ */}
      <section className="bg-white dark:bg-dark-card border-b border-stone-200/60 dark:border-dark-border shadow-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-6">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 md:gap-x-16 text-sm md:text-base text-charcoal/90 dark:text-warm-300 font-medium">
            {[
              { icon: Truck, text: `${t('landing.trust.freeShippingOver')} ${formatPrice(FREE_SHIPPING_THRESHOLD)}` },
              { icon: Shield, text: t('landing.trust.warranty2yr') },
              { icon: RotateCcw, text: t('landing.trust.returns30d') },
              { icon: CreditCard, text: t('landing.trust.securePayment') },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <item.icon className="h-5 w-5 text-[#5C3A2A] dark:text-clay flex-shrink-0" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ SHOP CATEGORIES ═══════════ */}
      <section className="py-28 sm:py-32 bg-stone-50 dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
          <AnimatedSection className="text-center mb-20">
            <span className="text-charcoal/90 dark:text-warm-300 font-semibold text-sm uppercase tracking-widest mb-4 block">{t('landing.shopByCategory')}</span>
            <h2 className="text-3xl sm:text-4xl font-display font-light text-charcoal dark:text-stone-100 mb-6">
              {t('landing.categories.title')}
            </h2>
            <p className="text-charcoal/80 dark:text-warm-300 max-w-2xl mx-auto text-lg">
              {t('landing.categories.subtitle')}
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {[
              { titleKey: 'landing.category.livingRoom', descKey: 'landing.category.livingRoom.desc', to: '/shop?category=living', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&q=80' },
              { titleKey: 'landing.category.dining', descKey: 'landing.category.dining.desc', to: '/shop?category=dining', img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=600&fit=crop&q=80' },
              { titleKey: 'landing.category.bedroom', descKey: 'landing.category.bedroom.desc', to: '/shop?category=bedroom', img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop&q=80' },
            ].map((cat, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <Link to={cat.to} className="group block">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 dark:bg-dark-surface mb-6">
                    <img src={cat.img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                  </div>
                  <h3 className="font-display font-medium text-xl text-charcoal dark:text-stone-100 group-hover:text-oak transition-colors">{t(cat.titleKey)}</h3>
                  <p className="text-charcoal/80 dark:text-warm-300 mt-1">{t(cat.descKey)}</p>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ NEW ARRIVALS ═══════════ */}
      <section className="py-28 sm:py-32 bg-stone-100/60 dark:bg-dark-card">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
          <AnimatedSection className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16">
            <div>
              <span className="text-charcoal/90 dark:text-warm-300 font-semibold text-sm uppercase tracking-widest mb-3 block">{t('landing.newArrivals')}</span>
              <h2 className="text-3xl sm:text-4xl font-display font-light text-charcoal dark:text-stone-100">
                {t('landing.latestCollections') || 'Latest Collection'}
              </h2>
            </div>
            <Link to="/shop" className="inline-flex items-center gap-2 text-charcoal dark:text-stone-300 font-medium hover:text-oak transition-colors text-sm">
              {t('landing.viewAll')} <ArrowRight className="h-4 w-4" />
            </Link>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {latestProducts.map((product, idx) => (
              <AnimatedSection key={product.id} delay={idx * 80}>
                <div className="group bg-stone-50 dark:bg-dark-bg rounded-2xl overflow-hidden border border-stone-200/60 dark:border-dark-border hover:shadow-xl hover:shadow-stone-300/10 transition-all duration-300">
                  <div className="relative aspect-[4/3] bg-stone-100 dark:bg-dark-surface overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                    <button onClick={() => addToWishlist(product)} className="absolute top-4 right-4 p-2.5 rounded-xl bg-stone-50/90 dark:bg-dark-card/90 backdrop-blur-sm text-charcoal/40 hover:text-red-500 transition-colors" aria-label={`Add ${product.name} to wishlist`}>
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="p-8">
                    <p className="text-xs font-medium text-oak uppercase tracking-wider mb-2">{t(CATEGORY_LABEL_KEYS[product.category] || 'shop.category.livingRoom')}</p>
                    <h3 className="font-display font-medium text-xl text-charcoal dark:text-stone-100 group-hover:text-oak transition-colors">{product.name}</h3>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xl font-medium text-charcoal dark:text-stone-100">{formatPrice(product.price)}</span>
                      <div className="flex items-center gap-1" aria-label={`Rating: ${product.rating} out of 5`}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating || 0) ? 'text-amber-500 fill-amber-500' : 'text-stone-200 dark:text-dark-border'}`} />
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button onClick={() => addToCart(product)} className="flex-1 py-3.5 bg-charcoal hover:bg-charcoal/90 text-stone-50 text-sm font-medium rounded-xl transition-all flex items-center justify-center gap-2">
                        <ShoppingCart className="h-4 w-4" /> {t('shop.addToCart')}
                      </button>
                      <Link to={`/shop/${product.id}`} className="p-3.5 border border-stone-300 dark:border-dark-border rounded-xl text-charcoal/80 hover:border-oak hover:text-oak transition-colors flex items-center justify-center" aria-label={`View ${product.name}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ BEST SELLERS ═══════════ */}
      <section className="py-28 sm:py-32 bg-stone-50 dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
          <AnimatedSection className="text-center mb-16">
            <span className="text-charcoal/90 dark:text-warm-300 font-semibold text-sm uppercase tracking-widest mb-3 block">{t('landing.bestSellers')}</span>
            <h2 className="text-3xl sm:text-4xl font-display font-light text-charcoal dark:text-stone-100">
              {t('landing.bestSelling') || 'Customer Favorites'}
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {bestSellingProducts.map((product, idx) => (
              <AnimatedSection key={product.id} delay={idx * 60}>
                <div className="group bg-stone-100/40 dark:bg-dark-card rounded-2xl overflow-hidden border border-stone-200/50 dark:border-dark-border hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-[4/3] bg-stone-100 dark:bg-dark-surface overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                    <span className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-oak/90 text-stone-50 text-xs font-medium" aria-hidden="true">
                      {t('landing.bestSeller')}
                    </span>
                    <button onClick={() => addToWishlist(product)} className="absolute top-4 right-4 p-2.5 rounded-xl bg-stone-50/90 backdrop-blur-sm text-charcoal/40 hover:text-red-500 transition-colors" aria-label={`Add ${product.name} to wishlist`}>
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="p-8">
                    <h4 className="font-display font-medium text-lg text-charcoal dark:text-stone-100 group-hover:text-oak transition-colors">{product.name}</h4>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xl font-medium text-charcoal dark:text-stone-100">{formatPrice(product.price)}</span>
                      <div className="flex items-center gap-1" aria-label={`Rating: ${product.rating} out of 5`}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating || 0) ? 'text-amber-500 fill-amber-500' : 'text-stone-200 dark:text-dark-border'}`} />
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-3 mt-5">
                      <button onClick={() => addToCart(product)} className="flex-1 py-3.5 bg-charcoal hover:bg-charcoal/90 text-stone-50 text-sm font-medium rounded-xl transition-all flex items-center justify-center gap-2">
                        <ShoppingCart className="h-4 w-4" /> {t('shop.addToCart')}
                      </button>
                      <Link to={`/shop/${product.id}`} className="p-3.5 border border-stone-300 dark:border-dark-border rounded-xl text-charcoal/80 hover:border-oak hover:text-oak transition-colors flex items-center justify-center" aria-label={`View ${product.name}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="text-center mt-14">
            <Link to="/shop" className="inline-flex items-center justify-center gap-2 px-10 py-4 border-2 border-charcoal text-charcoal font-medium text-sm uppercase tracking-widest hover:bg-charcoal hover:text-stone-50 transition-all duration-300 rounded-xl">
              {t('landing.viewAllProducts')} <ArrowRight className="h-4 w-4" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════ CTA BANNER ═══════════ */}
      <section className="py-28 sm:py-32 bg-[#1C1C1C] text-white" aria-label="Call to action">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 text-center">
          <AnimatedSection>
            <h3 className="text-3xl sm:text-4xl font-display font-light mb-6 text-white">
              {t('landing.cta.title')}
            </h3>
            <p className="text-stone-100 text-lg sm:text-xl font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
              {t('landing.cta.desc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop" className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-white text-charcoal font-semibold text-sm uppercase tracking-widest hover:bg-stone-100 transition-all duration-300 rounded-xl shadow-lg">
                {t('footer.shopCollection')} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/shop" className="inline-flex items-center justify-center gap-2 px-10 py-4 border-2 border-white text-white font-semibold text-sm uppercase tracking-widest hover:bg-white hover:text-charcoal transition-all duration-300 rounded-xl">
                {t('landing.exploreMore')}
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════ ABOUT ═══════════ */}
      <section className="py-28 sm:py-32 bg-stone-50 dark:bg-dark-bg" id="about">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <AnimatedSection>
              <span className="text-charcoal/90 dark:text-warm-300 font-semibold text-sm uppercase tracking-widest mb-4 block">{t('landing.ourStory')}</span>
              <h2 className="text-3xl sm:text-4xl font-display font-light text-charcoal dark:text-stone-100 mb-8">
                {String.fromCharCode(0x0DBD, 0x0DD3)} {String.fromCharCode(0x0DBB, 0x0DD6)} <span className="text-oak">(Lee Roo)</span>
              </h2>
              <div className="space-y-6 text-charcoal/85 dark:text-warm-300 leading-relaxed text-lg">
                <p>{t('landing.about.para1')}</p>
                <p>{t('landing.about.para2')}</p>
                <p>{t('landing.about.para3')}</p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={150}>
              <div className="grid grid-cols-2 gap-6">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
                  <img src="https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=600&h=800&fit=crop&q=80" alt="Contemporary wooden furniture" className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl mt-12">
                  <img src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&h=800&fit=crop&q=80" alt="Wooden dining table and chairs" className="w-full h-full object-cover" loading="lazy" />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  )
}
