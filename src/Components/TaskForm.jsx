import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { PRIORITIES, CATEGORIES, REMINDER_OPTIONS } from '../Interfaces/taskTypes'

export default function TaskForm({ onAddTask }) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState(PRIORITIES.MEDIUM.value)
  const [category, setCategory] = useState('personal')
  const [dueDate, setDueDate] = useState('')
  const [dueTime, setDueTime] = useState('')
  const [reminders, setReminders] = useState([])
  const [soundBase64, setSoundBase64] = useState(null)
  const [newReminderValue, setNewReminderValue] = useState(0)
  const [error, setError] = useState('')

  const handleSoundUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      setError('Ses dosyası çok büyük! Lütfen 2MB altında bir dosya seçin.')
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => setSoundBase64(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleAddReminder = () => {
    if (!reminders.find(r => r.minutes === newReminderValue)) {
      setReminders([...reminders, { id: uuidv4(), minutes: newReminderValue, notified: false }])
    }
  }

  const removeReminder = (id) => {
    setReminders(reminders.filter(r => r.id !== id))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Görev başlığı boş bırakılamaz!')
      return
    }
    if (reminders.length > 0 && (!dueDate || !dueTime)) {
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
      reminders: dueDate && dueTime ? reminders : [],
    }, soundBase64)
    
    // Formu sıfırla
    setTitle('')
    setDescription('')
    setPriority(PRIORITIES.MEDIUM.value)
    setCategory('personal')
    setDueDate('')
    setDueTime('')
    setReminders([])
    setSoundBase64(null)
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

      <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100 overflow-visible' : 'max-h-0 opacity-0 overflow-hidden'}`}>
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
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50 transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Açıklama</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Görev açıklamasını yazın (opsiyonel)..."
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50 transition-all duration-300 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Öncelik</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500/50 transition-all duration-300 appearance-none"
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
                className="w-full px-4 py-3 bg-gray-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500/50 transition-all duration-300 appearance-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Hatırlatıcı ve Ses Ayarları */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
            <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <span>🔔</span> Hatırlatıcı & Alarm Ayarları
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Bitiş Tarihi</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-900 border border-white/10 rounded-lg text-white text-sm focus:outline-none [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Saat</label>
                <input
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  disabled={!dueDate}
                  className="w-full px-3 py-2.5 bg-gray-900 border border-white/10 rounded-lg text-white text-sm focus:outline-none disabled:opacity-40 [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Hatırlatıcı Ekleme */}
            <div className="pt-2 border-t border-white/5">
              <label className="block text-xs text-gray-400 mb-1.5">Hatırlatıcı Ekle (Birden fazla ekleyebilirsiniz)</label>
              <div className="flex gap-2">
                <select
                  value={newReminderValue}
                  onChange={(e) => setNewReminderValue(Number(e.target.value))}
                  disabled={!dueDate || !dueTime}
                  className="flex-1 px-3 py-2 bg-gray-900 border border-white/10 rounded-lg text-white text-sm focus:outline-none disabled:opacity-40"
                >
                  {REMINDER_OPTIONS.filter(r => r.value >= 0).map((r) => (
                    <option key={r.value} value={r.value}>{r.icon} {r.label}</option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={!dueDate || !dueTime}
                  onClick={handleAddReminder}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg disabled:opacity-40 text-sm font-medium transition-colors"
                >
                  Ekle
                </button>
              </div>
            </div>

            {/* Eklenen Hatırlatıcılar Listesi */}
            {reminders.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {reminders.map(rem => {
                  const info = REMINDER_OPTIONS.find(r => r.value === rem.minutes)
                  return (
                    <span key={rem.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-xs text-white">
                      {info ? info.label : `${rem.minutes} dk önce`}
                      <button
                        type="button"
                        onClick={() => removeReminder(rem.id)}
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
            <div className="pt-2 border-t border-white/5">
              <label className="block text-xs text-gray-400 mb-1.5">Özel Alarm Sesi (Opsiyonel)</label>
              <input
                type="file"
                accept="audio/*"
                onChange={handleSoundUpload}
                className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-violet-500/20 file:text-violet-400 hover:file:bg-violet-500/30 transition-all cursor-pointer"
              />
              {soundBase64 && (
                <div className="mt-2 flex items-center justify-between text-xs text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-lg border border-emerald-500/20">
                  <span className="flex items-center gap-1">🎵 Özel ses eklendi</span>
                  <button type="button" onClick={() => setSoundBase64(null)} className="text-rose-400 hover:text-rose-300">İptal Et</button>
                </div>
              )}
              <p className="text-[10px] text-gray-500 mt-1.5">Müzik yüklemezseniz standart alarm çalar. (Max 2MB)</p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 hover:from-violet-500 hover:via-blue-500 hover:to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 transition-all duration-300"
          >
            ✨ Görevi Ekle
          </button>
        </form>
      </div>
    </div>
  )
}
