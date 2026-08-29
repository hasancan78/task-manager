import { useEffect, useRef, useCallback, useState } from 'react'
import { saveTasks, markNotified as markNotifiedDB } from '../utils/reminderDB'
import { playNotificationSound } from '../utils/notificationSound'

export function useNotificationScheduler(tasks, setTasks) {
  const intervalRef = useRef(null)
  const [permissionStatus, setPermissionStatus] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'denied'
  )

  // Bildirim izni iste
  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.warn('Bu tarayıcı bildirimleri desteklemiyor')
      return 'denied'
    }
    if (Notification.permission === 'granted') {
      setPermissionStatus('granted')
      return 'granted'
    }
    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission()
      setPermissionStatus(permission)
      return permission
    }
    return Notification.permission
  }, [])

  // Bildirim göster
  const showNotification = useCallback((task, reminderMinutes) => {
    if (Notification.permission !== 'granted') return

    const title = '⏰ TaskFlow Hatırlatıcı'
    const body = reminderMinutes > 0
      ? `"${task.title}" görevinize ${reminderMinutes} dakika kaldı!`
      : `"${task.title}" görevinizin zamanı geldi!`

    const options = {
      body,
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      tag: `reminder-${task.id}`,
      vibrate: [200, 100, 200],
      requireInteraction: true,
    }

    // Service worker üzerinden bildirim (arka planda da çalışır)
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, options)
      })
    } else {
      new Notification(title, options)
    }

    // Ses çal
    playNotificationSound()
  }, [])

  // Hatırlatıcıları kontrol et
  const checkReminders = useCallback(() => {
    const now = Date.now()
    let hasChanges = false

    const updatedTasks = tasks.map(task => {
      if (task.completed || task.notified || !task.dueDate || !task.dueTime) return task

      const dueDateTime = new Date(`${task.dueDate}T${task.dueTime}`).getTime()
      const reminderMinutes = task.reminderMinutes || 0
      const reminderTime = dueDateTime - (reminderMinutes * 60 * 1000)

      // 5 dakikalık bildirim penceresi içindeyse
      if (now >= reminderTime && now < reminderTime + 5 * 60 * 1000) {
        showNotification(task, reminderMinutes)
        markNotifiedDB(task.id)
        hasChanges = true
        return { ...task, notified: true }
      }

      return task
    })

    if (hasChanges) {
      setTasks(updatedTasks)
    }
  }, [tasks, setTasks, showNotification])

  // Görevler değiştiğinde IndexedDB'ye yaz
  useEffect(() => {
    saveTasks(tasks).catch(err => console.warn('IndexedDB sync hatası:', err))
  }, [tasks])

  // Periodic sync kaydı (PWA kuruluysa arka planda çalışır)
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(async (registration) => {
        if ('periodicSync' in registration) {
          try {
            await registration.periodicSync.register('check-reminders', {
              minInterval: 60 * 1000,
            })
          } catch (error) {
            console.log('Periodic sync kaydı başarısız (normal):', error)
          }
        }
      })
    }
  }, [])

  // Her 30 saniyede kontrol et
  useEffect(() => {
    checkReminders()
    intervalRef.current = setInterval(checkReminders, 30000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [checkReminders])

  // Kaçırılan hatırlatıcıları kontrol et (uygulama ilk açıldığında)
  const getMissedReminders = useCallback(() => {
    const now = Date.now()
    return tasks.filter(task => {
      if (task.completed || task.notified || !task.dueDate || !task.dueTime) return false
      const dueDateTime = new Date(`${task.dueDate}T${task.dueTime}`).getTime()
      const reminderMinutes = task.reminderMinutes || 0
      const reminderTime = dueDateTime - (reminderMinutes * 60 * 1000)
      return now > reminderTime + 5 * 60 * 1000
    })
  }, [tasks])

  return {
    requestPermission,
    permissionStatus,
    hasNotificationSupport: typeof Notification !== 'undefined',
    getMissedReminders,
  }
}
