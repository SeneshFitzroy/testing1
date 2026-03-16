import { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react'
import { Stage, Layer, Rect, Group, Text, Circle, Line } from 'react-konva'
import useDesignStore from '@/store/useDesignStore'

/* ── Furniture Item with live dimension display ── */
function FurnitureItem({ item, isSelected, onSelect, onDragMove, onDragEnd, onTransform, roomSettings, gridSize, snapToGrid }) {
  const [isDragging, setIsDragging] = useState(false)
  const [livePos, setLivePos] = useState({ x: item.x, y: item.y })

  const handleDragStart = () => {
    setIsDragging(true)
    onSelect(item.instanceId)
  }

  const handleDragMove = (e) => {
    const x = e.target.x() / 50
    const y = e.target.y() / 50
    setLivePos({ x, y })
    onDragMove?.(item.instanceId, x, y)
  }

  const handleDragEnd = (e) => {
    setIsDragging(false)
    let x = e.target.x()
    let y = e.target.y()

    if (snapToGrid && gridSize) {
      const gridSizeInPixels = (gridSize / 100) * 50
      x = Math.round(x / gridSizeInPixels) * gridSizeInPixels
      y = Math.round(y / gridSizeInPixels) * gridSizeInPixels
    }

    const roomWidthPx = (roomSettings?.width || 5) * 50
    const roomHeightPx = (roomSettings?.height || 4) * 50
    const itemWidthPx = (item.width || 1) * 50
    const itemHeightPx = (item.depth || 1) * 50

    x = Math.max(0, Math.min(x, roomWidthPx - itemWidthPx))
    y = Math.max(0, Math.min(y, roomHeightPx - itemHeightPx))

    const xMeters = x / 50
    const yMeters = y / 50
    setLivePos({ x: xMeters, y: yMeters })
    onDragEnd(item.instanceId, xMeters, yMeters)
  }

  const itemX = (item.x || 0) * 50
  const itemY = (item.y || 0) * 50
  const itemWidth = (item.width || 1) * 50
  const itemHeight = (item.depth || 1) * 50
  const scaleX = item.scaleX || 1
  const scaleY = item.scaleY || 1
  const scaledW = itemWidth * scaleX
  const scaledH = itemHeight * scaleY
  const realW = ((item.width || 1) * scaleX).toFixed(2)
  const realH = ((item.depth || 1) * scaleY).toFixed(2)

  return (
    <Group
      x={itemX}
      y={itemY}
      scaleX={scaleX}
      scaleY={scaleY}
      rotation={item.rotation || 0}
      draggable
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onClick={() => onSelect(item.instanceId)}
      onTap={() => onSelect(item.instanceId)}
    >
      {/* Furniture body */}
      <Rect
        width={itemWidth}
        height={itemHeight}
        fill={item.color || '#8B6F47'}
        stroke={isSelected ? '#3F5E45' : '#4A2F21'}
        strokeWidth={isSelected ? 3 / scaleX : 1 / scaleX}
        cornerRadius={3}
        shadowBlur={isSelected ? 12 : 6}
        shadowColor={isSelected ? 'rgba(63,94,69,0.4)' : 'rgba(0,0,0,0.2)'}
        shadowOffsetX={2}
        shadowOffsetY={2}
      />

      {/* Name label */}
      <Text
        text={item.name}
        fontSize={9 / scaleX}
        fill="white"
        width={itemWidth}
        height={itemHeight * 0.6}
        y={itemHeight * 0.1}
        align="center"
        verticalAlign="middle"
        wrap="char"
        fontStyle="bold"
      />

      {/* Live dimension label (always visible) */}
      <Text
        text={`${realW}m × ${realH}m`}
        fontSize={7 / scaleX}
        fill="rgba(255,255,255,0.85)"
        width={itemWidth}
        y={itemHeight * 0.72}
        align="center"
        fontStyle="500"
      />

      {/* Drag position overlay */}
      {isDragging && (
        <Text
          text={`x:${livePos.x.toFixed(1)} y:${livePos.y.toFixed(1)}`}
          fontSize={8 / scaleX}
          fill="#B66E41"
          fontStyle="bold"
          y={-14 / scaleY}
          width={itemWidth}
          align="center"
        />
      )}

      {/* Selection handles */}
      {isSelected && (
        <>
          {[
            [0, 0], [itemWidth, 0],
            [itemWidth, itemHeight], [0, itemHeight]
          ].map(([cx, cy], index) => (
            <Circle
              key={index}
              x={cx}
              y={cy}
              radius={4 / scaleX}
              fill="#3F5E45"
              stroke="white"
              strokeWidth={1.5 / scaleX}
            />
          ))}
          {/* Dimension guides when selected */}
          {/* Top width line */}
          <Line points={[0, -6 / scaleY, itemWidth, -6 / scaleY]} stroke="#B66E41" strokeWidth={1 / scaleX} dash={[3, 2]} />
          <Text text={`${realW}m`} fontSize={7 / scaleX} fill="#B66E41" fontStyle="bold" y={-16 / scaleY} width={itemWidth} align="center" />
          {/* Left height line */}
          <Line points={[-6 / scaleX, 0, -6 / scaleX, itemHeight]} stroke="#B66E41" strokeWidth={1 / scaleY} dash={[3, 2]} />
          <Text text={`${realH}m`} fontSize={7 / scaleX} fill="#B66E41" fontStyle="bold" x={-30 / scaleX} y={itemHeight / 2 - 4} />
        </>
      )}
    </Group>
  )
}

/* ── Grid ── */
function GridLayer({ roomSettings, gridSize, showGrid }) {
  if (!showGrid || !gridSize) return null

  const roomWidth = (roomSettings?.width || 5) * 50
  const roomHeight = (roomSettings?.height || 4) * 50
  const gridSizeInPixels = (gridSize / 100) * 50
  const gridLines = []

  for (let x = 0; x <= roomWidth; x += gridSizeInPixels) {
    gridLines.push(
      <Rect key={`v-${x}`} x={x} y={0} width={0.5} height={roomHeight} fill="rgba(75,47,33,0.12)" />
    )
  }
  for (let y = 0; y <= roomHeight; y += gridSizeInPixels) {
    gridLines.push(
      <Rect key={`h-${y}`} x={0} y={y} width={roomWidth} height={0.5} fill="rgba(75,47,33,0.12)" />
    )
  }
  return gridLines
}

const RoomCanvas2D = forwardRef(function RoomCanvas2D(_, ref) {
  const stageRef = useRef()
  const containerRef = useRef()

  useImperativeHandle(ref, () => ({
    toDataURL: (mime = 'image/png', quality = 1) => {
      const stage = stageRef.current
      if (!stage) return null
      try {
        return stage.toDataURL({ pixelRatio: 2, mimeType: mime, quality })
      } catch {
        return null
      }
    }
  }))
  const [stageWidth, setStageWidth] = useState(600)
  const [stageHeight, setStageHeight] = useState(480)
  const [scale, setScale] = useState(1)
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 })

  const {
    furnitureItems,
    selectedItemId,
    roomWidth: storeRoomWidth,
    roomDepth: storeRoomDepth,
    wallColor,
    floorColor,
    gridSize: storeGridSize,
    showGrid: storeShowGrid,
    snapToGrid: storeSnapToGrid,
    selectFurniture,
    addFurniture,
    updateFurniturePosition,
    commitFurnitureUpdate,
  } = useDesignStore()

  const [isDragOver, setIsDragOver] = useState(false)

  const roomSettings = {
    width: storeRoomWidth || 5,
    height: storeRoomDepth || 4,
    wallColor: wallColor || '#F4EFEA',
    floorColor: floorColor || '#D9C7B8',
    gridSize: storeGridSize || 25,
    showGrid: storeShowGrid !== undefined ? storeShowGrid : true,
    snapToGrid: storeSnapToGrid !== undefined ? storeSnapToGrid : true,
  }

  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current
      if (container) {
        setStageWidth(container.offsetWidth)
        setStageHeight(container.offsetHeight)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const roomWidthPx = (roomSettings.width) * 50
  const roomHeightPx = (roomSettings.height) * 50

  const fitView = useCallback(() => {
    const padding = 50
    const availableWidth = stageWidth - (padding * 2)
    const availableHeight = stageHeight - (padding * 2)
    const scaleX = availableWidth / roomWidthPx
    const scaleY = availableHeight / roomHeightPx
    const newScale = Math.min(scaleX, scaleY, 2.5)
    setScale(newScale)
    setStagePos({
      x: (stageWidth - roomWidthPx * newScale) / 2,
      y: (stageHeight - roomHeightPx * newScale) / 2,
    })
  }, [stageWidth, stageHeight, roomWidthPx, roomHeightPx])

  useEffect(() => { fitView() }, [fitView])

  const handleFurnitureDragEnd = (instanceId, x, y) => {
    updateFurniturePosition(instanceId, x, y)
    commitFurnitureUpdate()
  }

  const handleWheel = (e) => {
    e.evt.preventDefault()
    const scaleBy = 1.06
    const stage = stageRef.current
    const oldScale = stage.scaleX()
    const pointer = stage.getPointerPosition()
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    }
    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy
    const clampedScale = Math.max(0.4, Math.min(newScale, 4))
    setScale(clampedScale)
    setStagePos({
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    })
  }

  const handleStageClick = (e) => {
    if (e.target === e.target.getStage()) selectFurniture(null)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'copy'
    setIsDragOver(true)
  }
  const handleDragLeave = (e) => {
    if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) setIsDragOver(false)
  }
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    const raw = e.dataTransfer.getData('furniture')
    if (!raw) return
    try {
      const item = JSON.parse(raw)
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      const stage = stageRef.current
      if (!stage) return
      const relX = e.clientX - rect.left
      const relY = e.clientY - rect.top
      const sx = (relX - stagePos.x) / scale
      const sy = (relY - stagePos.y) / scale
      const xMeters = sx / 50
      const yMeters = sy / 50
      const itemW = item.width || 1
      const itemD = item.depth || 1
      const xClamped = Math.max(0, Math.min(xMeters, roomSettings.width - itemW))
      const yClamped = Math.max(0, Math.min(yMeters, roomSettings.height - itemD))
      addFurniture(item, xClamped, yClamped)
    } catch (err) {
      console.warn('Drop parse failed:', err)
    }
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative bg-gradient-to-br from-warm-100 to-warm-200 dark:from-dark-bg dark:to-dark-surface"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drop hint overlay — shows when dragging furniture over canvas */}
      {isDragOver && (
        <div className="absolute inset-0 z-[5] flex items-center justify-center bg-clay/10 dark:bg-clay/20 transition-colors duration-150">
          <div className="rounded-2xl border-2 border-dashed border-clay dark:border-clay/80 bg-white/90 dark:bg-dark-card/90 px-8 py-6 text-center shadow-lg pointer-events-none">
            <p className="text-darkwood dark:text-white font-semibold">Drop here to add furniture</p>
            <p className="text-sm text-darkwood/60 dark:text-white mt-1">Release to place on floor plan</p>
          </div>
        </div>
      )}
      {/* Canvas Info Overlay */}
      <div className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-dark-card/90 backdrop-blur-sm rounded-xl p-3 text-sm border border-warm-200/50 dark:border-dark-border/50 shadow-sm">
        <div className="text-darkwood dark:text-white font-semibold">2D Room Editor</div>
        <div className="text-darkwood/50 dark:text-white text-xs mt-1">
          Room: {roomSettings.width}m × {roomSettings.height}m
        </div>
        <div className="text-darkwood/50 dark:text-white text-xs">
          Scale: {(scale * 100).toFixed(0)}% &middot; Items: {furnitureItems.length}
        </div>
      </div>

      {/* Scale Controls */}
      <div className="absolute top-4 right-4 z-10 bg-white/90 dark:bg-dark-card/90 backdrop-blur-sm rounded-xl p-1.5 border border-warm-200/50 dark:border-dark-border/50 shadow-sm">
        <div className="flex flex-col gap-1">
          <button
            onClick={() => setScale(Math.min(scale * 1.25, 4))}
            className="w-8 h-8 flex items-center justify-center text-sm font-bold bg-clay text-white rounded-lg hover:bg-clay-dark transition-colors"
          >
            +
          </button>
          <button
            onClick={() => setScale(Math.max(scale / 1.25, 0.4))}
            className="w-8 h-8 flex items-center justify-center text-sm font-bold bg-clay text-white rounded-lg hover:bg-clay-dark transition-colors"
          >
            −
          </button>
          <button
            onClick={fitView}
            className="w-8 h-8 flex items-center justify-center text-[10px] font-bold bg-forest text-white rounded-lg hover:bg-forest-light transition-colors"
          >
            Fit
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm rounded-xl px-3 py-2 text-xs text-darkwood/50 dark:text-white border border-warm-200/30 dark:border-dark-border/30">
        Drag furniture to move &middot; Click to select &middot; Delete key or trash icon to remove
      </div>

      {/* Konva Stage */}
      <Stage
        ref={stageRef}
        width={stageWidth}
        height={stageHeight}
        scaleX={scale}
        scaleY={scale}
        x={stagePos.x}
        y={stagePos.y}
        onWheel={handleWheel}
        onClick={handleStageClick}
        onTap={handleStageClick}
        draggable
      >
        <Layer>
          {/* Room Floor */}
          <Rect
            x={0}
            y={0}
            width={roomWidthPx}
            height={roomHeightPx}
            fill={roomSettings.floorColor}
            stroke={roomSettings.wallColor}
            strokeWidth={8}
            cornerRadius={4}
            shadowBlur={20}
            shadowColor="rgba(74,47,33,0.15)"
            shadowOffsetX={4}
            shadowOffsetY={4}
          />

          {/* Grid */}
          <GridLayer
            roomSettings={roomSettings}
            gridSize={roomSettings.gridSize}
            showGrid={roomSettings.showGrid}
          />

          {/* Room dimension labels */}
          <Text
            text={`${roomSettings.width}m`}
            x={roomWidthPx / 2 - 15}
            y={-22}
            fontSize={11}
            fill="#4A2F21"
            fontStyle="bold"
          />
          <Text
            text={`${roomSettings.height}m`}
            x={-28}
            y={roomHeightPx / 2 - 6}
            fontSize={11}
            fill="#4A2F21"
            fontStyle="bold"
            rotation={-90}
          />

          {/* Furniture Items */}
          {furnitureItems.map((item) => (
            <FurnitureItem
              key={item.instanceId}
              item={item}
              isSelected={selectedItemId === item.instanceId}
              onSelect={selectFurniture}
              onDragEnd={handleFurnitureDragEnd}
              roomSettings={roomSettings}
              gridSize={roomSettings.gridSize}
              snapToGrid={roomSettings.snapToGrid}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  )
})

export default RoomCanvas2D
