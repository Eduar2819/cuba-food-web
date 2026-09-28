import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

/** true cuando el elemento entra (o está a rootMargin de entrar) en el viewport. Solo una vez. */
export function useInView(ref: RefObject<Element | null>, rootMargin = '300px'): boolean {
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined')
  useEffect(() => {
    const el = ref.current
    if (!el || inView || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, rootMargin, inView])
  return inView
}
