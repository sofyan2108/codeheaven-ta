/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // 1. Aktifkan Dark Mode via Class
  darkMode: 'class', 
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Palet "Code Haven" (Light & Dark)
        pastel: {
          // --- Mode Terang (Light) ---
          bg: '#FDFBF7',       // Cream lembut
          surface: '#FFFFFF',  // Putih bersih
          text: '#4A4A4A',     // Abu gelap (teks utama)
          muted: '#9CA3AF',    // Abu terang (teks sekunder)
          border: '#E5E7EB',   // Garis pemisah tipis

          // --- Mode Gelap (Dark) ---
          'dark-bg': '#121212',      // Hitam hampir pekat (Background Utama)
          'dark-surface': '#1E1E1E', // Abu sangat gelap (Kartu/Sidebar)
          'dark-text': '#E4E6EB',    // Putih tulang (Teks utama di dark mode)
          'dark-muted': '#A0AEC0',   // Abu silver (Teks sekunder di dark mode)
          'dark-border': '#2D3748',  // Garis pemisah gelap

          // --- Aksen Colorful (Shared / Adjusted) ---
          // Kita buat sedikit lebih terang untuk dark mode agar "pop out"
          primary: '#A7C7E7',         // Biru Pastel (Light Mode)
          'primary-dark': '#6CB2EB',  // Biru Langit Cerah (Dark Mode)

          secondary: '#C1E1C1',       // Hijau Mint (Light Mode)
          'secondary-dark': '#68D391',// Hijau Cerah (Dark Mode)
          
          accent: '#FAA0A0',          // Merah Salem (Light Mode)
          'accent-dark': '#FC8181',   // Merah Cerah (Dark Mode)
        }
      }
    },
  },
  plugins: [],
}