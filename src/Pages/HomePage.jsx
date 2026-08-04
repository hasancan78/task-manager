import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { FILTERS, PRIORITIES, CATEGORIES } from '../Interfaces/taskTypes'
import TaskForm from '../Components/TaskForm'
import TaskList from '../Components/TaskList'
import SearchFilter from '../Components/SearchFilter'
import StatsBar from '../Components/StatsBar'
import EmptyState from '../Components/EmptyState'
import Modal from '../Components/Modal'

export default function HomePage() {
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

  // CREATE
  const addTask = (taskData) => {
    const newTask = {
      id: uuidv4(),
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
    }
    setTasks([newTask, ...tasks])
  }

  // UPDATE - toggle
  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  // UPDATE - edit
  const openEditModal = (task) => {
    setEditingTask(task)
    setEditTitle(task.title)
    setEditDescription(task.description)
    setEditPriority(task.priority)
    setEditCategory(task.category)
  }

  const saveEdit = () => {
    if (!editTitle.trim()) return
    setTasks(tasks.map(t =>
      t.id === editingTask.id
        ? { ...t, title: editTitle.trim(), description: editDescription.trim(), priority: editPriority, category: editCategory }
        : t
    ))
    setEditingTask(null)
  }

  // DELETE
  const confirmDelete = (id) => {
    setDeleteConfirmId(id)
  }

  const deleteTask = () => {
    setTasks(tasks.filter(t => t.id !== deleteConfirmId))
    setDeleteConfirmId(null)
  }

  // FILTER & SEARCH
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl sm:text-5xl font-bold text-white">
          Görevlerim
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 mx-auto rounded-full" />
        <p className="text-gray-400 text-lg">Günlük görevlerinizi organize edin ve takip edin</p>
      </div>

      {/* Stats */}
      <StatsBar tasks={tasks} />

      {/* Add Task Form */}
      <TaskForm onAddTask={addTask} />

      {/* Search & Filter */}
      {tasks.length > 0 && (
        <SearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filter={filter}
          setFilter={setFilter}
        />
      )}

      {/* Task List or Empty State */}
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
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Görev Başlığı</label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300"
              id="edit-task-title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Açıklama</label>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300 resize-none"
              id="edit-task-description"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Öncelik</label>
              <select
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500/50 transition-all duration-300 appearance-none cursor-pointer"
                id="edit-task-priority"
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
                className="w-full px-4 py-3 bg-gray-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500/50 transition-all duration-300 appearance-none cursor-pointer"
                id="edit-task-category"
              >
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setEditingTask(null)}
              className="flex-1 py-3 bg-white/5 border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 transition-all duration-300"
              id="cancel-edit-button"
            >
              İptal
            </button>
            <button
              onClick={saveEdit}
              className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 transition-all duration-300"
              id="save-edit-button"
            >
              💾 Kaydet
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
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
              id="cancel-delete-button"
            >
              Vazgeç
            </button>
            <button
              onClick={deleteTask}
              className="flex-1 py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-semibold rounded-xl shadow-lg shadow-rose-500/25 transition-all duration-300"
              id="confirm-delete-button"
            >
              🗑️ Evet, Sil
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
