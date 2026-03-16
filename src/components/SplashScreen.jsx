import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { playSplashSound, unlockAndPlayAmbient } from './AudioManager'
import useThemeStore from '@/store/useThemeStore'

const TIPS = [
  'Drag & drop furniture into your room layout',
  'Switch between 2D and 3D views instantly',
  'Change colours for the entire design or individual pieces',
  'Save designs and continue anytime',
  'Scale furniture to fit room dimensions accurately',
  'Export your designs as PDF, PNG, or JPG',
  'Use keyboard shortcuts for faster editing',
]

export default function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [tipIndex, setTipIndex] = useState(0)
  const [phase, setPhase] = useState('loading')
  const setAudioUnlocked = useThemeStore((s) => s.setAudioUnlocked)

  const handleComplete = useCallback(() => {
    setAudioUnlocked(true)
    unlockAndPlayAmbient()
    setPhase('exiting')
    setTimeout(() => onComplete?.(), 800)
  }, [onComplete, setAudioUnlocked])

  const handleTap = useCallback(() => {
    unlockAndPlayAmbient()
    setAudioUnlocked(true)
    playSplashSound()
    handleComplete()
  }, [handleComplete, setAudioUnlocked])

  useEffect(() => {
    const start = Date.now()
    const duration = 3200
    let raf
    const tick = () => {
      const elapsed = Date.now() - start
      const pct = Math.min(100, Math.round((1 - Math.pow(1 - elapsed / duration, 3)) * 100))
      setProgress(pct)
      if (pct < 100) raf = requestAnimationFrame(tick)
      else setTimeout(handleComplete, 500)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [handleComplete])

  useEffect(() => {
    const interval = setInterval(() => setTipIndex((p) => (p + 1) % TIPS.length), 2200)
    return () => clearInterval(interval)
  }, [])

  const ringData = [
    { r: 38, delay: 0, duration: 0.8, opacity: 0.25, width: 2.5 },
    { r: 30, delay: 0.2, duration: 0.7, opacity: 0.35, width: 2 },
    { r: 22, delay: 0.4, duration: 0.6, opacity: 0.45, width: 1.8 },
    { r: 14, delay: 0.6, duration: 0.5, opacity: 0.55, width: 1.5 },
    { r: 7,  delay: 0.8, duration: 0.4, opacity: 0.65, width: 1.2 },
  ]

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden cursor-pointer"
          style={{ background: 'linear-gradient(160deg, #1a120b 0%, #2e1c12 30%, #3d2517 60%, #1a120b 100%)' }}
          initial={{ opacity: 1 }}
          animate={phase === 'exiting' ? { opacity: 0, scale: 1.05 } : { opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          role="button"
          tabIndex={0}
          onClick={handleTap}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleTap() } }}
          aria-label="Tap to enter and start music"
        >
          {/* Ambient gradient orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <motion.div
              className="absolute w-[600px] h-[600px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(182,110,65,0.12) 0%, transparent 70%)', top: '-15%', right: '-10%' }}
              animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute w-[500px] h-[500px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(63,94,69,0.1) 0%, transparent 70%)', bottom: '-12%', left: '-8%' }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
            />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center px-6" style={{ maxWidth: '440px' }}>

            {/* SVG Logo Animation */}
            <motion.div
              className="mb-10"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <svg
                width="160"
                height="160"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto mb-6"
                aria-hidden="true"
              >
                {/* Concentric tree rings — stroke animation */}
                {ringData.map((ring, i) => {
                  const circumference = 2 * Math.PI * ring.r
                  return (
                    <motion.circle
                      key={i}
                      cx="44"
                      cy="44"
                      r={ring.r}
                      stroke="#C4A882"
                      strokeWidth={ring.width}
                      fill="none"
                      opacity={ring.opacity}
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ duration: ring.duration, delay: ring.delay, ease: 'easeInOut' }}
                    />
                  )
                })}

                {/* Center dot */}
                <motion.circle
                  cx="44"
                  cy="44"
                  r="2.5"
                  fill="#C4A882"
                  opacity="0.7"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, duration: 0.3, type: 'spring' }}
                />

                {/* Chair silhouette — draws after rings */}
                <motion.path
                  d="M58 90 C58 74, 62 67, 72 60 C78 56, 84 48, 84 40 C84 32, 78 26, 72 24 C68 22, 65 24, 65 28 C65 34, 68 38, 68 44 C68 52, 62 58, 58 64 L58 90"
                  stroke="#B66E41"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: 1.2, ease: 'easeInOut' }}
                />
                <motion.path
                  d="M50 70 Q58 64, 68 67"
                  stroke="#B66E41"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 2, ease: 'easeOut' }}
                />
                <motion.path
                  d="M68 67 L72 90"
                  stroke="#B66E41"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 2.3, ease: 'easeOut' }}
                />
              </svg>

              {/* Brand name — fades in after SVG completes */}
              <motion.h1
                className="text-5xl font-extrabold tracking-tight leading-none"
                style={{
                  fontFamily: 'Outfit, DM Sans, sans-serif',
                  background: 'linear-gradient(135deg, #F4EFEA 0%, #D9C7B8 30%, #B66E41 60%, #8B6F47 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.6 }}
              >
                Lee Roo
              </motion.h1>
              <motion.p
                className="text-sm mt-2 tracking-[0.2em] uppercase font-medium"
                style={{ color: 'rgba(217,199,184,0.5)' }}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.7, duration: 0.5 }}
              >
                {String.fromCharCode(0x0DBD, 0x0DD3)} {String.fromCharCode(0x0DBB, 0x0DD6)} &middot; Wood Designs
              </motion.p>
            </motion.div>

            {/* Minimal progress — percentage counter */}
            <motion.div
              className="w-full mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="flex justify-center items-center">
                <span
                  className="text-3xl font-mono tabular-nums font-light tracking-wider"
                  style={{ color: 'rgba(217,199,184,0.25)' }}
                >
                  {progress}
                  <span className="text-lg">%</span>
                </span>
              </div>
            </motion.div>

            {/* Tips */}
            <motion.div className="h-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
              <AnimatePresence mode="wait">
                <motion.p
                  key={tipIndex}
                  className="text-[13px] italic"
                  style={{ color: 'rgba(217,199,184,0.3)' }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  {TIPS[tipIndex]}
                </motion.p>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Bottom — tap to enter */}
          <motion.div
            className="absolute bottom-7 flex flex-col items-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <p className="text-[11px] tracking-[0.25em] uppercase" style={{ color: 'rgba(217,199,184,0.2)' }}>
              Tap anywhere to enter
            </p>
            <p className="text-[10px] tracking-[0.2em] uppercase" style={{ color: 'rgba(217,199,184,0.12)' }}>
              Handcrafted in Sri Lanka
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
