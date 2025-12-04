import { useNavigate } from 'react-router-dom'
import { FileQuestion, ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pastel-bg dark:bg-pastel-dark-bg p-4 text-center transition-colors duration-300">
      
      <div className="w-24 h-24 bg-gray-100 dark:bg-white/5 rounded-3xl flex items-center justify-center mb-6 animate-bounce">
        <FileQuestion size={48} className="text-gray-400 dark:text-gray-500" />
      </div>

      <h1 className="text-6xl font-black text-gray-800 dark:text-white mb-2 tracking-tighter">
        404
      </h1>
      <h2 className="text-xl font-bold text-gray-600 dark:text-gray-300 mb-4">
        Halaman tidak ditemukan
      </h2>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8 leading-relaxed">
        Sepertinya kode yang Anda cari sudah di-refactor atau memang tidak pernah ada di sini.
      </p>

      <div className="flex gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-gray-600 dark:text-gray-300 bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/10 transition"
        >
          <ArrowLeft size={20} />
          Kembali
        </button>

        {/* Redirect ke Dashboard */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-pastel-primary dark:bg-pastel-primary-dark hover:brightness-110 shadow-lg shadow-pastel-primary/30 transition transform hover:-translate-y-1"
        >
          <Home size={20} />
          Ke Dashboard
        </button>
      </div>

    </div>
  )
}