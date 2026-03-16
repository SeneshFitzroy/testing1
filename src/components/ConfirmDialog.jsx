import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'

/**
 * Reusable confirmation dialog component.
 * Replaces window.confirm() with a styled, accessible modal.
 *
 * Props:
 * - open: boolean
 * - title: string
 * - message: string
 * - confirmLabel: string (default: "Confirm")
 * - cancelLabel: string (default: "Cancel")
 * - variant: "danger" | "warning" | "info" (default: "warning")
 * - onConfirm: () => void
 * - onCancel: () => void
 */
export default function ConfirmDialog({
  open,
  title = 'Are you sure?',
  message = '',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'warning',
  onConfirm,
  onCancel,
}) {
  const variantStyles = {
    danger: {
      icon: 'bg-red-100 dark:bg-red-900/30 text-red-600',
      btn: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    },
    warning: {
      icon: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600',
      btn: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
    },
    info: {
      icon: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
      btn: 'bg-clay hover:bg-clay-dark focus:ring-clay',
    },
  }

  const styles = variantStyles[variant] || variantStyles.warning

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
          aria-describedby="confirm-dialog-desc"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onCancel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Dialog */}
          <motion.div
            className="relative bg-white dark:bg-dark-card rounded-2xl shadow-2xl border border-warm-200 dark:border-dark-border max-w-md w-full p-6"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-warm-100 dark:hover:bg-dark-surface transition-colors"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4 text-darkwood/40 dark:text-warm-500" />
            </button>

            <div className="flex items-start gap-4">
              <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${styles.icon}`}>
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 id="confirm-dialog-title" className="text-lg font-semibold text-darkwood dark:text-warm-100 mb-1">
                  {title}
                </h3>
                <p id="confirm-dialog-desc" className="text-sm text-darkwood/60 dark:text-warm-400 leading-relaxed">
                  {message}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onCancel}
                className="px-5 py-2.5 text-sm font-semibold text-darkwood dark:text-warm-200 bg-warm-100 dark:bg-dark-surface hover:bg-warm-200 dark:hover:bg-dark-border rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-warm-400 focus:ring-offset-2"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className={`px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.btn}`}
                autoFocus
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
