import { useEffect, useRef } from 'react'
import bgImage from '../assets/img/background.jpg'
import './Hero.css'

function addRipple(e) {
  const btn = e.currentTarget
  const r = btn.getBoundingClientRect()
  const s = document.createElement('span')
  s.className = 'rpl'
  s.style.left = (e.clientX - r.left) + 'px'
  s.style.top  = (e.clientY - r.top) + 'px'
  btn.appendChild(s)
  setTimeout(() => s.remove(), 700)
}

export default function Hero() {
  const bgRef = useRef(null)
  const hdrHeight = 72

  // Parallax effect
  useEffect(() => {
    const onScroll = () => {
      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${window.scrollY * 0.22}px) scale(1.1)`
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) window.scrollTo({ top: el.offsetTop - hdrHeight, behavior: 'smooth' })
  }

  return (
    <section className="hero" id="hero">
      <div className="hero-bg">
        <img
          ref={bgRef}
          src={bgImage}
          alt="Mango Snacks background"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1601493700631-2b16ec4b6fc0?w=1920&q=80'
          }}
        />
        <div className="hero-overlay"></div>
      </div>

      <div className="hero-content">
        <span className="hero-badge">Premium Mango Snacks</span>
        <h1 className="hero-title">
          Nature's Sweetest<br />
          <span className="hl">Healthy</span> Treat
        </h1>
        <p className="hero-sub">
          100% natural mango snacks made from premium fruit. No added sugar, no preservatives.
          Just pure, delicious goodness.
        </p>
        <div className="hero-btns">
          <button className="btn-primary" onClick={(e) => { addRipple(e); scrollTo('product') }}>
            Explore Product
          </button>
          <button className="btn-outline" onClick={() => scrollTo('story')}>
            Learn Our Story
          </button>
        </div>
      </div>

      <div className="scroll-cue">
        <div className="scroll-line"></div>
        <span>Scroll</span>
      </div>
    </section>
  )
}
