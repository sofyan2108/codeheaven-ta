import { create } from 'zustand'

export const useAlertStore = create((set) => ({
  isOpen: false,
  type: 'success', // Bisa 'success' atau 'error'
  title: '',
  message: '',

  // Fungsi untuk memanggil alert
  showAlert: (type, title, message) => set({ 
    isOpen: true, 
    type, 
    title, 
    message 
  }),

  // Fungsi menutup alert
  closeAlert: () => set({ isOpen: false })
}))