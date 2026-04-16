import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import './Auth.css'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const { user, register } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true })
    }
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !email || !password || !confirmPassword) {
      showToast('Please fill in all fields', 'error')
      return
    }
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error')
      return
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error')
      return
    }
    try {
      setSubmitting(true)
      await register({ name, email, password })
      setIsRegistered(true)
      showToast('Registration successful! Please check your email.', 'success')
    } catch (error) {
      showToast(error.message || 'Registration failed', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (isRegistered) {
    return (
      <>
        <Header />
        <main className="auth-page">
          <div className="auth-container">
            <div className="auth-card text-center" style={{ textAlign: 'center' }}>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600" style={{ width: '64px', height: '64px', margin: '0 auto 24px' }}>
                <i className="fa-solid fa-paper-plane text-2xl" style={{ fontSize: '24px' }}></i>
              </div>
              <h1 className="text-2xl font-bold mb-4">Check Your Email!</h1>
              <p className="text-gray-600 mb-8">
                We've sent a verification link to <strong>{email}</strong>. 
                Please click the link in the email to activate your account.
              </p>
              <div className="auth-footer mt-6">
                <Link to="/login" className="btn-auth inline-block" style={{ textDecoration: 'none' }}>
                  Return to Login
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h1>Create Account</h1>
              <p>Join MAN-UP and start shopping</p>
            </div>
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your Gmail"
                  pattern="[a-zA-Z0-9._%+-]+@gmail\.com"
                  title="Please enter a Gmail address (example@gmail.com)"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                />
              </div>
              <button type="submit" className="btn-auth" disabled={submitting}>
                {submitting ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
            <div className="auth-footer">
              <p>Already have an account? <Link to="/login">Sign in</Link></p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}