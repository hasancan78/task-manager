import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar'
import HomePage from './Pages/HomePage'
import AboutPage from './Pages/AboutPage'

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-950 font-['Inter',sans-serif]">
        {/* Background decoration */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-500/10 rounded-full blur-[100px]" />
          <div className="absolute top-1/3 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]" />
          <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px]" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <Navbar />
          <main className="pb-12">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/hakkinda" element={<AboutPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}
