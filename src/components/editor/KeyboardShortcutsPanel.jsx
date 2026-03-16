import { motion, AnimatePresence } from 'framer-motion'
import { X, Keyboard } from 'lucide-react'

const shortcuts = [
  { keys: ['Ctrl', 'Z'], desc: 'Undo last action' },
  { keys: ['Ctrl', 'Y'], desc: 'Redo last action' },
  { keys: ['Ctrl', 'Shift', 'Z'], desc: 'Redo last action' },
  { keys: ['Ctrl', 'S'], desc: 'Save design' },
  { keys: ['Delete'], desc: 'Remove selected furniture' },
  { keys: ['?'], desc: 'Toggle keyboard shortcuts' },
  { keys: ['Esc'], desc: 'Deselect item / close panels' },
]

export default function KeyboardShortcutsPanel({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Keyboard shortcuts"
        >
          <motion.div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative bg-white dark:bg-dark-card rounded-2xl shadow-2xl border border-warm-200 dark:border-dark-border max-w-md w-full overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-warm-200 dark:border-dark-border bg-gradient-to-r from-forest/5 to-transparent dark:from-forest/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-forest/10 dark:bg-forest/20 rounded-lg flex items-center justify-center">
                  <Keyboard className="h-4 w-4 text-forest" />
                </div>
                <h3 className="text-lg font-semibold text-darkwood dark:text-white">
                  Keyboard Shortcuts
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-warm-100 dark:hover:bg-dark-surface transition-colors"
                aria-label="Close shortcuts panel"
              >
                <X className="h-4 w-4 text-darkwood/40 dark:text-white" />
              </button>
            </div>

            {/* Shortcuts list */}
            <div className="p-5 space-y-3">
              {shortcuts.map((shortcut, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-darkwood/70 dark:text-white">
                    {shortcut.desc}
                  </span>
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((key, ki) => (
                      <span key={ki}>
                        <kbd className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 bg-warm-100 dark:bg-dark-surface border border-warm-200 dark:border-dark-border rounded-lg text-xs font-mono font-semibold text-darkwood dark:text-white shadow-sm">
                          {key}
                        </kbd>
                        {ki < shortcut.keys.length - 1 && (
                          <span className="mx-0.5 text-darkwood/30 dark:text-white">+</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer hint */}
            <div className="px-5 py-3 bg-warm-50 dark:bg-dark-surface border-t border-warm-200 dark:border-dark-border">
              <p className="text-xs text-darkwood/40 dark:text-white text-center">
                Press <kbd className="px-1.5 py-0.5 bg-warm-100 dark:bg-dark-border rounded text-[10px] font-mono font-semibold">?</kbd> anytime to toggle this panel
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
