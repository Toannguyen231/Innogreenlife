import { Link } from 'react-router-dom'
import productImg from '../assets/img/product.png'
import './ProductCard.css'

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

/**
 * ProductCard component
 * @param {{ title: string, description: string, image?: string, badge?: string, link?: string }} props
 */
export default function ProductCard({ title, description, image, badge, link = '/product' }) {
  const src = image || productImg

  return (
    <div className="product-card">
      <div className="product-card__image">
        <img src={src} alt={title} />
        {badge ? <span className="product-badge">{badge}</span> : null}
      </div>
      <div className="product-card__body">
        <h5 className="product-card__title">{title}</h5>
        <p className="product-card__text">{description}</p>
        <Link
          to={link}
          className="product-card__btn btn-primary"
          onClick={addRipple}
        >
          Chi tiết sản phẩm
        </Link>
      </div>
    </div>
  )
}
