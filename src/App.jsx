import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/login'
import Dashboard from './pages/dashboard'
import Explore from './pages/explore'
import DetailSnippet from './pages/detailSnippet'
import UserProfile from './pages/userProfile'
import NotFound from './pages/notFound' // Import Halaman 404
import GlobalAlert from './components/globalAlert'
import { useAuthStore } from './store/authStore'
import { useThemeStore } from './store/themeStore'
import { useEffect } from 'react'
import LandingPage from './pages/landingPage'

function App() {
  const { checkUser } = useAuthStore()
  const { initializeTheme } = useThemeStore()

  useEffect(() => {
    checkUser()
    initializeTheme()
  }, [])

  return (
    <BrowserRouter>
      {/* Global Alert dipasang di sini agar muncul di atas semua halaman */}
      <GlobalAlert />
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/snippet/:id" element={<DetailSnippet />} />
        <Route path="/user/:userId" element={<UserProfile />} />
        <Route path="/login" element={<Login />} />
        
        {/* ROUTE 404 (WAJIB DI PALING BAWAH) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App