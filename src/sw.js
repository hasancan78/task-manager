import { precacheAndRoute } from 'workbox-precaching'

// Varlıkları önbelleğe al
precacheAndRoute(self.__WB_MANIFEST)

// IndexedDB erişimi
const DB_NAME = 'taskflow-reminders'
const STORE_NAME = 'tasks'

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
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

// Hatırlatıcıları kontrol et
async function checkReminders() {
  try {
    const tasks = await getTasks()
    const now = Date.now()

    for (const task of tasks) {
      if (task.completed || task.notified || !task.dueDate || !task.dueTime) continue

      const dueDateTime = new Date(`${task.dueDate}T${task.dueTime}`).getTime()
      const reminderMinutes = task.reminderMinutes || 0
      const reminderTime = dueDateTime - (reminderMinutes * 60 * 1000)

      // 5 dakikalık bildirim penceresi
      if (now >= reminderTime && now < reminderTime + 5 * 60 * 1000) {
        await self.registration.showNotification('⏰ TaskFlow Hatırlatıcı', {
          body: reminderMinutes > 0
            ? `"${task.title}" görevinize ${reminderMinutes} dakika kaldı!`
            : `"${task.title}" görevinizin zamanı geldi!`,
          icon: '/pwa-192x192.png',
          badge: '/pwa-192x192.png',
          tag: `reminder-${task.id}`,
          data: { taskId: task.id, url: '/' },
          vibrate: [200, 100, 200],
          requireInteraction: true,
          actions: [
            { action: 'open', title: '📋 Görevi Aç' },
            { action: 'done', title: '✅ Tamamlandı' },
          ]
        })
        await updateTask(task.id, { notified: true })
      }
    }
  } catch (error) {
    console.error('Hatırlatıcı kontrolü hatası:', error)
  }
}

// Periyodik arka plan senkronizasyonu
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'check-reminders') {
    event.waitUntil(checkReminders())
  }
})

// Tek seferlik sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'check-reminders') {
    event.waitUntil(checkReminders())
  }
})

// Bildirime tıklandığında
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'done') {
    const taskId = event.notification.data?.taskId
    if (taskId) {
      event.waitUntil(updateTask(taskId, { completed: true }))
    }
    return
  }

  // Uygulamayı aç veya odakla
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

// Ana uygulamadan gelen mesajlar
self.addEventListener('message', (event) => {
  if (event.data?.type === 'CHECK_REMINDERS') {
    event.waitUntil(checkReminders())
  }
})
