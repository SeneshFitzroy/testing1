import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { X, Home, Layout } from 'lucide-react'
import { ROOM_TEMPLATES } from '@/lib/constants'
import useDesignStore from '@/store/useDesignStore'

export default function TemplateSelector({ onSelect, onClose }) {
  const { t } = useTranslation()
  const { loadTemplate } = useDesignStore()

  const handleTemplateSelect = (template) => {
    loadTemplate(template)
    onSelect(template)
  }

  const handleCustomRoom = () => {
    // Start with default dimensions
    loadTemplate({
      width: 5,
      depth: 4,
      height: 3,
      wallColor: '#F4EFEA',
      floorColor: '#D9C7B8'
    })
    onSelect(null)
  }

  return (
    <motion.div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 font-display">
              {t('editor.selectTemplate')}
            </h2>
            <p className="text-gray-500 dark:text-white mt-1">
              Choose a room template to get started quickly
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-900 dark:text-gray-100" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Custom Room Option */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {t('editor.customRoom')}
            </h3>
            <motion.button
              onClick={handleCustomRoom}
              className="w-full p-6 border-2 border-dashed border-blue-300 dark:border-blue-700 hover:border-blue-500 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Layout className="h-12 w-12 text-blue-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Start from Scratch
              </h4>
              <p className="text-gray-500 dark:text-white text-sm">
                Create a custom room with your own dimensions and preferences
              </p>
            </motion.button>
          </div>

          {/* Template Grid */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Room Templates
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ROOM_TEMPLATES.map((template) => (
                <motion.button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className="text-left p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all duration-200 group hover:border-blue-300 dark:hover:border-blue-600"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Template Preview */}
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg mb-4 overflow-hidden relative">
                    <div className="absolute inset-4 border-2 border-gray-300 dark:border-gray-600 rounded">
                      {template.shape === 'l-shaped' ? (
                        <div className="relative h-full">
                          <div className="absolute top-0 left-0 w-3/5 h-3/5 bg-blue-100 dark:bg-blue-900/30"></div>
                          <div className="absolute bottom-0 left-0 w-full h-2/5 bg-blue-100 dark:bg-blue-900/30"></div>
                        </div>
                      ) : (
                        <div className="w-full h-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Home className="h-8 w-8 text-blue-300 dark:text-blue-700" />
                        </div>
                      )}
                      
                      <div className="absolute bottom-1 right-1 bg-white/90 dark:bg-gray-900/90 px-2 py-1 rounded text-xs font-mono">
                        {template.width}×{template.depth}m
                      </div>
                    </div>
                  </div>

                  {/* Template Info */}
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors">
                    {template.name}
                  </h4>
                  <div className="text-sm text-gray-500 dark:text-white mt-1 space-y-1">
                    <div>Dimensions: {template.width}m × {template.depth}m × {template.height}m</div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <div 
                          className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600" 
                          style={{ backgroundColor: template.wallColor }}
                        />
                        <span>Walls</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div 
                          className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600" 
                          style={{ backgroundColor: template.floorColor }}
                        />
                        <span>Floor</span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-6 py-2 btn-outline"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}