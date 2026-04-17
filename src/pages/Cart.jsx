import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useCart } from '../hooks/useCart'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'
import { API_ENDPOINTS } from '../config/api'
import './Cart.css'

export default function Cart() {
  const { items, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart()
  const { showToast } = useToast()
  const { user, token } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      setName((n) => n || user.name || '')
      setEmail((e) => e || user.email || '')
    }
  }, [user])

  const handleCheckout = async () => {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      showToast('Vui lòng nhập họ tên, số điện thoại và địa chỉ')
      return
    }

    try {
      setSubmitting(true)
      const body = {
        customerDetail: {
          name: name.trim(),
          email: email.trim() || undefined,
          phone: phone.trim(),
          address: address.trim(),
        },
        items: items.map((i) => ({
          idClient: String(i.id),
          title: i.title,
          quantity: i.quantity,
          price: i.price,
          image: typeof i.image === 'string' ? i.image : '',
        })),
        paymentMethod,
      }

      const res = await fetch(API_ENDPOINTS.orders, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(body),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.message || 'Đặt hàng thất bại')
      }

      clearCart()
      if (data.paymentInfo) {
        navigate('/payment', {
          state: {
            paymentInfo: data.paymentInfo,
            orderId: data.order?._id || null
          }
        })
        return
      }

      showToast('Đặt hàng thành công! Cảm ơn bạn.')
      navigate('/')
    } catch (e) {
      showToast(e.message || 'Đặt hàng thất bại')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Header />
      <main className="cart-page">
        <div className="cart-container">
          <h1 className="cart-title">Your Cart</h1>

          {items.length === 0 ? (
            <div className="cart-empty">
              <i className="fa-solid fa-cart-arrow-down empty-icon"></i>
              <h2>Your cart is currently empty.</h2>
              <p>Looks like you haven&apos;t added any premium mango snacks yet.</p>
              <Link to="/#product" className="btn-primary btn-shop" onClick={() => {
                setTimeout(() => {
                  const el = document.getElementById('product')
                  if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' })
                }, 100)
              }}>
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="cart-content">
              <div className="cart-items">
                {items.map(item => (
                  <div key={item.id} className="cart-item">
                    <img src={item.image} alt={item.title} className="item-img" />
                    <div className="item-details">
                      <h3 className="item-title">{item.title}</h3>
                      <p className="item-price">{item.price.toFixed(0)} VNĐ</p>
                    </div>
                    <div className="item-actions">
                      <div className="qty-controls small">
                        <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="qty-btn">-</button>
                        <span className="qty-val">{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="qty-btn">+</button>
                      </div>
                      <button type="button" onClick={() => removeFromCart(item.id)} className="btn-remove" title="Remove item">
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                    <div className="item-total">
                      {(item.price * item.quantity).toFixed(0)} VNĐ
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-sidebar">
                <div className="cart-summary">
                  <h3>Order Summary</h3>

                  <div className="checkout-form">
                    <div>
                      <label htmlFor="ship-name">Họ tên</label>
                      <input
                        id="ship-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nguyễn Văn A"
                        autoComplete="name"
                      />
                    </div>
                    <div>
                      <label htmlFor="ship-phone">Số điện thoại</label>
                      <input
                        id="ship-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="09xx xxx xxx"
                        autoComplete="tel"
                      />
                    </div>
                    <div>
                      <label htmlFor="ship-email">Email (tuỳ chọn)</label>
                      <input
                        id="ship-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        autoComplete="email"
                      />
                    </div>
                    <div>
                      <label htmlFor="ship-address">Địa chỉ giao hàng</label>
                      <input
                        id="ship-address"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Số nhà, đường, quận/huyện, tỉnh"
                        autoComplete="street-address"
                      />
                    </div>
                    <div>
                      <label htmlFor="pay-method">Thanh toán</label>
                      <select
                        id="pay-method"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      >
                        <option value="COD">COD (thanh toán khi nhận)</option>
                        <option value="VNPAY">VNPay</option>
                        <option value="MOMO">MoMo</option>
                      </select>
                    </div>
                  </div>

                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>{totalPrice.toFixed(0)} VNĐ</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <hr />
                  <div className="summary-row total">
                    <span>Total</span>
                    <span>{totalPrice.toFixed(0)} VNĐ</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="btn-primary btn-checkout"
                    disabled={submitting}
                  >
                    {submitting ? 'Đang xử lý…' : 'Proceed to Checkout'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
