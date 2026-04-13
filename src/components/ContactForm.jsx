import { useState, useRef } from 'react'
import { useFadeIn } from '../hooks/useFadeIn'
import { useToast } from '../context/ToastContext'
import './ContactForm.css'

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

export default function ContactForm() {
  const ref = useFadeIn()
  const { showToast } = useToast()
  const btnRef = useRef(null)

  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setSending(true)

    setTimeout(() => {
      setSent(true)
      setSending(false)
      showToast("Message sent! We'll be in touch soon 🥭")
      setTimeout(() => {
        setSent(false)
        setForm({ name: '', email: '', message: '' })
      }, 3000)
    }, 1200)
  }

  const btnLabel = sending ? 'Sending…' : sent ? '✓ Sent!' : 'Send Message'

  return (
    <section className="contact" id="contact">
      <div className="wrap">
        <div className="contact-inner fi" ref={ref}>
          <span className="tag">Get in Touch</span>
          <h2 className="stitle">Order Your Snacks</h2>
          <p className="stxt contact-sub">
            Ready to taste the difference? Contact us to place your order or learn more about our products.
          </p>

          <form className="cform" onSubmit={handleSubmit}>
            <div className="row2">
              <div className="fg">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="fg">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="fg">
              <textarea
                name="message"
                placeholder="Your Message"
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>
            <button
              ref={btnRef}
              type="submit"
              className={`btn-send${sent ? ' sent' : ''}`}
              disabled={sending || sent}
              onClick={addRipple}
            >
              <span>{btnLabel}</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
