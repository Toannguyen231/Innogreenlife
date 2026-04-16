import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { API_ENDPOINTS } from '../config/api'
import Header from '../components/Header'

export default function VerifyEmail() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('verifying') // verifying, success, error
  const [message, setMessage] = useState('Đang xác thực tài khoản của bạn...')

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.verifyEmail(token))
        const data = await response.json()

        if (response.ok) {
          setStatus('success')
          setMessage(data.message)
        } else {
          setStatus('error')
          setMessage(data.message || 'Xác thực thất bại.')
        }
      } catch (error) {
        setStatus('error')
        setMessage('Đã xảy ra lỗi khi kết nối với máy chủ.')
      }
    }

    if (token) {
      verify()
    }
  }, [token])

  return (
    <div className="min-h-screen bg-[#fffdf5]">
      <Header />
      <div className="flex items-center justify-center pt-32 px-4">
        <div className="max-width-600 w-full bg-white p-10 rounded-2xl shadow-sm text-center border border-[#eee]">
          {status === 'verifying' && (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f8c12d] mb-4"></div>
              <p className="text-gray-600">{message}</p>
            </div>
          )}

          {status === 'success' && (
            <div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                <i className="fa-solid fa-check text-2xl"></i>
              </div>
              <h2 className="text-2xl font-bold mb-4">Xác thực thành công!</h2>
              <p className="text-gray-600 mb-8">{message}</p>
              <Link
                to="/login"
                className="inline-block bg-[#333] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all"
              >
                Đăng nhập ngay
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
                <i className="fa-solid fa-xmark text-2xl"></i>
              </div>
              <h2 className="text-2xl font-bold mb-4">Xác thực thất bại</h2>
              <p className="text-gray-600 mb-8">{message}</p>
              <Link
                to="/register"
                className="text-[#f8c12d] font-bold hover:underline"
              >
                Thử đăng ký lại
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
