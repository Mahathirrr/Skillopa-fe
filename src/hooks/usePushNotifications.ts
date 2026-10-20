import { useCallback, useState } from 'react'

import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  const arr = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i)
  return arr
}

export function usePushNotifications() {
  const { token, isAuthenticated } = useAuthStore()
  const [status, setStatus] = useState<'idle' | 'loading' | 'subscribed' | 'unsupported' | 'denied'>('idle')
  const [error, setError] = useState('')

  const subscribe = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setError('Sign in to enable notifications')
      return false
    }
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setStatus('unsupported')
      return false
    }

    const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined
    if (!vapidKey) {
      setError('Push notifications are not configured')
      return false
    }

    setStatus('loading')
    setError('')

    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        setStatus('denied')
        return false
      }

      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      })

      const json = subscription.toJSON()
      await api.subscribePush(token, {
        endpoint: json.endpoint!,
        p256dh: json.keys!.p256dh!,
        auth: json.keys!.auth!,
      })

      setStatus('subscribed')
      return true
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to subscribe')
      setStatus('idle')
      return false
    }
  }, [isAuthenticated, token])

  const unsubscribe = useCallback(async () => {
    if (!token) return
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      if (subscription) {
        await api.unsubscribePush(token, subscription.endpoint)
        await subscription.unsubscribe()
      }
      setStatus('idle')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to unsubscribe')
    }
  }, [token])

  return { status, error, subscribe, unsubscribe }
}
