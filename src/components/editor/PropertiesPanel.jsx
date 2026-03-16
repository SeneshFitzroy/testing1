import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { 
  Move, 
  RotateCw, 
  Maximize, 
  Palette as PaletteIcon, 
  Trash2, 
  Copy,
  Info,
  Settings
} from 'lucide-react'
import { HexColorPicker } from 'react-colorful'
import { useState } from 'react'
import { IconByName } from '@/lib/iconMap'
import useDesignStore from '@/store/useDesignStore'
import useThemeStore from '@/store/useThemeStore'

export default function PropertiesPanel({ selectedItem }) {
  const { t } = useTranslation()
  const { formatPrice } = useThemeStore()
  const { 
    updateFurniture, 
    removeFurniture, 
    duplicateFurniture, 
    rotateFurniture,
    commitFurnitureUpdate
  } = useDesignStore()

  const [showColorPicker, setShowColorPicker] = useState(false)
  const [tempColor, setTempColor] = useState(selectedItem?.color || '#8B6F47')

  // If no item is selected
  if (!selectedItem) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center">
          <Settings className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No Item Selected
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Select a furniture item to view and edit its properties
          </p>
        </div>
      </div>
    )
  }

  const handlePositionChange = (axis, value) => {
    const numValue = parseFloat(value)
    if (!isNaN(numValue)) {
      updateFurniture(selectedItem.instanceId, { [axis]: numValue })
    }
  }

  const handlePositionCommit = () => {
    commitFurnitureUpdate()
  }

  const handleRotationChange = (value) => {
    const numValue = parseFloat(value)
    if (!isNaN(numValue)) {
      updateFurniture(selectedItem.instanceId, { rotation: numValue })
      commitFurnitureUpdate()
    }
  }

  const handleScaleChange = (axis, value) => {
    const numValue = parseFloat(value)
    if (!isNaN(numValue) && numValue > 0) {
      updateFurniture(selectedItem.instanceId, { [axis]: numValue })
      commitFurnitureUpdate()
    }
  }

  const handleColorChange = (color) => {
    setTempColor(color)
  }

  const handleColorCommit = () => {
    updateFurniture(selectedItem.instanceId, { color: tempColor })
    commitFurnitureUpdate()
    setShowColorPicker(false)
  }

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${selectedItem.name}"?`)) {
      removeFurniture(selectedItem.instanceId)
    }
  }

  const handleDuplicate = () => {
    duplicateFurniture(selectedItem.instanceId)
  }

  const handleRotate = () => {
    rotateFurniture(selectedItem.instanceId)
  }

  return (
    <div className="h-full overflow-auto p-4 space-y-6">
      {/* Item Info */}
      <motion.div 
        className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-lg flex items-center justify-center">
            <IconByName name={selectedItem.icon || 'Home'} className="h-6 w-6 text-clay" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {selectedItem.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {selectedItem.category} • {formatPrice(selectedItem.price)}
            </p>
          </div>
        </div>
        
        {selectedItem.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {selectedItem.description}
          </p>
        )}
      </motion.div>

      {/* Quick Actions */}
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center space-x-2">
          <Settings className="h-4 w-4" />
          <span>Quick Actions</span>
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleRotate}
            className="flex items-center justify-center space-x-2 p-3 bg-gray-100 dark:bg-gray-800 hover:bg-blue-600 hover:text-white rounded-lg transition-colors"
          >
            <RotateCw className="h-4 w-4" />
            <span className="text-sm">{t('editor.rotate')}</span>
          </button>
          <button
            onClick={handleDuplicate}
            className="flex items-center justify-center space-x-2 p-3 bg-gray-100 dark:bg-gray-800 hover:bg-amber-600 hover:text-white rounded-lg transition-colors"
          >
            <Copy className="h-4 w-4" />
            <span className="text-sm">{t('editor.duplicate')}</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center justify-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 hover:bg-red-500 hover:text-white rounded-lg transition-colors col-span-2"
          >
            <Trash2 className="h-4 w-4" />
            <span className="text-sm">{t('editor.delete')}</span>
          </button>
        </div>
      </div>

      {/* Position Controls */}
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center space-x-2">
          <Move className="h-4 w-4" />
          <span>{t('editor.position')}</span>
        </h4>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label text-sm">X (meters)</label>
              <input
                type="number"
                step="0.1"
                value={selectedItem.x?.toFixed(1) || '0.0'}
                onChange={(e) => handlePositionChange('x', e.target.value)}
                onBlur={handlePositionCommit}
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="label text-sm">Y (meters)</label>
              <input
                type="number"
                step="0.1"
                value={selectedItem.y?.toFixed(1) || '0.0'}
                onChange={(e) => handlePositionChange('y', e.target.value)}
                onBlur={handlePositionCommit}
                className="input-field w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Rotation Controls */}
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center space-x-2">
          <RotateCw className="h-4 w-4" />
          <span>{t('editor.rotation')}</span>
        </h4>
        <div>
          <label className="label text-sm">Angle (degrees)</label>
          <input
            type="number"
            step="15"
            min="0"
            max="360"
            value={selectedItem.rotation || 0}
            onChange={(e) => handleRotationChange(e.target.value)}
            className="input-field w-full"
          />
          <div className="flex space-x-2 mt-2">
            {[0, 90, 180, 270].map((angle) => (
              <button
                key={angle}
                onClick={() => handleRotationChange(angle)}
                className={`flex-1 py-2 text-xs rounded ${
                  selectedItem.rotation === angle
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {angle}°
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scale Controls */}
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center space-x-2">
          <Maximize className="h-4 w-4" />
          <span>{t('editor.scale')}</span>
        </h4>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label text-sm">Width Scale</label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="2.0"
                value={selectedItem.scaleX?.toFixed(1) || '1.0'}
                onChange={(e) => handleScaleChange('scaleX', e.target.value)}
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="label text-sm">Depth Scale</label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="2.0"
                value={selectedItem.scaleY?.toFixed(1) || '1.0'}
                onChange={(e) => handleScaleChange('scaleY', e.target.value)}
                className="input-field w-full"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            {['0.5', '0.8', '1.0', '1.2', '1.5'].map((scale) => (
              <button
                key={scale}
                onClick={() => {
                  handleScaleChange('scaleX', scale)
                  handleScaleChange('scaleY', scale)
                }}
                className="flex-1 py-2 text-xs bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              >
                {scale}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Color Controls */}
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center space-x-2">
          <PaletteIcon className="h-4 w-4" />
          <span>{t('editor.color')}</span>
        </h4>
        <div>
          <div className="flex items-center space-x-3 mb-3">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-12 h-12 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors"
              style={{ backgroundColor: selectedItem.color }}
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Current Color
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                {selectedItem.color}
              </div>
            </div>
          </div>
          
          {showColorPicker && (
            <motion.div 
              className="mb-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <HexColorPicker color={tempColor} onChange={handleColorChange} />
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={() => setShowColorPicker(false)}
                  className="flex-1 py-2 text-sm btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={handleColorCommit}
                  className="flex-1 py-2 text-sm btn-primary"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          )}

          {/* Preset Colors */}
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Preset Colors
            </div>
            <div className="grid grid-cols-6 gap-2">
              {[
                '#8B6F47', '#D9C7B8', '#3F5E45', '#B66E41', '#4A2F21', '#F4EFEA',
                '#FFFFFF', '#000000', '#8B0000', '#006400', '#FF8C00', '#4169E1'
              ].map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    updateFurniture(selectedItem.instanceId, { color })
                    commitFurnitureUpdate()
                  }}
                  className={`w-8 h-8 rounded border-2 hover:scale-110 transition-transform ${
                    selectedItem.color === color 
                      ? 'border-blue-600' 
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Item Specifications */}
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center space-x-2">
          <Info className="h-4 w-4" />
          <span>Specifications</span>
        </h4>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Dimensions:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {selectedItem.width} × {selectedItem.depth} × {selectedItem.height}m
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Type:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
              {selectedItem.category}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Price:</span>
            <span className="font-medium text-blue-600">
              {formatPrice(selectedItem.price)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Instance ID:</span>
            <span className="font-mono text-xs text-gray-400 dark:text-gray-500">
              {selectedItem.instanceId?.substring(0, 8)}...
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}