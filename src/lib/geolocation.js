/**
 * Reverse geocode coordinates to country code using OpenStreetMap Nominatim (free, no API key).
 * Maps to Lee Roo supported countries. Unsupported codes map to nearest (e.g. CA->US, ES->DE).
 */
const SUPPORTED = ['LK', 'US', 'GB', 'AU', 'JP', 'IN', 'DE', 'FR', 'CN']
const FALLBACK_MAP = { CA: 'US', ES: 'DE', IT: 'DE', NL: 'DE', IE: 'GB', NZ: 'AU', SG: 'IN' }

export async function reverseGeocode(lat, lon) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      { headers: { 'Accept-Language': 'en' } }
    )
    if (!res.ok) return null
    const data = await res.json()
    const code = (data?.address?.country_code || '').toUpperCase()
    if (SUPPORTED.includes(code)) return code
    return FALLBACK_MAP[code] || null
  } catch {
    return null
  }
}
