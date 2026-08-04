export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-violet-500/20 to-cyan-500/20 rounded-full flex items-center justify-center border border-white/10">
          <span className="text-5xl">📝</span>
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-full flex items-center justify-center text-sm shadow-lg shadow-violet-500/30">
          ✨
        </div>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">Henüz görev yok</h3>
      <p className="text-gray-400 text-center max-w-sm">
        İlk görevinizi ekleyerek başlayın! Yukarıdaki "Yeni Görev Ekle" butonuna tıklayın.
      </p>
    </div>
  )
}
