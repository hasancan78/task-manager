import { precacheAndRoute } from 'workbox-precaching'

precacheAndRoute(self.__WB_MANIFEST)

const DB_NAME = 'taskflow-reminders'
const STORE_NAME = 'tasks'

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 2)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

async function getTasks() {
  const db = await openDB()
  const tx = db.transaction(STORE_NAME, 'readonly')
  const store = tx.objectStore(STORE_NAME)
  const request = store.getAll()
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function updateTask(taskId, updates) {
  const db = await openDB()
  const tx = db.transaction(STORE_NAME, 'readwrite')
  const store = tx.objectStore(STORE_NAME)
  const request = store.get(taskId)
  return new Promise((resolve) => {
    request.onsuccess = () => {
      const task = request.result
      if (task) {
        Object.assign(task, updates)
        store.put(task)
      }
      tx.oncomplete = () => resolve()
    }
  })
}

async function checkReminders() {
  try {
    const tasks = await getTasks()
    const now = Date.now()

    for (const task of tasks) {
      if (task.completed || !task.dueDate || !task.dueTime || !task.reminders) continue

      const dueDateTime = new Date(`${task.dueDate}T${task.dueTime}`).getTime()
      let hasChanges = false
      const updatedReminders = [...task.reminders]

      for (let i = 0; i < updatedReminders.length; i++) {
        const rem = updatedReminders[i]
        if (rem.notified) continue

        const reminderTime = dueDateTime - (rem.minutes * 60 * 1000)

        // 5 dakikalık bildirim penceresi
        if (now >= reminderTime && now < reminderTime + 5 * 60 * 1000) {
          await self.registration.showNotification('⏰ TaskFlow Hatırlatıcı', {
            body: rem.minutes > 0
              ? `"${task.title}" görevinize ${rem.minutes} dakika kaldı!`
              : `"${task.title}" görevinizin zamanı geldi!`,
            icon: '/pwa-192x192.png',
            badge: '/pwa-192x192.png',
            tag: `reminder-${task.id}-${rem.id}`,
            data: { taskId: task.id, url: '/' },
            vibrate: [200, 100, 200],
            requireInteraction: true,
            actions: [
              { action: 'open', title: '📋 Görevi Aç' },
              { action: 'done', title: '✅ Tamamlandı' },
            ]
          })
          
          updatedReminders[i] = { ...rem, notified: true }
          hasChanges = true
        }
      }

      if (hasChanges) {
        await updateTask(task.id, { reminders: updatedReminders })
      }
    }
  } catch (error) {
    console.error('Hatırlatıcı kontrolü hatası:', error)
  }
}

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'check-reminders') {
    event.waitUntil(checkReminders())
  }
})

self.addEventListener('sync', (event) => {
  if (event.tag === 'check-reminders') {
    event.waitUntil(checkReminders())
  }
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'done') {
    const taskId = event.notification.data?.taskId
    if (taskId) {
      event.waitUntil(updateTask(taskId, { completed: true }))
    }
    return
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus()
        }
      }
      return clients.openWindow(event.notification.data?.url || '/')
    })
  )
})

self.addEventListener('message', (event) => {
  if (event.data?.type === 'CHECK_REMINDERS') {
    event.waitUntil(checkReminders())
  }
})
