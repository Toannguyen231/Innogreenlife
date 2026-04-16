import { useEffect, useState, useRef } from 'react'
import { useFadeIn } from '../hooks/useFadeIn'
import ProductCard from './ProductCard'
import { API_ENDPOINTS } from '../config/api'
import './ProductGrid.css'

export default function ProductGrid() {
  const headerRef = useFadeIn()
  const carouselRef = useRef(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(3)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError('')
      try {
        const res = await fetch(API_ENDPOINTS.products)
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          throw new Error(data.message || 'Không tải được danh sách sản phẩm')
        }
        if (!cancelled) setProducts(Array.isArray(data) ? data : [])
      } catch (e) {
        if (!cancelled) setError(e.message || 'Lỗi mạng')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  // Update items per view based on screen size
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth <= 600) {
        setItemsPerView(1)
      } else if (window.innerWidth <= 992) {
        setItemsPerView(2)
      } else {
        setItemsPerView(3)
      }
    }

    updateItemsPerView()
    window.addEventListener('resize', updateItemsPerView)
    return () => window.removeEventListener('resize', updateItemsPerView)
  }, [])

  const maxIndex = Math.max(0, products.length - itemsPerView)
  const showCarousel = products.length > itemsPerView

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex))
  }

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0))
  }

  const goToSlide = (index) => {
    setCurrentIndex(Math.min(Math.max(index, 0), maxIndex))
  }

  return (
    <section className="product-section" id="product">
      <div className="container-product">
        <div className="ben-hdr fi" ref={headerRef}>
          <span className="tag">Sản Phẩm Của Chúng Tôi</span>
          <h2 className="stitle">Premium Upcycled Mango Peel Snacks</h2>
        </div>
        {loading && <p className="product-grid-status">Đang tải sản phẩm…</p>}
        {error && <p className="product-grid-status product-grid-error">{error}</p>}
        {!loading && !error && products.length === 0 && (
          <p className="product-grid-status">Chưa có sản phẩm. Chạy seeder backend hoặc thêm sản phẩm trong DB.</p>
        )}
        {!loading && !error && products.length > 0 && (
          <div className="product-carousel-container">
            {showCarousel && (
              <button
                className="carousel-btn carousel-btn-prev"
                onClick={prevSlide}
                disabled={currentIndex === 0}
                aria-label="Previous products"
              >
                ‹
              </button>
            )}
            <div className="product-carousel" ref={carouselRef}>
              <div
                className="product-grid"
                style={{
                  transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                  transition: 'transform 0.3s ease'
                }}
              >
                {products.map((p) => {
                  const productId = p.idClient || p._id
                  if (!productId) return null

                  return (
                    <ProductCard
                      key={productId}
                      title={p.title}
                      description={p.description}
                      image={p.image}
                      badge={p.badge}
                      link={`/product/${encodeURIComponent(productId)}`}
                    />
                  )
                })}
              </div>
            </div>
            {showCarousel && (
              <button
                className="carousel-btn carousel-btn-next"
                onClick={nextSlide}
                disabled={currentIndex === maxIndex}
                aria-label="Next products"
              >
                ›
              </button>
            )}
            {showCarousel && (
              <div className="carousel-indicators">
                {Array.from({ length: maxIndex + 1 }, (_, i) => (
                  <button
                    key={i}
                    className={`indicator ${i === currentIndex ? 'active' : ''}`}
                    onClick={() => goToSlide(i)}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
