import { useState, useRef } from 'react'
import { useFadeIn } from '../hooks/useFadeIn'
import { useToast } from '../context/ToastContext'
import { API_ENDPOINTS } from '../config/api'
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
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i
  const ref = useFadeIn()
  const { showToast } = useToast()
  const btnRef = useRef(null)

  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!gmailRegex.test(form.email.trim())) {
      showToast('Please enter a valid Gmail address', 'error')
      return
    }
    setSending(true)

    try {
      const res = await fetch(API_ENDPOINTS.contact, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.message || 'Could not send message')
      }
      setSent(true)
      showToast("Message sent! We'll be in touch soon.", 'success')
      setTimeout(() => {
        setSent(false)
        setForm({ name: '', email: '', message: '' })
      }, 3000)
    } catch (err) {
      showToast(err.message || 'Could not send message', 'error')
    } finally {
      setSending(false)
    }
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
                  placeholder="Gmail Address"
                  value={form.email}
                  onChange={handleChange}
                  pattern="[a-zA-Z0-9._%+-]+@gmail\.com"
                  title="Please enter a Gmail address (example@gmail.com)"
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
