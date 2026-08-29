import { PRIORITIES, CATEGORIES, REMINDER_OPTIONS } from '../Interfaces/taskTypes'

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const priorityInfo = Object.values(PRIORITIES).find(p => p.value === task.priority) || PRIORITIES.MEDIUM
  const categoryInfo = CATEGORIES.find(c => c.value === task.category) || CATEGORIES[4]
  const createdDate = new Date(task.createdAt).toLocaleDateString('tr-TR', {
    day: 'numeric', month: 'short', year: 'numeric'
  })

  const getDueDateStatus = () => {
    if (!task.dueDate) return null

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const dueDate = new Date(task.dueDate)
    dueDate.setHours(0, 0, 0, 0)

    const diffTime = dueDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    const timeStr = task.dueTime ? `, ${task.dueTime}` : ''
    const dateFormatted = dueDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }) + timeStr

    if (task.completed) {
      return <span className="text-gray-500">🗓️ {dateFormatted}</span>
    } else if (diffDays < 0) {
      return <span className="text-rose-400 font-medium">⚠️ Geçti ({dateFormatted})</span>
    } else if (diffDays === 0) {
      return <span className="text-amber-400 font-medium">⏳ Bugün ({dateFormatted})</span>
    } else if (diffDays <= 2) {
      return <span className="text-amber-300">🗓️ {dateFormatted} ({diffDays} gün)</span>
    } else {
      return <span>🗓️ {dateFormatted}</span>
    }
  }

  const getReminderBadge = () => {
    if (!task.reminders || task.reminders.length === 0) return null
    if (!task.dueDate || !task.dueTime) return null

    const allNotified = task.reminders.every(r => r.notified)

    if (allNotified) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          ✅ Bildirildi
        </span>
      )
    }

    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs bg-violet-500/10 text-violet-400 border border-violet-500/20 animate-pulse">
        🔔 {task.reminders.length} Hatırlatıcı
      </span>
    )
  }

  return (
    <div className={`group bg-white/5 backdrop-blur-xl border rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/5 hover:border-white/20 ${
      task.completed ? 'border-white/5 opacity-60' : 'border-white/10'
    }`}>
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 shrink-0 ${
            task.completed
              ? 'bg-gradient-to-br from-emerald-500 to-green-600 border-emerald-500 shadow-lg shadow-emerald-500/25'
              : 'border-gray-600 hover:border-violet-500 hover:shadow-lg hover:shadow-violet-500/10'
          }`}
          id={`toggle-task-${task.id}`}
        >
          {task.completed && (
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className={`font-semibold text-lg transition-all duration-300 ${
              task.completed ? 'line-through text-gray-500' : 'text-white'
            }`}>
              {task.title}
            </h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium border ${priorityInfo.bgClass} ${priorityInfo.textClass} ${priorityInfo.borderClass}`}>
              {priorityInfo.label}
            </span>
            {getReminderBadge()}
          </div>

          {task.description && (
            <p className={`text-sm mb-3 transition-all duration-300 ${
              task.completed ? 'line-through text-gray-600' : 'text-gray-400'
            }`}>
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              {categoryInfo.icon} {categoryInfo.label}
            </span>
            <span>•</span>
            <span title="Oluşturulma">📝 {createdDate}</span>
            {task.dueDate && (
              <>
                <span>•</span>
                {getDueDateStatus()}
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => onEdit(task)}
            className="p-2 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-300"
            title="Düzenle"
            id={`edit-task-${task.id}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-300"
            title="Sil"
            id={`delete-task-${task.id}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
