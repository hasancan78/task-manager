import { Link, useLocation } from 'react-router-dom'

export default function Navbar({ onInstall, isInstallable, onRequestPermission, permissionStatus, hasNotificationSupport }) {
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl group-hover:scale-110 transition-transform duration-300">✅</span>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              TaskFlow
            </span>
          </Link>
          <div className="flex items-center gap-1">
            {/* Bildirim izni butonu */}
            {hasNotificationSupport && permissionStatus !== 'granted' && (
              <button
                onClick={onRequestPermission}
                className="px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 flex items-center gap-1.5"
                title="Bildirimleri Aç"
              >
                <span>🔔</span>
                <span className="hidden sm:inline">Bildirimleri Aç</span>
              </button>
            )}
            {hasNotificationSupport && permissionStatus === 'granted' && (
              <span
                className="px-3 py-2 rounded-xl text-sm text-emerald-400 flex items-center gap-1.5"
                title="Bildirimler aktif"
              >
                <span>🔔</span>
                <span className="hidden sm:inline text-xs">Aktif</span>
              </span>
            )}

            {/* PWA Kurulum butonu */}
            {isInstallable && (
              <button
                onClick={onInstall}
                className="px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 text-white border border-violet-500/30 hover:from-violet-500/30 hover:to-cyan-500/30 flex items-center gap-1.5"
              >
                <span>📲</span>
                <span className="hidden sm:inline">Yükle</span>
              </button>
            )}

            <Link
              to="/"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive('/')
                  ? 'bg-white/10 text-white shadow-lg shadow-violet-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Ana Sayfa
            </Link>
            <Link
              to="/hakkinda"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive('/hakkinda')
                  ? 'bg-white/10 text-white shadow-lg shadow-violet-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Hakkında
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
