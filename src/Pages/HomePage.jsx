import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useNotificationScheduler } from '../hooks/useNotificationScheduler'
import { saveTaskSound, getTaskSound, deleteTaskSound } from '../utils/reminderDB'
import { FILTERS, PRIORITIES, CATEGORIES, REMINDER_OPTIONS } from '../Interfaces/taskTypes'
import Navbar from '../Components/Navbar'
import TaskForm from '../Components/TaskForm'
import TaskList from '../Components/TaskList'
import SearchFilter from '../Components/SearchFilter'
import StatsBar from '../Components/StatsBar'
import EmptyState from '../Components/EmptyState'
import Modal from '../Components/Modal'

export default function HomePage({ isInstallable, installApp }) {
  const [tasks, setTasks] = useLocalStorage('taskflow-tasks', [])
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState(FILTERS.ALL)
  const [editingTask, setEditingTask] = useState(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  // Edit form state
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editPriority, setEditPriority] = useState('medium')
  const [editCategory, setEditCategory] = useState('personal')
  const [editDueDate, setEditDueDate] = useState('')
  const [editDueTime, setEditDueTime] = useState('')
  const [editReminders, setEditReminders] = useState([])
  const [editSoundBase64, setEditSoundBase64] = useState(null)
  const [newReminderValue, setNewReminderValue] = useState(0)

  // Bildirim sistemi
  const {
    requestPermission,
    permissionStatus,
    hasNotificationSupport,
    getMissedReminders,
  } = useNotificationScheduler(tasks, setTasks)

  const [showMissedBanner, setShowMissedBanner] = useState(false)
  const missedReminders = getMissedReminders()

  useEffect(() => {
    if (missedReminders.length > 0) {
      setShowMissedBanner(true)
    }
  }, [missedReminders.length])

  useEffect(() => {
    if (hasNotificationSupport && Notification.permission === 'default') {
      const timer = setTimeout(() => {
        requestPermission()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [hasNotificationSupport, requestPermission])

  const addTask = async (taskData, soundBase64) => {
    const newTask = {
      id: uuidv4(),
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
    }
    setTasks([newTask, ...tasks])
    
    if (soundBase64) {
      await saveTaskSound(newTask.id, soundBase64)
    }
  }

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const openEditModal = async (task) => {
    setEditingTask(task)
    setEditTitle(task.title)
    setEditDescription(task.description)
    setEditPriority(task.priority)
    setEditCategory(task.category)
    setEditDueDate(task.dueDate || '')
    setEditDueTime(task.dueTime || '')
    setEditReminders(task.reminders ? [...task.reminders] : [])
    
    const sound = await getTaskSound(task.id)
    setEditSoundBase64(sound)
  }

  const handleEditSoundUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setEditSoundBase64(ev.target.result)
    reader.readAsDataURL(file)
  }

  const saveEdit = async () => {
    if (!editTitle.trim()) return
    
    setTasks(tasks.map(t =>
      t.id === editingTask.id
        ? {
            ...t,
            title: editTitle.trim(),
            description: editDescription.trim(),
            priority: editPriority,
            category: editCategory,
            dueDate: editDueDate,
            dueTime: editDueTime,
            // Düzenleme sonrası hepsini sıfırla ki tekrar hatırlatsın
            reminders: editDueDate && editDueTime ? editReminders.map(r => ({ ...r, notified: false })) : [],
          }
        : t
    ))
    
    if (editSoundBase64) {
      await saveTaskSound(editingTask.id, editSoundBase64)
    } else {
      await deleteTaskSound(editingTask.id)
    }
    
    setEditingTask(null)
  }

  const confirmDelete = (id) => {
    setDeleteConfirmId(id)
  }

  const deleteTask = async () => {
    setTasks(tasks.filter(t => t.id !== deleteConfirmId))
    await deleteTaskSound(deleteConfirmId)
    setDeleteConfirmId(null)
  }

  const dismissMissed = () => {
    const missedIds = missedReminders.map(t => t.id)
    setTasks(tasks.map(t => {
      if (missedIds.includes(t.id)) {
        return {
          ...t,
          reminders: t.reminders.map(r => ({ ...r, notified: true }))
        }
      }
      return t
    }))
    setShowMissedBanner(false)
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      filter === FILTERS.ALL ? true :
      filter === FILTERS.ACTIVE ? !task.completed :
      task.completed
    return matchesSearch && matchesFilter
  })

  return (
    <>
      <Navbar
        onInstall={installApp}
        isInstallable={isInstallable}
        onRequestPermission={requestPermission}
        permissionStatus={permissionStatus}
        hasNotificationSupport={hasNotificationSupport}
      />
      <main className="pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl sm:text-5xl font-bold text-white">
              Görevlerim
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 mx-auto rounded-full" />
            <p className="text-gray-400 text-lg">Günlük görevlerinizi organize edin ve takip edin</p>
          </div>

          {showMissedBanner && missedReminders.length > 0 && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 animate-in">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">⚠️</span>
                  <div>
                    <h3 className="text-amber-400 font-semibold">Kaçırılan Hatırlatıcılar ({missedReminders.length})</h3>
                    <ul className="mt-1 space-y-1">
                      {missedReminders.slice(0, 5).map(task => (
                        <li key={task.id} className="text-sm text-amber-300/80">
                          • {task.title} — {task.dueDate} {task.dueTime}
                        </li>
                      ))}
                      {missedReminders.length > 5 && (
                        <li className="text-sm text-amber-300/60">...ve {missedReminders.length - 5} tane daha</li>
                      )}
                    </ul>
                  </div>
                </div>
                <button
                  onClick={dismissMissed}
                  className="shrink-0 px-3 py-1.5 text-xs bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 transition-colors"
                >
                  Kapat
                </button>
              </div>
            </div>
          )}

          <StatsBar tasks={tasks} />

          <TaskForm onAddTask={addTask} />

          {tasks.length > 0 && (
            <SearchFilter
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filter={filter}
              setFilter={setFilter}
            />
          )}

          {filteredTasks.length > 0 ? (
            <TaskList
              tasks={filteredTasks}
              onToggle={toggleTask}
              onEdit={openEditModal}
              onDelete={confirmDelete}
            />
          ) : tasks.length > 0 ? (
            <div className="text-center py-12">
              <span className="text-4xl mb-3 block">🔍</span>
              <p className="text-gray-400">Aramanızla eşleşen görev bulunamadı</p>
            </div>
          ) : (
            <EmptyState />
          )}

          {/* Edit Modal */}
          <Modal
            isOpen={!!editingTask}
            onClose={() => setEditingTask(null)}
            title="Görevi Düzenle"
          >
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Görev Başlığı</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Açıklama</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300 resize-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Öncelik</label>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500/50 transition-all duration-300 appearance-none"
                  >
                    {Object.values(PRIORITIES).map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Kategori</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500/50 transition-all duration-300 appearance-none"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Hatırlatıcı Ayarları (Edit Modal) */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <span>🔔</span> Hatırlatıcı Ayarları
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Bitiş Tarihi</label>
                    <input
                      type="date"
                      value={editDueDate}
                      onChange={(e) => setEditDueDate(e.target.value)}
                      className="w-full px-3 py-2.5 bg-gray-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none [color-scheme:dark]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Saat</label>
                    <input
                      type="time"
                      value={editDueTime}
                      onChange={(e) => setEditDueTime(e.target.value)}
                      disabled={!editDueDate}
                      className="w-full px-3 py-2.5 bg-gray-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none disabled:opacity-40 [color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* Hatırlatıcı Ekleme */}
                <div className="pt-2">
                  <label className="block text-xs text-gray-400 mb-1.5">Hatırlatıcı Ekle</label>
                  <div className="flex gap-2">
                    <select
                      value={newReminderValue}
                      onChange={(e) => setNewReminderValue(Number(e.target.value))}
                      disabled={!editDueDate || !editDueTime}
                      className="flex-1 px-3 py-2 bg-gray-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none disabled:opacity-40"
                    >
                      {REMINDER_OPTIONS.filter(r => r.value >= 0).map((r) => (
                        <option key={r.value} value={r.value}>{r.icon} {r.label}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      disabled={!editDueDate || !editDueTime}
                      onClick={() => {
                        if (!editReminders.find(r => r.minutes === newReminderValue)) {
                          setEditReminders([...editReminders, { id: uuidv4(), minutes: newReminderValue, notified: false }])
                        }
                      }}
                      className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg disabled:opacity-40 text-sm font-medium transition-colors"
                    >
                      Ekle
                    </button>
                  </div>
                </div>

                {/* Eklenen Hatırlatıcılar Listesi */}
                {editReminders.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {editReminders.map(rem => {
                      const info = REMINDER_OPTIONS.find(r => r.value === rem.minutes)
                      return (
                        <span key={rem.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300">
                          {info ? info.label : `${rem.minutes} dk önce`}
                          <button
                            type="button"
                            onClick={() => setEditReminders(editReminders.filter(r => r.id !== rem.id))}
                            className="text-rose-400 hover:text-rose-300 ml-1 font-bold"
                          >
                            ×
                          </button>
                        </span>
                      )
                    })}
                  </div>
                )}

                {/* Özel Ses Yükleme */}
                <div className="pt-2">
                  <label className="block text-xs text-gray-400 mb-1.5">Özel Alarm Sesi (Opsiyonel)</label>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleEditSoundUpload}
                    className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-violet-500/20 file:text-violet-400 hover:file:bg-violet-500/30 transition-all cursor-pointer"
                  />
                  {editSoundBase64 && (
                    <div className="mt-2 flex items-center justify-between text-xs text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-lg border border-emerald-500/20">
                      <span className="flex items-center gap-1">🎵 Özel ses ayarlandı</span>
                      <button type="button" onClick={() => setEditSoundBase64(null)} className="text-rose-400 hover:text-rose-300">Kaldır</button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setEditingTask(null)}
                  className="flex-1 py-3 bg-white/5 border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  İptal
                </button>
                <button
                  onClick={saveEdit}
                  className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 transition-all duration-300"
                >
                  💾 Kaydet
                </button>
              </div>
            </div>
          </Modal>

          <Modal
            isOpen={!!deleteConfirmId}
            onClose={() => setDeleteConfirmId(null)}
            title="Görevi Sil"
          >
            <div className="space-y-4">
              <div className="flex flex-col items-center text-center py-2">
                <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl">🗑️</span>
                </div>
                <p className="text-gray-300">Bu görevi silmek istediğinizden emin misiniz?</p>
                <p className="text-gray-500 text-sm mt-1">Bu işlem geri alınamaz.</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 py-3 bg-white/5 border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  Vazgeç
                </button>
                <button
                  onClick={deleteTask}
                  className="flex-1 py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-semibold rounded-xl shadow-lg shadow-rose-500/25 transition-all duration-300"
                >
                  🗑️ Evet, Sil
                </button>
              </div>
            </div>
          </Modal>
        </div>
      </main>
    </>
  )
}
