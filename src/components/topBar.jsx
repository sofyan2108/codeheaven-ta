import { Bell, Sun, Moon } from 'lucide-react'
import { useThemeStore } from '../store/themeStore'

export default function TopBar() {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <header className="h-20 px-8 flex items-center justify-between bg-white dark:bg-pastel-dark-surface border-b border-gray-100 dark:border-pastel-dark-border sticky top-0 z-10 transition-colors duration-300">
      
      {/* Kiri: Title Halaman (Bisa dibuat dinamis nanti jika perlu) */}
      <div className="flex flex-col">
         <h2 className="text-xl font-bold text-gray-800 dark:text-white transition-colors tracking-tight">
            CodeHaven
         </h2>
         <p className="text-xs text-gray-500 dark:text-gray-400">Manage your snippets efficiently</p>
      </div>

      {/* Tengah: Spacer (Search bar dihapus agar tidak duplikat dengan Dashboard) */}
      <div className="flex-1"></div>

      {/* Kanan: Actions */}
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleTheme}
          className="p-2.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition hover:rotate-12"
          title={theme === 'light' ? "Mode Gelap" : "Mode Terang"}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <button className="p-2.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition relative group">
          <Bell size={20} />
          {/* Badge Notifikasi */}
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#1F2937]"></span>
        </button>
      </div>
    </header>
  )
}