import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'
import useThemeStore from '@/store/useThemeStore'

// Fallback: calm, positive ambient music (Mixkit free license)
const FALLBACK_AUDIO = 'https://assets.mixkit.co/music/preview/mixkit-spirit-of-the-forest-1085/mixkit-spirit-of-the-forest-1085.mp3'

// Module ref so unlockAndPlayAmbient can access audio (must play in user gesture)
let _ambientAudio = null

/** Call from splash tap handler for 100% reliable ambient autoplay. */
export function unlockAndPlayAmbient() {
  const muted = useThemeStore.getState().audioMuted
  if (_ambientAudio && !muted) _ambientAudio.play().catch(() => useThemeStore.getState().setAudioMuted(true))
}

export default function AudioManager() {
  const { audioMuted, setAudioMuted } = useThemeStore()
  const ambientRef = useRef(null)
  const triedFallbackRef = useRef(false)

  useEffect(() => {
    const muted = useThemeStore.getState().audioMuted
    const audio = new Audio('/audio/ambient.mp3')
    audio.loop = true
    audio.volume = 0.15
    ambientRef.current = audio
    _ambientAudio = audio

    const tryFallback = () => {
      if (triedFallbackRef.current) return
      triedFallbackRef.current = true
      const fallback = new Audio(FALLBACK_AUDIO)
      fallback.loop = true
      fallback.volume = 0.12
      ambientRef.current = fallback
      _ambientAudio = fallback
      if (!useThemeStore.getState().audioMuted && useThemeStore.getState().audioUnlocked) fallback.play().catch(() => setAudioMuted(true))
    }

    audio.addEventListener('error', tryFallback)
    // Only play when unlocked (splash tap) - browsers block autoplay otherwise
    if (!muted && useThemeStore.getState().audioUnlocked) audio.play().catch(tryFallback)

    return () => {
      audio.removeEventListener('error', tryFallback)
      ambientRef.current = null
      _ambientAudio = null
    }
  }, [setAudioMuted])

  useEffect(() => {
    if (!ambientRef.current || !useThemeStore.getState().audioUnlocked) return
    if (audioMuted) {
      ambientRef.current.pause()
    } else {
      ambientRef.current.play().catch(() => setAudioMuted(true))
    }
  }, [audioMuted])

  return (
    <motion.button
      onClick={() => setAudioMuted(!audioMuted)}
      className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-white/90 dark:bg-dark-card/90 backdrop-blur-xl border border-warm-200/60 dark:border-dark-border/60 shadow-lg flex items-center justify-center text-darkwood/60 dark:text-warm-400 hover:text-clay dark:hover:text-clay transition-all hover:scale-110"
      aria-label={audioMuted ? 'Unmute background music' : 'Mute background music'}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={audioMuted ? 'muted' : 'unmuted'}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {audioMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  )
}

export function playSplashSound() {
  try {
    const audio = new Audio('/audio/splash.mp3')
    audio.volume = 0.3
    audio.play().catch(() => {})
  } catch {}
}
