import AppLayout from '../components/appLayout'
import SnippetCard from '../components/snippetCard'
import AddSnippetModal from '../components/addSnippetModal'
import { useAuthStore } from '../store/authStore'
import { useSnippetStore } from '../store/snippetStore'
import { useAlertStore } from '../store/alertStore'
import { useEffect, useState, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, PlusCircle, Search, Filter, ArrowUpDown, Globe } from 'lucide-react'
import { popularLanguages } from '../utils/languageConfig'
import { useShortcut } from '../hooks/useShortcut'

export default function Dashboard() {
  const { user } = useAuthStore()
  const { snippets, fetchSnippets, fetchMyFavoriteIds, loading } = useSnippetStore()
  const { showAlert } = useAlertStore()
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState('newest')
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [filterVisibility, setFilterVisibility] = useState('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const searchInputRef = useRef(null)

  // LOGIC TOMBOL ADD (CHECK USER)
  const handleAddClick = () => {
    if (!user) {
        showAlert('error', 'Login Diperlukan', 'Silakan login terlebih dahulu untuk membuat snippet baru.')
        return
    }
    setIsAddModalOpen(true)
  }

  useShortcut('k', () => {
    searchInputRef.current?.focus()
  }, { ctrlKey: true })

  useShortcut('n', () => {
    if (!user) {
        showAlert('error', 'Login Diperlukan', 'Silakan login terlebih dahulu.')
        return
    }
    setIsAddModalOpen(true)
  }, { altKey: true })

  useEffect(() => {
    // Jangan redirect paksa jika di dashboard publik (walaupun logic sekarang dashboard = private collection)
    // Tapi untuk konsistensi dengan tombol, kita biarkan saja user null melihat dashboard kosong
    // atau redirect ke login jika memang dashboard wajib login. 
    // Di sini kita biarkan redirect login jika dashboard memang untuk personal.
    if (!user) navigate('/login')
  }, [user, navigate])

  useEffect(() => {
    if (user) {
      fetchSnippets()
      fetchMyFavoriteIds()
    }
  }, [user])

  const filteredSnippets = useMemo(() => {
    let result = snippets.filter(s => s.user_id === user?.id)

    if (selectedLanguage !== 'all') {
      result = result.filter(s => s.language.toLowerCase() === selectedLanguage.toLowerCase())
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(s => 
        s.title.toLowerCase().includes(q) || 
        (s.tags && s.tags.some(tag => tag.toLowerCase().includes(q)))
      )
    }

    if (filterVisibility === 'public') {
      result = result.filter(s => s.is_public === true)
    } else if (filterVisibility === 'private') {
      result = result.filter(s => s.is_public === false)
    }

    result.sort((a, b) => {
      if (sortOption === 'newest') return new Date(b.created_at) - new Date(a.created_at)
      if (sortOption === 'oldest') return new Date(a.created_at) - new Date(b.created_at)
      if (sortOption === 'popular') return (b.copy_count || 0) - (a.copy_count || 0)
      return 0
    })

    return result
  }, [snippets, user, searchQuery, sortOption, selectedLanguage, filterVisibility])

  const availableLanguages = useMemo(() => {
    const langs = snippets.filter(s => s.user_id === user?.id).map(s => s.language)
    const seen = new Set()
    const result = []
    langs.forEach(lang => {
        const lower = lang.toLowerCase()
        if (!seen.has(lower)) {
            seen.add(lower)
            const prettyName = popularLanguages.find(p => p.toLowerCase() === lower) || lang
            result.push(prettyName)
        }
    })
    return ['all', ...result]
  }, [snippets, user])

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-pastel-text dark:text-white mb-2">
            Dashboard
        </h1>
        <p className="text-pastel-muted dark:text-gray-400">
            Kelola dan temukan kodemu dengan mudah.
        </p>
      </div>

      <div className="mb-8 flex flex-col xl:flex-row gap-4 justify-between items-center">
        
        <div className="relative w-full xl:w-1/3 group">
            <Search className="absolute left-4 top-3 text-gray-400 group-focus-within:text-pastel-primary transition" size={18} />
            <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Cari judul atau tag... (Ctrl + K)" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-pastel-dark-surface rounded-2xl shadow-sm focus:shadow-md focus:ring-0 text-gray-700 dark:text-white placeholder-gray-400 transition-all outline-none"
            />
            <div className="absolute right-4 top-3.5 hidden md:flex items-center gap-1 pointer-events-none">
                <kbd className="hidden sm:inline-block border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-400 dark:text-gray-300 rounded px-1.5 py-0.5 text-[10px] font-sans font-bold shadow-sm">Ctrl K</kbd>
            </div>
        </div>

        <div className="flex flex-wrap gap-3 w-full xl:w-auto justify-end">
            
            <div className="relative min-w-[140px] flex-1 xl:flex-none group">
                <Filter className="absolute left-3 top-3 text-gray-400 group-hover:text-pastel-primary transition" size={16} />
                <select 
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full pl-9 pr-8 py-3 bg-white dark:bg-pastel-dark-surface rounded-2xl shadow-sm cursor-pointer focus:shadow-md outline-none text-sm font-medium text-gray-600 dark:text-gray-300 appearance-none transition-all hover:bg-gray-50 dark:hover:bg-white/5"
                >
                    <option value="all">Semua Bahasa</option>
                    {availableLanguages.filter(l => l !== 'all').map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                    ))}
                </select>
            </div>

            <div className="relative min-w-[140px] flex-1 xl:flex-none group">
                <Globe className="absolute left-3 top-3 text-gray-400 group-hover:text-pastel-primary transition" size={16} />
                <select 
                    value={filterVisibility}
                    onChange={(e) => setFilterVisibility(e.target.value)}
                    className="w-full pl-9 pr-8 py-3 bg-white dark:bg-pastel-dark-surface rounded-2xl shadow-sm cursor-pointer focus:shadow-md outline-none text-sm font-medium text-gray-600 dark:text-gray-300 appearance-none transition-all hover:bg-gray-50 dark:hover:bg-white/5"
                >
                    <option value="all">Semua Status</option>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                </select>
                <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
            </div>

            <div className="relative min-w-[160px] flex-1 xl:flex-none group">
                <ArrowUpDown className="absolute left-3 top-3 text-gray-400 group-hover:text-pastel-primary transition" size={16} />
                <select 
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="w-full pl-9 pr-8 py-3 bg-white dark:bg-pastel-dark-surface rounded-2xl shadow-sm cursor-pointer focus:shadow-md outline-none text-sm font-medium text-gray-600 dark:text-gray-300 appearance-none transition-all hover:bg-gray-50 dark:hover:bg-white/5"
                >
                    <option value="newest">Waktu: Terbaru</option>
                    <option value="oldest">Waktu: Terlama</option>
                    <option value="popular">Populer (Copy)</option>
                </select>
            </div>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
            <Loader2 className="animate-spin text-pastel-primary" size={40} />
        </div>
      ) : filteredSnippets.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-3xl bg-gray-50/50 dark:bg-white/5">
            <button 
                onClick={handleAddClick}
                className="w-16 h-16 bg-pastel-primary/10 rounded-full flex items-center justify-center mb-4 text-pastel-primary hover:bg-pastel-primary/20 transition cursor-pointer"
            >
                {searchQuery || selectedLanguage !== 'all' || filterVisibility !== 'all' ? <Search size={32}/> : <PlusCircle size={32} />}
            </button>
            <h3 className="text-lg font-bold text-gray-600 dark:text-gray-300">
                {searchQuery || filterVisibility !== 'all' ? 'Tidak ditemukan' : 'Belum ada snippet'}
            </h3>
            <p className="text-gray-400 text-sm mt-1">
                {searchQuery || filterVisibility !== 'all' ? 'Coba ubah kata kunci atau filter.' : 'Buat snippet pertamamu sekarang! (Tekan Alt+N)'}
            </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSnippets.map((snippet) => (
             <SnippetCard key={snippet.id} snippet={snippet} />
          ))}
        </div>
      )}

      <AddSnippetModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </AppLayout>
  )
}