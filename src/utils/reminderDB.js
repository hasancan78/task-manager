// IndexedDB wrapper for task reminders
// Service Workers can't access localStorage, so we use IndexedDB

const DB_NAME = 'taskflow-reminders'
const STORE_NAME = 'tasks'
const SOUNDS_STORE = 'sounds' // New store
const DB_VERSION = 2 // Incremented

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains(SOUNDS_STORE)) {
        db.createObjectStore(SOUNDS_STORE, { keyPath: 'taskId' })
      }
    }
  })
}

export async function saveTasks(tasks) {
  const db = await openDB()
  const tx = db.transaction(STORE_NAME, 'readwrite')
  const store = tx.objectStore(STORE_NAME)
  store.clear()
  tasks.forEach(task => store.put(task))
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function getTasks() {
  const db = await openDB()
  const tx = db.transaction(STORE_NAME, 'readonly')
  const store = tx.objectStore(STORE_NAME)
  const request = store.getAll()
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// Rewrite markNotified to take taskId and reminderId
export async function markNotified(taskId, reminderId) {
  const db = await openDB()
  const tx = db.transaction(STORE_NAME, 'readwrite')
  const store = tx.objectStore(STORE_NAME)
  const request = store.get(taskId)
  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      const task = request.result
      if (task && task.reminders) {
        const rem = task.reminders.find(r => r.id === reminderId)
        if (rem) rem.notified = true
        store.put(task)
      }
      tx.oncomplete = () => resolve()
    }
    request.onerror = () => reject(request.error)
  })
}

export async function saveTaskSound(taskId, base64Sound) {
  const db = await openDB()
  const tx = db.transaction(SOUNDS_STORE, 'readwrite')
  const store = tx.objectStore(SOUNDS_STORE)
  store.put({ taskId, data: base64Sound })
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function getTaskSound(taskId) {
  const db = await openDB()
  const tx = db.transaction(SOUNDS_STORE, 'readonly')
  const store = tx.objectStore(SOUNDS_STORE)
  const request = store.get(taskId)
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result?.data || null)
    request.onerror = () => reject(request.error)
  })
}

export async function deleteTaskSound(taskId) {
  const db = await openDB()
  const tx = db.transaction(SOUNDS_STORE, 'readwrite')
  const store = tx.objectStore(SOUNDS_STORE)
  store.delete(taskId)
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}
