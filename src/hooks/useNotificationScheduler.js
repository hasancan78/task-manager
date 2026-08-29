import { useEffect, useRef, useCallback, useState } from 'react'
import { saveTasks, markNotified as markNotifiedDB, getTaskSound } from '../utils/reminderDB'
import { playNotificationSound } from '../utils/notificationSound'

export function useNotificationScheduler(tasks, setTasks) {
  const intervalRef = useRef(null)
  const [permissionStatus, setPermissionStatus] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'denied'
  )

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return 'denied'
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

  const playCustomSound = async (taskId) => {
    try {
      const base64Audio = await getTaskSound(taskId)
      if (base64Audio) {
        const audio = new Audio(base64Audio)
        await audio.play()
        return true
      }
    } catch (e) {
      console.warn("Özel ses çalınamadı:", e)
    }
    return false
  }

  const showNotification = useCallback(async (task, reminder) => {
    if (Notification.permission !== 'granted') return

    const title = '⏰ TaskFlow Hatırlatıcı'
    const body = reminder.minutes > 0
      ? `"${task.title}" görevinize ${reminder.minutes} dakika kaldı!`
      : `"${task.title}" görevinizin zamanı geldi!`

    const options = {
      body,
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      tag: `reminder-${task.id}-${reminder.id}`,
      vibrate: [200, 100, 200],
      requireInteraction: true,
    }

    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, options)
      })
    } else {
      new Notification(title, options)
    }

    // Ses Çalma Mantığı (Özel ses yoksa veya çalınamazsa standart sesi çal)
    const playedCustom = await playCustomSound(task.id)
    if (!playedCustom) {
      playNotificationSound()
    }
  }, [])

  const checkReminders = useCallback(() => {
    const now = Date.now()
    let hasChanges = false

    const updatedTasks = tasks.map(task => {
      if (task.completed || !task.dueDate || !task.dueTime || !task.reminders || task.reminders.length === 0) return task

      const dueDateTime = new Date(`${task.dueDate}T${task.dueTime}`).getTime()
      
      const updatedReminders = task.reminders.map(rem => {
        if (rem.notified) return rem
        
        const reminderTime = dueDateTime - (rem.minutes * 60 * 1000)
        
        // 5 dakikalık bildirim penceresi
        if (now >= reminderTime && now < reminderTime + 5 * 60 * 1000) {
          showNotification(task, rem)
          markNotifiedDB(task.id, rem.id)
          hasChanges = true
          return { ...rem, notified: true }
        }
        return rem
      })

      // Eğer reminders dizisi değiştiyse referansı güncelle
      if (JSON.stringify(updatedReminders) !== JSON.stringify(task.reminders)) {
        return { ...task, reminders: updatedReminders }
      }
      
      return task
    })

    if (hasChanges) {
      setTasks(updatedTasks)
    }
  }, [tasks, setTasks, showNotification])

  useEffect(() => {
    saveTasks(tasks).catch(err => console.warn('IndexedDB sync hatası:', err))
  }, [tasks])

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(async (registration) => {
        if ('periodicSync' in registration) {
          try {
            await registration.periodicSync.register('check-reminders', {
              minInterval: 60 * 1000,
            })
          } catch (error) {
            console.log('Periodic sync hatası (normal):', error)
          }
        }
      })
    }
  }, [])

  useEffect(() => {
    checkReminders()
    intervalRef.current = setInterval(checkReminders, 30000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [checkReminders])

  const getMissedReminders = useCallback(() => {
    const now = Date.now()
    return tasks.filter(task => {
      if (task.completed || !task.dueDate || !task.dueTime || !task.reminders) return false
      const dueDateTime = new Date(`${task.dueDate}T${task.dueTime}`).getTime()
      
      return task.reminders.some(rem => {
        if (rem.notified) return false
        const reminderTime = dueDateTime - (rem.minutes * 60 * 1000)
        return now > reminderTime + 5 * 60 * 1000 // 5 dakikalık pencere kaçmışsa
      })
    })
  }, [tasks])

  return {
    requestPermission,
    permissionStatus,
    hasNotificationSupport: typeof Notification !== 'undefined',
    getMissedReminders,
  }
}
