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
        <span className="hero-badge">★ ★ Giàu Mangiferin · Tái Chế Thông Minh</span>
        <h1 className="hero-title">
          <span className="title-line">MAN-UP SNACK</span>
          <span className="title-line title-accent">Tuyệt Phẩm Từ</span>
          <span className="title-line title-accent">Vỏ Xoài Tái Sinh</span>
        </h1>
        <p className="hero-sub">
          Thưởng thức dòng snack sấy lạnh giàu Mangiferin, cung cấp hàm lượng chất xơ gấp đôi và minh bạch nguồn gốc qua mã QR định danh.
        </p>
        <div className="hero-btns">
          <button className="btn-primary" onClick={(e) => { addRipple(e); scrollTo('product') }}>
            Khám Phá Sản Phẩm <span className="btn-arrow">→</span>
          </button>
          <button className="btn-outline" onClick={() => scrollTo('story')}>
            Câu Chuyện Của Chúng Tôi
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
