import { useRef, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useCart } from '../hooks/useCart'
import { useToast } from '../context/ToastContext'
import productImg from '../assets/img/product.png'
import { API_ENDPOINTS } from '../config/api'
import './ProductDetail.css'

function addRipple(e) {
  const btn = e.currentTarget
  const r = btn.getBoundingClientRect()
  const s = document.createElement('span')
  s.className = 'rpl'
  s.style.left = (e.clientX - r.left) + 'px'
  s.style.top = (e.clientY - r.top) + 'px'
  btn.appendChild(s)
  setTimeout(() => s.remove(), 700)
}

const DEFAULT_FEATURES = [
  'No added sugar',
  'No preservatives',
  'Rich in Vitamin C',
  'Vegan friendly',
]

export default function ProductDetail() {
  const { id } = useParams()
  const imgRef = useRef(null)
  const infoRef = useRef(null)
  const { addToCart } = useCart()
  const { showToast } = useToast()
  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  console.log('ProductDetail component rendered with id:', id)

  useEffect(() => {
    window.scrollTo(0, 0)
    let cancelled = false

    async function load() {
      if (!id) {
        setError('Thiếu mã sản phẩm')
        setLoading(false)
        return
      }
      console.log('Loading product with id:', id)
      setLoading(true)
      setError('')
      try {
        const res = await fetch(API_ENDPOINTS.productById(id))
        console.log('API response status:', res.status)
        const data = await res.json().catch(() => ({}))
        console.log('API response data:', data)
        if (!res.ok) {
          throw new Error(data.message || 'Không tải được sản phẩm')
        }
        if (!cancelled) setProduct(data)
        console.log('Product set successfully:', data)
      } catch (e) {
        console.log('Error loading product:', e)
        if (!cancelled) setError(e.message || 'Lỗi mạng')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [id])

  // 3D tilt effect on product image
  useEffect(() => {
    const el = imgRef.current
    if (!el || !product) return
    const img = el.querySelector('img')
    if (!img) return
    img.style.transition = 'transform .15s ease'

    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      img.style.transform = `scale(1.04) rotateY(${x * 9}deg) rotateX(${-y * 9}deg)`
    }
    const onLeave = () => { img.style.transform = '' }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [imgRef, product])

  const displayImage = product?.image || productImg
  const features = product?.features?.length ? product.features : DEFAULT_FEATURES
  const safePrice = Number(product?.price)
  const safeOldPrice = Number(product?.oldPrice)
  const hasValidPrice = Number.isFinite(safePrice)
  const hasValidOldPrice = Number.isFinite(safeOldPrice)
  const discountPct =
    hasValidOldPrice && hasValidPrice && safeOldPrice > safePrice
      ? Math.round((1 - safePrice / safeOldPrice) * 100)
      : null

  const availableQuantity = product && typeof product.quantity === 'number' ? product.quantity : null
  const isOutOfStock = availableQuantity !== null ? availableQuantity <= 0 : product?.inStock === false
  const canAddToCart = !isOutOfStock

  return (
    <>
      <Header />
      <main className="pd-main">
        <div className="wrap">
          {loading && <p className="pd-status">Đang tải…</p>}
          {error && (
            <p className="pd-status pd-error">
              {error}{' '}
              <Link to="/">Về trang chủ</Link>
            </p>
          )}
          {!loading && !error && product && (
            <div className="prod-wrap">
              <div className="prod-img fi on" ref={imgRef}>
                <img src={displayImage} alt={product.title} />
                {product.badge ? <span className="badge">{product.badge}</span> : null}
              </div>

              <div className="fi d1 on" ref={infoRef}>
                <span className="tag">Our Product</span>
                <h1 className="stitle">{product.title}</h1>
                <p className="prod-desc">{product.description}</p>

                <ul className="features">
                  {features.map((f) => (
                    <li key={f}>
                      <i className="fa-solid fa-check"></i> {f}
                    </li>
                  ))}
                </ul>

                <div className="price-row">
                  <span className="price-now">${hasValidPrice ? safePrice.toFixed(2) : '0.00'}</span>
                  {hasValidOldPrice ? (
                    <>
                      <span className="price-old">${safeOldPrice.toFixed(2)}</span>
                      {discountPct != null ? (
                        <span className="price-pct">-{discountPct}%</span>
                      ) : null}
                    </>
                  ) : null}
                </div>

                <div className="quantity-row">
                  <span className="qty-label">Quantity:</span>
                  <div className="qty-controls">
                    <button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))} className="qty-btn">-</button>
                    <span className="qty-val">{quantity}</span>
                    <button type="button" onClick={() => setQuantity(q => q + 1)} className="qty-btn">+</button>
                  </div>
                </div>

                {availableQuantity !== null ? (
                  <p className="stock-status">Còn lại: {availableQuantity} sản phẩm</p>
                ) : (
                  <p className="stock-status">{product.inStock ? 'Còn hàng' : 'Hết hàng'}</p>
                )}

                <button
                  type="button"
                  className="btn-buy btn-primary"
                  disabled={!canAddToCart || (availableQuantity !== null && quantity > availableQuantity)}
                  onClick={(e) => {
                    addRipple(e)
                    addToCart({
                      id: product.idClient || product._id,
                      title: product.title || 'Product',
                      price: hasValidPrice ? safePrice : 0,
                      quantity,
                      image: typeof product.image === 'string' ? product.image : productImg
                    })
                    showToast(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`)
                  }}
                >
                  {isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ'}
                </button>

                <Link to="/" className="back-link">
                  <i className="fa-solid fa-arrow-left"></i> Back to Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
