import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  Home, 
  Palette as PaletteIcon, 
  Sun, 
  Grid3X3,
  Settings,
  Layers,
  Eye,
  EyeOff,
  Sofa,
  Bed,
  UtensilsCrossed,
  Armchair,
  Briefcase,
  ShowerHead
} from 'lucide-react'
import { HexColorPicker } from 'react-colorful'
import { useState, useEffect } from 'react'
import useDesignStore from '@/store/useDesignStore'

export default function RoomSettingsPanel() {
  const { t } = useTranslation()
  const { 
    currentDesign,
    furnitureItems,
    roomWidth,
    roomDepth,
    roomHeight,
    wallColor,
    floorColor,
    gridSize,
    showGrid,
    snapToGrid,
    ambientLight,
    sunlightDirection,
    roomType,
    updateRoomSettings,
    toggleGrid,
    toggleSnapToGrid
  } = useDesignStore()

  // Build roomSettings object for local use
  const roomSettings = {
    width: roomWidth || 5,
    height: roomDepth || 4,
    wallColor: wallColor || '#F4EFEA',
    floorColor: floorColor || '#D9C7B8',
    gridSize: gridSize || 25,
    showGrid: showGrid !== undefined ? showGrid : true,
    snapToGrid: snapToGrid !== undefined ? snapToGrid : true,
    ambientLight: ambientLight || 0.6,
    sunlightDirection: sunlightDirection || 'top-left',
    type: roomType || 'living',
  }

  const [showWallColorPicker, setShowWallColorPicker] = useState(false)
  const [showFloorColorPicker, setShowFloorColorPicker] = useState(false)
  const [tempWallColor, setTempWallColor] = useState(roomSettings.wallColor)
  const [tempFloorColor, setTempFloorColor] = useState(roomSettings.floorColor)

  // Sync local color state when store updates (e.g. load design, template)
  useEffect(() => {
    setTempWallColor(roomSettings.wallColor)
  }, [roomSettings.wallColor])
  useEffect(() => {
    setTempFloorColor(roomSettings.floorColor)
  }, [roomSettings.floorColor])

  const handleDimensionChange = (dimension, value) => {
    const numValue = parseFloat(value)
    if (!isNaN(numValue) && numValue > 0) {
      updateRoomSettings({
        ...roomSettings,
        [dimension]: numValue
      })
    }
  }

  const handleWallColorCommit = () => {
    updateRoomSettings({
      ...roomSettings,
      wallColor: tempWallColor
    })
    setShowWallColorPicker(false)
  }

  const handleFloorColorCommit = () => {
    updateRoomSettings({
      ...roomSettings,
      floorColor: tempFloorColor
    })
    setShowFloorColorPicker(false)
  }

  const handleRoomTypeChange = (type) => {
    // Preset room dimensions based on type
    const presets = {
      living: { width: 5, height: 4 },
      bedroom: { width: 4, height: 3.5 },
      kitchen: { width: 4.5, height: 3 },
      dining: { width: 4, height: 4 },
      office: { width: 3.5, height: 3 },
      bathroom: { width: 2.5, height: 2.5 },
      custom: roomSettings // Keep current dimensions
    }

    const preset = presets[type] || presets.custom
    updateRoomSettings({
      ...roomSettings,
      width: preset.width,
      height: preset.height,
      type
    })
  }

  const presetColors = {
    walls: [
      '#F4EFEA', '#FFFFFF', '#F5F5DC', '#E6E6FA', '#F0F8FF',
      '#FFF8DC', '#FFFACD', '#F8F8FF', '#FAF0E6', '#FDF5E6'
    ],
    floor: [
      '#D9C7B8', '#DEB887', '#F5DEB3', '#D2691E', '#8B7355',
      '#CD853F', '#DAA520', '#B8860B', '#BC8F8F', '#A0522D'
    ]
  }

  return (
    <div className="h-full overflow-auto p-4 space-y-6">
      {/* Room Type */}
      <motion.div 
        className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center space-x-2">
          <Home className="h-4 w-4" />
          <span>{t('editor.roomType')}</span>
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {[
            { key: 'living', labelKey: 'editor.roomType.livingRoom', Icon: Sofa },
            { key: 'bedroom', labelKey: 'editor.roomType.bedroom', Icon: Bed },
            { key: 'kitchen', labelKey: 'editor.roomType.kitchen', Icon: UtensilsCrossed },
            { key: 'dining', labelKey: 'editor.roomType.diningRoom', Icon: Armchair },
            { key: 'office', labelKey: 'editor.roomType.office', Icon: Briefcase },
            { key: 'bathroom', labelKey: 'editor.roomType.bathroom', Icon: ShowerHead }
          ].map(({ key, labelKey, Icon }) => (
            <button
              key={key}
              onClick={() => handleRoomTypeChange(key)}
              className={`flex items-center space-x-2 p-3 rounded-lg text-sm transition-colors ${
                roomSettings?.type === key
                  ? 'bg-[#5C3A2A] text-white shadow-sm'
                  : 'bg-white dark:bg-dark-surface hover:bg-warm-50 dark:hover:bg-dark-border/30 text-darkwood dark:text-white border border-[#5C3A2A]/10'
              }`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span>{t(labelKey)}</span>
            </button>
          ))}
        </div>
        <button
          onClick={() => handleRoomTypeChange('custom')}
          className={`w-full mt-2 flex items-center justify-center space-x-2 p-3 rounded-lg text-sm transition-colors ${
            roomSettings?.type === 'custom'
              ? 'bg-[#5C3A2A] text-white shadow-sm'
              : 'bg-white dark:bg-dark-surface hover:bg-warm-50 dark:hover:bg-dark-border/30 text-darkwood dark:text-white border border-[#5C3A2A]/10'
          }`}
        >
          <Settings className="h-4 w-4 flex-shrink-0" />
          <span>{t('editor.roomType.customRoom')}</span>
        </button>
      </motion.div>

      {/* Room Dimensions */}
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center space-x-2">
          <Grid3X3 className="h-4 w-4" />
          <span>{t('editor.dimensions')}</span>
        </h4>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label text-sm">Width (meters)</label>
              <input
                type="number"
                step="0.5"
                min="2"
                max="20"
                value={roomSettings?.width || 5}
                onChange={(e) => handleDimensionChange('width', e.target.value)}
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="label text-sm">Height (meters)</label>
              <input
                type="number"
                step="0.5"
                min="2"
                max="20"
                value={roomSettings?.height || 4}
                onChange={(e) => handleDimensionChange('height', e.target.value)}
                className="input-field w-full"
              />
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-white bg-gray-100 dark:bg-gray-800 p-3 rounded">
            Room area: {((roomSettings?.width || 5) * (roomSettings?.height || 4)).toFixed(1)} m²
          </div>
        </div>
      </div>

      {/* Wall Color */}
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center space-x-2">
          <PaletteIcon className="h-4 w-4" />
          <span>Wall Color</span>
        </h4>
        <div>
          <div className="flex items-center space-x-3 mb-3">
            <button
              onClick={() => setShowWallColorPicker(!showWallColorPicker)}
              className="w-12 h-12 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-[#5C3A2A] transition-colors"
              style={{ backgroundColor: tempWallColor }}
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Wall Color
              </div>
              <div className="text-xs text-gray-500 dark:text-white font-mono">
                {tempWallColor}
              </div>
            </div>
          </div>
          
          {showWallColorPicker && (
            <motion.div 
              className="mb-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <HexColorPicker color={tempWallColor} onChange={setTempWallColor} />
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={() => setShowWallColorPicker(false)}
                  className="flex-1 py-2 text-sm btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWallColorCommit}
                  className="flex-1 py-2 text-sm btn-primary"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          )}

          {/* Preset Wall Colors */}
          <div className="grid grid-cols-5 gap-2">
            {presetColors.walls.map((color) => (
              <button
                key={color}
                onClick={() => {
                  setTempWallColor(color)
                  updateRoomSettings({
                    ...roomSettings,
                    wallColor: color
                  })
                }}
                className={`w-full h-8 rounded border-2 hover:scale-105 transition-transform ${
                  tempWallColor === color 
                    ? 'border-[#5C3A2A]' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floor Color */}
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center space-x-2">
          <Layers className="h-4 w-4" />
          <span>Floor Color</span>
        </h4>
        <div>
          <div className="flex items-center space-x-3 mb-3">
            <button
              onClick={() => setShowFloorColorPicker(!showFloorColorPicker)}
              className="w-12 h-12 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-[#5C3A2A] transition-colors"
              style={{ backgroundColor: tempFloorColor }}
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Floor Color
              </div>
              <div className="text-xs text-gray-500 dark:text-white font-mono">
                {tempFloorColor}
              </div>
            </div>
          </div>
          
          {showFloorColorPicker && (
            <motion.div 
              className="mb-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <HexColorPicker color={tempFloorColor} onChange={setTempFloorColor} />
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={() => setShowFloorColorPicker(false)}
                  className="flex-1 py-2 text-sm btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFloorColorCommit}
                  className="flex-1 py-2 text-sm btn-primary"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          )}

          {/* Preset Floor Colors */}
          <div className="grid grid-cols-5 gap-2">
            {presetColors.floor.map((color) => (
              <button
                key={color}
                onClick={() => {
                  setTempFloorColor(color)
                  updateRoomSettings({
                    ...roomSettings,
                    floorColor: color
                  })
                }}
                className={`w-full h-8 rounded border-2 hover:scale-105 transition-transform ${
                  tempFloorColor === color 
                    ? 'border-[#5C3A2A]' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Lighting Settings */}
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center space-x-2">
          <Sun className="h-4 w-4" />
          <span>Lighting</span>
        </h4>
        <div className="space-y-3">
          <div>
            <label className="label text-sm">Ambient Light Intensity</label>
            <input
              type="range"
              min="0.1"
              max="2.0"
              step="0.1"
              value={roomSettings?.ambientLight || 0.6}
              onChange={(e) => updateRoomSettings({
                ...roomSettings,
                ambientLight: parseFloat(e.target.value)
              })}
              className="w-full accent-[#5C3A2A]"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-white">
              <span>Dim</span>
              <span>{(roomSettings?.ambientLight || 0.6).toFixed(1)}</span>
              <span>Bright</span>
            </div>
          </div>
          
          <div>
            <label className="label text-sm">Sunlight Direction</label>
            <select
              value={roomSettings?.sunlightDirection || 'top-left'}
              onChange={(e) => updateRoomSettings({
                ...roomSettings,
                sunlightDirection: e.target.value
              })}
              className="input-field w-full"
            >
              <option value="top-left">Top Left</option>
              <option value="top-right">Top Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="bottom-right">Bottom Right</option>
              <option value="overhead">Overhead</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid Settings */}
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center space-x-2">
          <Grid3X3 className="h-4 w-4" />
          <span>Grid & Snap</span>
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-900 dark:text-gray-100">Show Grid</span>
            <button
              onClick={toggleGrid}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                roomSettings?.showGrid
                  ? 'bg-[#5C3A2A] text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {roomSettings?.showGrid ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              <span>{roomSettings?.showGrid ? 'Visible' : 'Hidden'}</span>
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-900 dark:text-gray-100">Snap to Grid</span>
            <button
              onClick={toggleSnapToGrid}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                roomSettings?.snapToGrid
                  ? 'bg-[#5C3A2A] text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
              <span>{roomSettings?.snapToGrid ? 'On' : 'Off'}</span>
            </button>
          </div>

          <div>
            <label className="label text-sm">Grid Size (cm)</label>
            <select
              value={roomSettings?.gridSize || 25}
              onChange={(e) => updateRoomSettings({
                ...roomSettings,
                gridSize: parseInt(e.target.value)
              })}
              className="input-field w-full"
            >
              <option value={10}>10 cm</option>
              <option value={25}>25 cm</option>
              <option value={50}>50 cm</option>
              <option value={100}>100 cm</option>
            </select>
          </div>
        </div>
      </div>

      {/* Current Design Info */}
      {(currentDesign || (furnitureItems?.length ?? 0) > 0) && (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
          <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('editor.currentDesign') || 'Current Design'}</h5>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-white">{t('editor.name') || 'Name'}:</span>
              <span className="text-gray-900 dark:text-gray-100">{currentDesign?.name || 'Untitled'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-white">{t('editor.items') || 'Items'}:</span>
              <span className="text-gray-900 dark:text-gray-100">{furnitureItems?.length ?? (currentDesign?.rooms?.reduce((acc, r) => acc + (r.furnitureItems?.length || 0), 0) ?? 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-white">{t('editor.lastModified') || 'Last Modified'}:</span>
              <span className="text-gray-900 dark:text-gray-100">
                {currentDesign?.updatedAt ? new Date(currentDesign.updatedAt).toLocaleDateString() : 'Never'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}