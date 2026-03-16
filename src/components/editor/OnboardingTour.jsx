import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, Grid3x3, Layers, Eye, Save } from 'lucide-react'

export const ONBOARDING_TOUR_KEY = 'leeroo-editor-tour-seen'

// Purpose options — shown FIRST
const purposeOptions = [
  'Browse & shop furniture for my home',
  'Plan a room purchase',
  'Design my space (2D/3D)',
  'Other',
]

// Feature steps — customized based on purpose
const baseFeatureSteps = [
  { title: 'Furniture Panel', desc: 'Browse and drag furniture from the left panel. Filter by category.', icon: Grid3x3, color: 'bg-forest' },
  { title: '2D Floor Plan', desc: 'Arrange furniture in 2D. Click to select, drag to reposition. Use Properties for colors & size.', icon: Layers, color: 'bg-clay' },
  { title: '3D View', desc: 'Switch to 3D to see your room. Orbit, zoom, pan. Toggle at the top.', icon: Eye, color: 'bg-darkwood' },
  { title: 'Save & Export', desc: 'Save designs, export PNG/JPG/PDF, or copy a shareable link (like Figma).', icon: Save, color: 'bg-forest-light' },
]

function getFeatureStepsForPurpose(purpose) {
  if (purpose === 'Browse & shop furniture for my home') {
    return [
      { ...baseFeatureSteps[0], desc: 'Browse furniture from the left panel — perfect for finding pieces for your home.' },
      { ...baseFeatureSteps[2], desc: 'Preview pieces in 3D before adding to cart. Orbit, zoom, pan.' },
      { ...baseFeatureSteps[3], desc: 'Save favorites, export images, or share designs with family.' },
    ]
  }
  if (purpose === 'Plan a room purchase') {
    return [
      { ...baseFeatureSteps[0], desc: 'Browse furniture and drag items into your room layout.' },
      { ...baseFeatureSteps[1], desc: 'Arrange in 2D to plan layout. Measure, scale, and visualize.' },
      { ...baseFeatureSteps[3], desc: 'Export PNG/PDF for contractors or share links with retailers.' },
    ]
  }
  if (purpose === 'Design my space (2D/3D)') {
    return baseFeatureSteps
  }
  return baseFeatureSteps
}

export default function OnboardingTour({ onComplete, triggerShow }) {
  const [phase, setPhase] = useState('tellUs') // tellUs | features
  const [step, setStep] = useState(0)
  const [purpose, setPurpose] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const seen = localStorage.getItem(ONBOARDING_TOUR_KEY)
    if (!seen) setVisible(true)
  }, [])

  useEffect(() => {
    if (triggerShow) {
      setVisible(true)
      setPhase('tellUs')
      setStep(0)
      setPurpose(null)
    }
  }, [triggerShow])

  const completeTour = () => {
    localStorage.setItem(ONBOARDING_TOUR_KEY, 'true')
    setVisible(false)
    onComplete?.()
  }

  const featureSteps = getFeatureStepsForPurpose(purpose)
  const currentFeature = featureSteps[step]
  const isLastFeature = phase === 'features' && step === featureSteps.length - 1

  const handleSkip = () => {
    completeTour()
  }

  const handleNext = () => {
    if (phase === 'tellUs') {
      setPhase('features')
      setStep(0)
    } else if (step < featureSteps.length - 1) {
      setStep(step + 1)
    } else {
      completeTour()
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[180] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Onboarding tour"
        >
          <motion.div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleSkip} aria-hidden />

          <motion.div
            className="relative bg-white dark:bg-dark-card rounded-2xl shadow-2xl border border-warm-200 dark:border-dark-border max-w-lg w-full overflow-hidden"
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Close (X) only — no Skip All */}
            <div className="absolute top-4 right-4 z-10">
              <button onClick={handleSkip} className="p-1.5 rounded-lg hover:bg-warm-100 dark:hover:bg-dark-surface transition-colors" aria-label="Close">
                <X className="h-4 w-4 text-darkwood/40 dark:text-warm-500" />
              </button>
            </div>

            {/* Phase 1: Tell Us About Yourself — FIRST */}
            {phase === 'tellUs' && (
              <div className="px-8 pt-14 pb-8">
                <h3 className="text-2xl font-bold text-darkwood dark:text-warm-100 mb-1 text-center font-display">
                  Tell Us About Yourself
                </h3>
                <p className="text-sm text-darkwood/60 dark:text-warm-400 text-center mb-6">
                  So we can <span className="text-clay font-medium">personalize</span> your experience.
                </p>
                <p className="text-sm font-medium text-darkwood dark:text-warm-200 mb-4">I mainly use Lee Roo to:</p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {purposeOptions.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => setPurpose(opt)}
                      className={`px-4 py-3 text-left text-sm font-medium rounded-xl border-2 transition-all ${
                        purpose === opt
                          ? 'border-clay bg-clay/10 text-clay'
                          : 'border-warm-200 dark:border-dark-border text-darkwood/70 dark:text-warm-400 hover:border-clay/50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <div className="flex flex-col items-center gap-3 mt-8">
                  <button
                    onClick={handleNext}
                    disabled={!purpose}
                    className={`px-6 py-3 text-white text-sm font-semibold rounded-xl transition-all flex items-center gap-2 ${purpose ? 'bg-darkwood hover:bg-darkwood/90' : 'bg-warm-300 dark:bg-warm-500 cursor-not-allowed'}`}
                  >
                    Next <ArrowRight className="h-4 w-4" />
                  </button>
                  <button onClick={handleSkip} className="text-xs text-darkwood/40 dark:text-warm-500 hover:text-darkwood dark:hover:text-warm-400">
                    Skip
                  </button>
                </div>
              </div>
            )}

            {/* Phase 2: Feature tour — steps based on purpose */}
            {phase === 'features' && currentFeature && (
              <>
                <div className="pt-12 pb-2 text-center">
                  <motion.div
                    key={step}
                    className={`w-16 h-16 mx-auto rounded-2xl ${currentFeature.color} flex items-center justify-center shadow-lg`}
                    initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                  >
                    {(() => {
                      const Icon = currentFeature.icon
                      return <Icon className="h-8 w-8 text-white" />
                    })()}
                  </motion.div>
                </div>
                <div className="px-8 py-4 text-center">
                  <motion.h3
                    key={`title-${step}`}
                    className="text-xl font-bold text-darkwood dark:text-warm-100 mb-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {currentFeature.title}
                  </motion.h3>
                  <motion.p
                    key={`desc-${step}`}
                    className="text-sm text-darkwood/60 dark:text-warm-400 leading-relaxed"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {currentFeature.desc}
                  </motion.p>
                </div>
                <div className="px-8 pb-6 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {featureSteps.map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 rounded-full transition-all ${i === step ? 'w-6 bg-clay' : i < step ? 'w-2 bg-forest/40' : 'w-2 bg-warm-200 dark:bg-dark-border'}`}
                      />
                    ))}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <button
                      onClick={handleNext}
                      className="px-5 py-2 bg-clay hover:bg-clay-dark text-white text-sm font-semibold rounded-xl shadow-sm flex items-center gap-1.5"
                    >
                      {isLastFeature ? 'Start Designing' : 'Next'} <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={handleSkip} className="text-xs text-darkwood/40 dark:text-warm-500 hover:text-darkwood dark:hover:text-warm-400">
                      Skip
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
