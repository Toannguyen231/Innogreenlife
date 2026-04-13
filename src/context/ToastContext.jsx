import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [message, setMessage] = useState('')
  const [visible, setVisible] = useState(false)

  const showToast = useCallback((msg) => {
    setMessage(msg)
    setVisible(true)
    setTimeout(() => setVisible(false), 4000)
  }, [])

  return (
    <ToastContext.Provider value={{ message, visible, showToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
