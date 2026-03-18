/**
 * useInView — Intersection Observer hook for scroll-triggered visibility.
 * Used by Landing and Footer for fade-in animations when elements enter viewport.
 */
import { useState, useEffect } from 'react'

/**
 * @param {React.RefObject<HTMLElement>} ref - Ref attached to the observed element
 * @param {number} [threshold=0.15] - Ratio of visibility (0–1) to trigger
 * @returns {boolean} - True when element has entered viewport
 */
export default function useInView(ref, threshold = 0.15) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, threshold])
  return visible
}
