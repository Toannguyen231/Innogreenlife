import { useEffect, useRef, useState } from 'react'

/**
 * Animates a number from 0 to `target` when element becomes visible
 * @param {number} target - The final number
 * @param {string} suffix - e.g. "K+", "%", ""
 * @param {number} duration - ms for animation (default 1600)
 */
export function useCounter(target, suffix = '', duration = 1600) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const inc = target / (duration / 16)
          let v = 0
          const timer = setInterval(() => {
            v += inc
            if (v >= target) {
              v = target
              clearInterval(timer)
            }
            setCount(Math.floor(v))
          }, 16)
          observer.unobserve(el)
        }
      },
      { threshold: 0.6 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return { ref, display: `${count}${suffix}` }
}
