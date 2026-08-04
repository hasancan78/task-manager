export default function AboutPage() {
  const technologies = [
    { name: 'React 19', icon: '⚛️', description: 'Modern UI bileşen kütüphanesi' },
    { name: 'Vite 6', icon: '⚡', description: 'Hızlı build aracı & dev server' },
    { name: 'Tailwind CSS v4', icon: '🎨', description: 'Utility-first CSS framework' },
    { name: 'React Router v7', icon: '🧭', description: 'Client-side routing' },
    { name: 'LocalStorage', icon: '💾', description: 'Tarayıcı tabanlı veri saklama' },
    { name: 'UUID', icon: '🔑', description: 'Benzersiz kimlik üreteci' },
  ]

  const features = [
    { title: 'Ekleme (Create)', icon: '➕', desc: 'Yeni görev oluşturma formu ile başlık, açıklama, öncelik ve kategori belirleyerek görev ekleyin.' },
    { title: 'Listeleme (Read)', icon: '📋', desc: 'Tüm görevlerinizi kart görünümünde listeleyip, arama ve filtreleme ile kolayca bulun.' },
    { title: 'Güncelleme (Update)', icon: '✏️', desc: 'Görevlerinizi düzenleyin, tamamlama durumunu değiştirin.' },
    { title: 'Silme (Delete)', icon: '🗑️', desc: 'Onay modalı ile güvenli bir şekilde görev silin.' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-400 text-sm font-medium mb-2">
          <span>ℹ️</span> Proje Hakkında
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
          TaskFlow
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Web Geliştirme eğitimi çerçevesinde yapay zeka proje yönergesi kapsamında
          geliştirilen modern görev yönetim uygulaması.
        </p>
      </div>

      {/* CRUD Features */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-lg flex items-center justify-center text-sm">⚙️</span>
          CRUD İşlemleri
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/5"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{feature.icon}</span>
                <h3 className="font-semibold text-white">{feature.title}</h3>
              </div>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Technologies */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-sm">🛠️</span>
          Kullanılan Teknolojiler
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {technologies.map((tech) => (
            <div
              key={tech.name}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{tech.icon}</span>
                <div>
                  <h3 className="font-medium text-white">{tech.name}</h3>
                  <p className="text-gray-500 text-xs">{tech.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Info */}
      <div className="bg-gradient-to-br from-violet-500/10 via-blue-500/10 to-cyan-500/10 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
          <span>📌</span> Proje Bilgileri
        </h2>
        <div className="space-y-2 text-gray-400 text-sm">
          <p>📁 <strong className="text-gray-300">Proje Yapısı:</strong> Components, Pages, Interfaces, hooks klasörleri ile modüler mimari</p>
          <p>💾 <strong className="text-gray-300">Veri Saklama:</strong> LocalStorage API ile tarayıcı tabanlı kalıcı veri yönetimi</p>
          <p>🎨 <strong className="text-gray-300">Tasarım:</strong> Dark mode, glassmorphism, gradient renkler ve smooth animasyonlar</p>
          <p>📱 <strong className="text-gray-300">Responsive:</strong> Mobil, tablet ve masaüstü uyumlu tasarım</p>
          <p>🚀 <strong className="text-gray-300">Deploy:</strong> Netlify ile yayına alınabilir Vite build çıktısı</p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-4 border-t border-white/5">
        <p className="text-gray-500 text-sm">
          © 2026 TaskFlow — Web Geliştirme Yapay Zeka Proje Ödevi
        </p>
      </div>
    </div>
  )
}
