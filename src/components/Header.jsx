import { useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../context/AuthContext'
import './Header.css'

export default function Header() {
  const hdrRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { totalItems } = useCart()
  const { user, logout } = useAuth()

  // Header scroll effect
  useEffect(() => {
    const el = hdrRef.current
    const onScroll = () => {
      if (el) {
        el.style.background = window.scrollY > 50
          ? 'rgba(255,253,245,.98)'
          : 'rgba(255,253,245,.9)'
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Smooth scroll to section (works on Home page)
  const scrollTo = (e, id) => {
    e.preventDefault()
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: id } })
    } else {
      const el = document.getElementById(id)
      const hdr = hdrRef.current
      if (el && hdr) {
        window.scrollTo({ top: el.offsetTop - hdr.offsetHeight, behavior: 'smooth' })
      }
    }
  }

  return (
    <header id="hdr" ref={hdrRef} className="site-header">
      <div className="hdr">
        <Link to="/" className="logo">
          <i className="fa-solid fa-leaf"></i>
          <span>MangoRush</span>
        </Link>

        <nav>
          <a href="#about" onClick={(e) => scrollTo(e, 'about')}>About</a>
          <a href="#benefits" onClick={(e) => scrollTo(e, 'benefits')}>Benefits</a>
          <a href="#product" onClick={(e) => scrollTo(e, 'product')}>Product</a>
          <a href="#story" onClick={(e) => scrollTo(e, 'story')}>Story</a>
          <a href="#contact" onClick={(e) => scrollTo(e, 'contact')}>Contact</a>
        </nav>

        <div className="hdr-actions">
          {user ? (
            <div className="user-menu">
              <div className="user-avatar" title={user.name || user.email}>
                {(user.name || user.email || 'U').trim().charAt(0).toUpperCase()}
              </div>
              <span className="user-name">{user.name || user.email}</span>
              {user.role === 'admin' && (
                <Link to="/admin" className="admin-link">Admin</Link>
              )}
              <button onClick={logout} className="btn-logout">Logout</button>
            </div>
          ) : (
            <div className="auth-actions">
              <Link to="/register" className="hdr-btn hdr-register">
                Register
              </Link>
              <Link to="/login" className="hdr-btn hdr-login">
                Login
              </Link>
            </div>
          )}
          <a href="#product" className="hdr-btn" onClick={(e) => scrollTo(e, 'product')}>
            Shop Now
          </a>
          <Link to="/cart" className="hdr-cart">
            <i className="fa-solid fa-cart-shopping"></i>
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>
        </div>
      </div>
    </header>
  )
}
