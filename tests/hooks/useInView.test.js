import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import useInView from '../../src/hooks/useInView'

describe('useInView', () => {
  let observeMock
  let disconnectMock
  let callback

  beforeEach(() => {
    observeMock = vi.fn()
    disconnectMock = vi.fn()
    callback = null
    vi.stubGlobal(
      'IntersectionObserver',
      class MockIntersectionObserver {
        constructor(cb, opts) {
          callback = cb
          expect(opts).toHaveProperty('threshold')
        }
        observe = observeMock
        disconnect = disconnectMock
        unobserve = vi.fn()
      }
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns false initially', () => {
    const ref = { current: document.createElement('div') }
    const { result } = renderHook(() => useInView(ref))
    expect(result.current).toBe(false)
  })

  it('observes the element when ref is attached', () => {
    const ref = { current: document.createElement('div') }
    renderHook(() => useInView(ref))
    expect(observeMock).toHaveBeenCalledWith(ref.current)
  })

  it('returns true when element intersects', () => {
    const ref = { current: document.createElement('div') }
    const { result, rerender } = renderHook(() => useInView(ref))
    expect(result.current).toBe(false)
    callback?.([{ isIntersecting: true }])
    rerender()
    expect(result.current).toBe(true)
  })

  it('uses default threshold of 0.15', () => {
    const orig = global.IntersectionObserver
    let capturedThreshold
    vi.stubGlobal(
      'IntersectionObserver',
      class Mock {
        constructor(cb, opts) {
          capturedThreshold = opts?.threshold
        }
        observe() {}
        disconnect() {}
        unobserve() {}
      }
    )
    const ref = { current: document.createElement('div') }
    renderHook(() => useInView(ref))
    expect(capturedThreshold).toBe(0.15)
    vi.stubGlobal('IntersectionObserver', orig)
  })
})
