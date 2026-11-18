import { useEffect } from 'react'
import { useNotificationStore } from '@/store/notificationStore'

export default function Toast() {
  const { message, visible, hideNotification } = useNotificationStore()

  useEffect(() => {
    if (!visible) return
    const timeout = window.setTimeout(hideNotification, 3000)
    return () => window.clearTimeout(timeout)
  }, [visible, message, hideNotification])

  if (!visible) return null

  return (
    <div className="fixed bottom-6 right-6 z-[100] rounded-lg bg-gray-900 px-5 py-3 text-white shadow-xl">
      {message}
    </div>
  )
}
