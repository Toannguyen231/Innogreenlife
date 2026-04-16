import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyEmail from './pages/VerifyEmail'
import AdminDashboard from './pages/AdminDashboard'
import OrderHistory from './pages/OrderHistory'
import PaymentResult from './pages/PaymentResult'
import Toast from './components/Toast'
import Chatbot from './components/Chatbot'
import { ToastProvider } from './context/ToastContext'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/product" element={<Navigate to="/" replace />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/payment" element={<PaymentResult />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
          <Chatbot />
          <Toast />
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
