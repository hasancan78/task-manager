export default function StatsBar({ tasks }) {
  const total = tasks.length
  const completed = tasks.filter(t => t.completed).length
  const active = total - completed
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0

  const stats = [
    { label: 'Toplam Görev', count: total, icon: '📋', gradient: 'from-violet-500 to-purple-600', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
    { label: 'Tamamlanan', count: completed, icon: '✅', gradient: 'from-emerald-500 to-green-600', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { label: 'Devam Eden', count: active, icon: '⏳', gradient: 'from-amber-500 to-orange-600', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`${stat.bg} ${stat.border} border backdrop-blur-xl rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                <p className={`text-3xl font-bold mt-1 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                  {stat.count}
                </p>
              </div>
              <span className="text-3xl opacity-80">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>
      {total > 0 && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400 font-medium">İlerleme Durumu</span>
            <span className="text-sm font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              %{progress}
            </span>
          </div>
          <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
