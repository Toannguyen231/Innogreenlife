import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'
import { API_ENDPOINTS } from '../config/api'
import './OrderHistory.css'

export default function OrderHistory() {
    const { user, token, loading } = useAuth()
    const navigate = useNavigate()
    const { showToast } = useToast()
    const [orders, setOrders] = useState([])
    const [loadingOrders, setLoadingOrders] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login')
        }
    }, [loading, user, navigate])

    useEffect(() => {
        if (!token) return

        const loadOrders = async () => {
            setLoadingOrders(true)
            setError('')
            try {
                const res = await fetch(API_ENDPOINTS.ordersMe, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                const data = await res.json().catch(() => ({}))
                if (!res.ok) {
                    throw new Error(data.message || 'Không thể tải đơn hàng')
                }

                setOrders(data)
            } catch (e) {
                setError(e.message || 'Lỗi khi tải đơn hàng')
                showToast(e.message || 'Lỗi khi tải đơn hàng', 'error')
            } finally {
                setLoadingOrders(false)
            }
        }

        loadOrders()
    }, [token, showToast])

    return (
        <>
            <Header />
            <main className="order-history-page">
                <div className="container-order-history">
                    <h1>Lịch sử đơn hàng</h1>
                    {loadingOrders ? (
                        <p>Đang tải đơn hàng…</p>
                    ) : error ? (
                        <p className="order-history-error">{error}</p>
                    ) : orders.length === 0 ? (
                        <div className="order-history-empty">
                            <p>Bạn chưa có đơn hàng nào.</p>
                            <Link to="/" className="btn-primary">Tiếp tục mua sắm</Link>
                        </div>
                    ) : (
                        <div className="orders-list">
                            {orders.map((order) => (
                                <div className="order-card" key={order._id}>
                                    <div className="order-card-header">
                                        <div>
                                            <h2>Đơn hàng #{order._id.slice(-6)}</h2>
                                            <p>Ngày: {new Date(order.createdAt).toLocaleString('vi-VN')}</p>
                                        </div>
                                        <span className={`status-badge status-${order.status.toLowerCase()}`}>{order.status}</span>
                                    </div>
                                    <div className="order-card-body">
                                        <p><strong>Thanh toán:</strong> {order.paymentMethod}</p>
                                        <p><strong>Tổng tiền:</strong> {order.totalAmount?.toLocaleString('vi-VN')} VNĐ</p>
                                        <p><strong>Địa chỉ:</strong> {order.customerDetail?.address}</p>
                                        <div className="order-items">
                                            {order.items.map((item) => (
                                                <div key={`${order._id}-${item.idClient}`} className="order-item">
                                                    <img src={item.image} alt={item.title} />
                                                    <div>
                                                        <p>{item.title}</p>
                                                        <p>{item.quantity} x ${item.price.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    )
}
