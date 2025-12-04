import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Store untuk menyimpan status tema ('light' atau 'dark')
export const useThemeStore = create(
  persist(
    (set, get) => ({
      // Default tema (bisa diubah jadi 'dark' jika ingin default gelap)
      theme: 'light',

      // Fungsi untuk menukar tema
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light'
        set({ theme: newTheme })
        // Panggil fungsi untuk update class di HTML
        updateHtmlClass(newTheme)
      },

      // Fungsi inisialisasi saat aplikasi pertama kali dimuat
      initializeTheme: () => {
        updateHtmlClass(get().theme)
      }
    }),
    {
      name: 'theme-storage', // Nama key di local storage browser
    }
  )
)

// Helper function untuk menambah/hapus class 'dark' di tag <html>
const updateHtmlClass = (theme) => {
  const root = window.document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(theme)

  // Ubah warna scrollbar browser agar sesuai tema (opsional tapi bagus)
  root.style.colorScheme = theme
}