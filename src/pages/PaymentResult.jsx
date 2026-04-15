import { Link, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './PaymentResult.css'

export default function PaymentResult() {
    const { state } = useLocation()
    const paymentInfo = state?.paymentInfo
    const orderId = state?.orderId

    return (
        <>
            <Header />
            <main className="payment-result-page">
                <div className="payment-result-container">
                    <h1>Thanh toán</h1>
                    {!paymentInfo ? (
                        <div className="payment-empty">
                            <p>Không tìm thấy thông tin thanh toán.</p>
                            <Link to="/" className="btn-primary">Về trang chủ</Link>
                        </div>
                    ) : (
                        <div className="payment-card">
                            <p className="payment-note">Đây là hướng dẫn thanh toán demo. Thực tế bạn có thể tích hợp cổng VNPay hoặc MoMo để xử lý giao dịch.</p>
                            <p><strong>Order ID:</strong> {orderId || 'N/A'}</p>
                            <p><strong>Phương thức:</strong> {paymentInfo.method}</p>
                            <p>{paymentInfo.message}</p>
                            {paymentInfo.paymentUrl && (
                                <p>
                                    <a href={paymentInfo.paymentUrl} target="_blank" rel="noreferrer" className="btn-primary">Mở trang thanh toán</a>
                                </p>
                            )}
                            {paymentInfo.qrCodeUrl && (
                                <div className="qr-box">
                                    <img src={paymentInfo.qrCodeUrl} alt="QR Payment" />
                                </div>
                            )}
                            <Link to="/orders" className="btn-secondary">Xem lịch sử đơn hàng</Link>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    )
}
