import { useState } from 'react'
import { PRIORITIES, CATEGORIES, REMINDER_OPTIONS } from '../Interfaces/taskTypes'

export default function TaskForm({ onAddTask }) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState(PRIORITIES.MEDIUM.value)
  const [category, setCategory] = useState('personal')
  const [dueDate, setDueDate] = useState('')
  const [dueTime, setDueTime] = useState('')
  const [reminderMinutes, setReminderMinutes] = useState(-1)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Görev başlığı boş bırakılamaz!')
      return
    }
    if (reminderMinutes >= 0 && (!dueDate || !dueTime)) {
      setError('Hatırlatıcı için tarih ve saat seçmelisiniz!')
      return
    }
    onAddTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      dueDate,
      dueTime,
      reminderMinutes: dueDate && dueTime ? reminderMinutes : -1,
    })
    setTitle('')
    setDescription('')
    setPriority(PRIORITIES.MEDIUM.value)
    setCategory('personal')
    setDueDate('')
    setDueTime('')
    setReminderMinutes(-1)
    setError('')
    setIsOpen(false)
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden transition-all duration-500">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left group"
        id="toggle-task-form"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-violet-500/25 group-hover:scale-110 transition-transform duration-300">
            +
          </div>
          <div>
            <h3 className="text-white font-semibold">Yeni Görev Ekle</h3>
            <p className="text-gray-500 text-sm">Görev detaylarını doldurun</p>
          </div>
        </div>
        <span className={`text-gray-400 transition-transform duration-300 text-xl ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
        <form onSubmit={handleSubmit} className="p-5 pt-0 space-y-4">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-rose-400 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Görev Başlığı *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError('') }}
              placeholder="Görev başlığını yazın..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300"
              id="task-title-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Açıklama</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Görev açıklamasını yazın (opsiyonel)..."
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300 resize-none"
              id="task-description-input"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Öncelik</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300 appearance-none cursor-pointer"
                id="task-priority-select"
              >
                {Object.values(PRIORITIES).map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300 appearance-none cursor-pointer"
                id="task-category-select"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tarih, Saat ve Hatırlatıcı */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
            <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <span>🔔</span> Hatırlatıcı Ayarları
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Bitiş Tarihi</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-900 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300 [color-scheme:dark]"
                  id="task-duedate-input"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Saat</label>
                <input
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  disabled={!dueDate}
                  className="w-full px-3 py-2.5 bg-gray-900 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed [color-scheme:dark]"
                  id="task-duetime-input"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Ne Zaman Hatırlatsın?</label>
                <select
                  value={reminderMinutes}
                  onChange={(e) => setReminderMinutes(Number(e.target.value))}
                  disabled={!dueDate || !dueTime}
                  className="w-full px-3 py-2.5 bg-gray-900 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300 appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  id="task-reminder-select"
                >
                  {REMINDER_OPTIONS.map((r) => (
                    <option key={r.value} value={r.value}>{r.icon} {r.label}</option>
                  ))}
                </select>
              </div>
            </div>
            {dueDate && dueTime && reminderMinutes >= 0 && (
              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
                <span>🔔</span>
                <span>Hatırlatıcı aktif — bildirim alacaksınız</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 hover:from-violet-500 hover:via-blue-500 hover:to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
            id="add-task-button"
          >
            ✨ Görevi Ekle
          </button>
        </form>
      </div>
    </div>
  )
}
