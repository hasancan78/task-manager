// Görev öncelik seviyeleri
export const PRIORITIES = {
  LOW: { value: 'low', label: 'Düşük', color: 'emerald', bgClass: 'bg-emerald-500/20', textClass: 'text-emerald-400', borderClass: 'border-emerald-500/30' },
  MEDIUM: { value: 'medium', label: 'Orta', color: 'amber', bgClass: 'bg-amber-500/20', textClass: 'text-amber-400', borderClass: 'border-amber-500/30' },
  HIGH: { value: 'high', label: 'Yüksek', color: 'rose', bgClass: 'bg-rose-500/20', textClass: 'text-rose-400', borderClass: 'border-rose-500/30' },
}

// Görev kategorileri
export const CATEGORIES = [
  { value: 'personal', label: 'Kişisel', icon: '👤' },
  { value: 'work', label: 'İş', icon: '💼' },
  { value: 'study', label: 'Eğitim', icon: '📚' },
  { value: 'health', label: 'Sağlık', icon: '🏥' },
  { value: 'other', label: 'Diğer', icon: '📌' },
]

// Filtre seçenekleri
export const FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
}

// Hatırlatıcı seçenekleri
export const REMINDER_OPTIONS = [
  { value: -1, label: 'Hatırlatma', icon: '🔕' },
  { value: 0, label: 'Tam zamanında', icon: '🔔' },
  { value: 5, label: '5 dakika önce', icon: '⏰' },
  { value: 15, label: '15 dakika önce', icon: '⏰' },
  { value: 30, label: '30 dakika önce', icon: '⏰' },
  { value: 60, label: '1 saat önce', icon: '🕐' },
  { value: 1440, label: '1 gün önce', icon: '📅' },
]

// Varsayılan görev yapısı
export const createDefaultTask = () => ({
  id: '',
  title: '',
  description: '',
  priority: PRIORITIES.MEDIUM.value,
  category: 'personal',
  completed: false,
  createdAt: new Date().toISOString(),
  dueDate: '',
  dueTime: '',
  reminderMinutes: -1,
  notified: false,
})
