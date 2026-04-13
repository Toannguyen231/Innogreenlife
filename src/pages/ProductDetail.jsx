import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useFadeIn } from '../hooks/useFadeIn'
import productImg from '../assets/img/product.png'
import './ProductDetail.css'

function addRipple(e) {
  const btn = e.currentTarget
  const r = btn.getBoundingClientRect()
  const s = document.createElement('span')
  s.className = 'rpl'
  s.style.left = (e.clientX - r.left) + 'px'
  s.style.top  = (e.clientY - r.top)  + 'px'
  btn.appendChild(s)
  setTimeout(() => s.remove(), 700)
}

export default function ProductDetail() {
  const imgRef  = useFadeIn()
  const infoRef = useFadeIn()

  // 3D tilt effect on product image
  useEffect(() => {
    const el = imgRef.current
    if (!el) return
    const img = el.querySelector('img')
    if (!img) return
    img.style.transition = 'transform .15s ease'

    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width  - 0.5
      const y = (e.clientY - r.top)  / r.height - 0.5
      img.style.transform = `scale(1.04) rotateY(${x * 9}deg) rotateX(${-y * 9}deg)`
    }
    const onLeave = () => { img.style.transform = '' }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [imgRef])

  const features = [
    'No added sugar',
    'No preservatives',
    'Rich in Vitamin C',
    'Vegan friendly',
  ]

  return (
    <>
      <Header />
      <main className="pd-main">
        <div className="wrap">
          <div className="prod-wrap">
            {/* Product Image */}
            <div className="prod-img fi" ref={imgRef}>
              <img src={productImg} alt="Mango Snack Pack" />
              <span className="badge">Best Seller</span>
            </div>

            {/* Product Info */}
            <div className="fi d1" ref={infoRef}>
              <span className="tag">Our Product</span>
              <h1 className="stitle">Premium Mango Slices</h1>
              <p className="prod-desc">
                Carefully selected and dried at the perfect temperature to preserve natural
                sweetness and nutrients. Each bite delivers the authentic mango flavor you love.
              </p>

              <ul className="features">
                {features.map((f) => (
                  <li key={f}>
                    <i className="fa-solid fa-check"></i> {f}
                  </li>
                ))}
              </ul>

              <div className="price-row">
                <span className="price-now">$14.99</span>
                <span className="price-old">$19.99</span>
                <span className="price-pct">-25%</span>
              </div>

              <Link
                to="/#contact"
                className="btn-buy btn-primary"
                onClick={addRipple}
              >
                Buy Now <i className="fa-solid fa-bag-shopping"></i>
              </Link>

              <Link to="/" className="back-link">
                <i className="fa-solid fa-arrow-left"></i> Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
