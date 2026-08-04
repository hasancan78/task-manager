import { FILTERS } from '../Interfaces/taskTypes'

export default function SearchFilter({ searchTerm, setSearchTerm, filter, setFilter }) {
  const filterButtons = [
    { key: FILTERS.ALL, label: 'Tümü', icon: '📋' },
    { key: FILTERS.ACTIVE, label: 'Aktif', icon: '⏳' },
    { key: FILTERS.COMPLETED, label: 'Tamamlanan', icon: '✅' },
  ]

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
        <input
          type="text"
          placeholder="Görev ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300"
          id="search-tasks"
        />
      </div>
      <div className="flex gap-2">
        {filterButtons.map((btn) => (
          <button
            key={btn.key}
            onClick={() => setFilter(btn.key)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
              filter === btn.key
                ? 'bg-gradient-to-r from-violet-500/20 to-cyan-500/20 text-white border border-violet-500/30 shadow-lg shadow-violet-500/10'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
            }`}
            id={`filter-${btn.key}`}
          >
            <span>{btn.icon}</span>
            <span className="hidden sm:inline">{btn.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
