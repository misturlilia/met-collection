import { useState, useEffect } from 'react'

export function NetworkStatus({ onReconnect }) {
  const [isOnline, setIsOnline] = useState(() => 
    typeof navigator !== 'undefined' ? navigator.onLine : true
  )

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      if (onReconnect) onReconnect()
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [onReconnect])

  if (isOnline) return null

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        position: 'fixed',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#dc2626',
        color: '#ffffff',
        padding: '10px 20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: 9999,
        fontWeight: 'bold',
        fontSize: '0.95rem',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      <span>Немає з'єднання з інтернетом</span>
    </div>
  )
}