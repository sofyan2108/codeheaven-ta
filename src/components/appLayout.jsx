import { useState } from 'react'
import Sidebar from './sidebar'
import TopBar from './topBar'
import AddSnippetModal from './addSnippetModal'
import { Menu } from 'lucide-react'

export default function AppLayout({ children }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // State untuk Sidebar Mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-pastel-bg dark:bg-pastel-dark-bg font-sans text-pastel-text dark:text-pastel-dark-text transition-colors duration-300 overflow-x-hidden">
      
      {/* SIDEBAR */}
      <Sidebar 
        onOpenModal={() => setIsModalOpen(true)} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      {/* MAIN CONTENT */}
      {/* PERBAIKAN: Hapus 'w-full', ganti dengan 'min-w-0' */}
      {/* 'min-w-0' mencegah flex item melebar paksa melebihi container */}
      <main className="flex-1 flex flex-col min-w-0 lg:ml-64 transition-all duration-300">
        
        {/* TopBar Wrapper */}
        <div className="sticky top-0 z-10 flex flex-col">
            {/* Header Mobile (Hamburger) */}
            <div className="lg:hidden bg-white dark:bg-pastel-dark-surface border-b border-gray-200 dark:border-pastel-dark-border px-4 py-3 flex items-center justify-between">
                <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition"
                >
                    <Menu size={24} />
                </button>
                <span className="font-bold text-gray-800 dark:text-white">CodeHaven</span>
                <div className="w-10"></div>
            </div>
            
            <TopBar />
        </div>

        {/* Konten Halaman */}
        <div className="p-4 md:p-8 pt-4 flex-1">
          {children}
        </div>
      </main>

      {/* Modal Snippet */}
      <AddSnippetModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}