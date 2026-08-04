import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
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
