import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { API_ENDPOINTS } from '../config/api'
import './Chatbot.css'

const QUICK_REPLIES = [
  'Tìm kiếm sản phẩm',
  'Hướng dẫn đặt hàng',
  'Chính sách đổi trả',
  'Liên hệ hỗ trợ'
]

const TypingIndicator = () => (
  <div className="chatbot-typing">
    <div className="chatbot-typing-bubble">
      <div className="typing-dots">
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
      </div>
    </div>
  </div>
)

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Xin chào! 👋 Tôi là trợ lý hỗ trợ của MAN-UP. Bạn cần giúp gì hôm nay?', time: new Date() }
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [aiTyping, setAiTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const { user } = useAuth()

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const addMessage = (text, type = 'user') => {
    const newMsg = { id: Date.now(), type, text, time: new Date() }
    setMessages(prev => [...prev, newMsg])
    setTimeout(scrollToBottom, 100)
    return newMsg
  }

  const handleSend = async () => {
    if (!input.trim() || sending) return
    const userMsg = input.trim()
    setInput('')
    setSending(true)

    addMessage(userMsg, 'user')

    try {
      setAiTyping(true)
      const response = await fetch(API_ENDPOINTS.chat, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMsg,
          user: {
            name: user?.name,
            email: user?.email
          }
        })
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(data.message || 'Lỗi kết nối chatbot')
      }

      addMessage(data.reply || 'Xin lỗi, hiện tôi chưa trả lời được. Vui lòng thử lại.', 'bot')
    } catch (error) {
      console.error('Chatbot error:', error)
      addMessage('Xin lỗi, hiện không thể trả lời. Vui lòng thử lại sau.', 'bot')
    } finally {
      setSending(false)
      setAiTyping(false)
    }
  }

  const handleQuickReply = (text) => {
    setInput(text)
    handleSend()
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <>
      <button
        className={`chatbot-fab ${isOpen ? 'hidden' : ''}`}
        onClick={() => setIsOpen(true)}
        aria-label="Mở hỗ trợ khách hàng"
      >
        <i className="fa-solid fa-headset"></i>
        <span className="chatbot-fab-badge">Hỗ trợ</span>
      </button>

      <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <div className="chatbot-header-info">
            <div className="chatbot-avatar">
              <img src="/img/logo-final-removebg-preview.png" alt="Logo" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
            </div>
            <div>
              <h3>MAN-UP Support</h3>
              <span><span className="chatbot-status-dot"></span> Online</span>
            </div>
          </div>
          <button className="chatbot-close" onClick={() => setIsOpen(false)} aria-label="Đóng">
            <i className="fa-solid fa-chevron-down"></i>
          </button>
        </div>

        <div className="chatbot-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`chatbot-message ${msg.type}`}>
              <div className="chatbot-bubble">{msg.text}</div>
              <span className="chatbot-time">{formatTime(msg.time)}</span>
            </div>
          ))}
          {aiTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {messages.length <= 1 && (
          <div className="chatbot-quick-replies">
            {QUICK_REPLIES.map((reply, idx) => (
              <button key={idx} onClick={() => handleQuickReply(reply)} className="quick-reply-btn">
                {reply}
              </button>
            ))}
          </div>
        )}

        <div className="chatbot-input-area">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tin nhắn..."
            rows={1}
          />
          <button
            className="chatbot-send"
            onClick={handleSend}
            disabled={!input.trim() || sending}
            aria-label="Gửi tin nhắn"
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>

        {user && (
          <div className="chatbot-user-badge">
            <i className="fa-solid fa-user"></i> {user.name || user.email}
          </div>
        )}
      </div>
    </>
  )
}