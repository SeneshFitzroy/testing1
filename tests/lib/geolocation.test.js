import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { reverseGeocode } from '../../src/lib/geolocation'

describe('reverseGeocode', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns country code for supported country', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ address: { country_code: 'gb' } }),
    })
    const result = await reverseGeocode(51.5, -0.1)
    expect(result).toBe('GB')
  })

  it('returns fallback for unsupported country', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ address: { country_code: 'ca' } }),
    })
    const result = await reverseGeocode(43.6, -79.4)
    expect(result).toBe('US')
  })

  it('returns null when response not ok', async () => {
    fetch.mockResolvedValueOnce({ ok: false })
    const result = await reverseGeocode(51.5, -0.1)
    expect(result).toBeNull()
  })

  it('returns null when fetch throws', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'))
    const result = await reverseGeocode(51.5, -0.1)
    expect(result).toBeNull()
  })

  it('returns null for unsupported country with no fallback', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ address: { country_code: 'xx' } }),
    })
    const result = await reverseGeocode(0, 0)
    expect(result).toBeNull()
  })
})
