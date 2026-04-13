import { useToast } from '../context/ToastContext'

export default function Toast() {
  const { message, visible } = useToast()

  return (
    <div className={`toast${visible ? ' show' : ''}`}>
      <i className="fa-solid fa-circle-check"></i>
      <span>{message}</span>
    </div>
  )
}
