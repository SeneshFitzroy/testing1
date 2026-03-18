/**
 * Color utilities for realistic furniture image color change.
 * Uses hex-to-HSL conversion for hue-rotate and blend-mode overlays.
 */

/**
 * Convert hex color to HSL { h, s, l } (h: 0-360, s/l: 0-1)
 */
export function hexToHSL(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return { h: 0, s: 0, l: 0.5 }
  let r = parseInt(result[1], 16) / 255
  let g = parseInt(result[2], 16) / 255
  let b = parseInt(result[3], 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return { h: h * 360, s, l }
}

/**
 * Get CSS filter string for hue-rotate to shift image toward target color.
 * Base furniture images are typically tan/brown (hue ~30). We rotate to target hue.
 */
export function getHueRotateFilter(hex, baseHue = 30) {
  const { h } = hexToHSL(hex)
  let delta = h - baseHue
  if (delta > 180) delta -= 360
  if (delta < -180) delta += 360
  return `hue-rotate(${Math.round(delta)}deg)`
}

/**
 * Get CSS filter for saturate to match target color intensity
 */
export function getSaturateFilter(hex, baseSaturate = 0.4) {
  const { s } = hexToHSL(hex)
  const factor = Math.max(0.6, Math.min(1.8, 0.5 + s * 1.2))
  return `saturate(${factor.toFixed(2)})`
}
