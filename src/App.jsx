import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Toast from './components/Toast'
import { ToastProvider } from './context/ToastContext'

function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<ProductDetail />} />
      </Routes>
      <Toast />
    </ToastProvider>
  )
}

export default App
