import { useEffect } from 'react'
import type { RefObject } from 'react'

/**
 * Respaldo del parallax para navegadores sin scroll-driven animations (Firefox, Safari antiguos).
 * - No usa listeners de scroll: un bucle rAF que solo corre mientras el contenedor es visible
 *   (IntersectionObserver).
 * - Solo escribe transform: translate3d en las capas `.parallax-layer` del contenedor.
 * - No hace nada con prefers-reduced-motion o si el navegador ya lo resuelve con CSS.
 */
export function useParallax(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const container = containerRef.current
    if (!container || typeof window === 'undefined') return
    if (CSS.supports?.('animation-timeline: scroll()')) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (typeof IntersectionObserver === 'undefined') return

    const layers = Array.from(container.querySelectorAll<HTMLElement>('.parallax-layer'))
    if (layers.length === 0) return

    const depths = layers.map(
      (layer) => Number(getComputedStyle(layer).getPropertyValue('--parallax-depth')) || 0,
    )
    let frame = 0
    let visible = false
    let lastY = -1

    const render = () => {
      frame = 0
      if (!visible) return
      const y = window.scrollY
      if (y !== lastY) {
        lastY = y
        const viewport = window.innerHeight
        const intensity = window.innerWidth >= 768 ? 1 : 0.5
        const progress = Math.min(y, viewport)
        layers.forEach((layer, i) => {
          layer.style.transform = `translate3d(0, ${(progress * (depths[i] ?? 0) * intensity).toFixed(1)}px, 0)`
        })
      }
      frame = requestAnimationFrame(render)
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting)
      if (visible && !frame) frame = requestAnimationFrame(render)
    })
    observer.observe(container)

    return () => {
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
      layers.forEach((layer) => layer.style.removeProperty('transform'))
    }
  }, [containerRef])
}
