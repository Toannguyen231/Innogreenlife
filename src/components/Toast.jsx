import { useToast } from '../context/ToastContext'

export default function Toast() {
  const { message, type, visible } = useToast()

  return (
    <div className={`toast toast-${type}${visible ? ' show' : ''}`}>
      <i className={`fa-solid ${type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check'}`}></i>
      <span>{message}</span>
    </div>
  )
}
