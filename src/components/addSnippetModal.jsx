import { X, Code2, Loader2, Tag, Wand2 } from 'lucide-react'
import { useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { dracula } from '@uiw/codemirror-theme-dracula'
import { githubLight } from '@uiw/codemirror-theme-github'
import { useSnippetStore } from '../store/snippetStore'
import { useAlertStore } from '../store/alertStore'
import { useThemeStore } from '../store/themeStore'
import { getLanguageExtension, popularLanguages } from '../utils/languageConfig'
import LanguageSelector from './languageSelector'
import { useShortcut } from '../hooks/useShortcut'
import { formatCode } from '../utils/formatCode'

export default function AddSnippetModal({ isOpen, onClose }) {
  const { addSnippet } = useSnippetStore()
  const { showAlert } = useAlertStore()
  const { theme } = useThemeStore()
  const [loading, setLoading] = useState(false)
  
  // State Form
  const [title, setTitle] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState('// Ketik kodemu disini...')
  const [description, setDescription] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [isFormatting, setIsFormatting] = useState(false)

  // --- BATASAN VALIDASI (KEAMANAN) ---
  const MAX_TITLE_LENGTH = 100
  const MAX_CODE_LENGTH = 20000 // Sekitar 20k karakter code
  const MAX_DESC_LENGTH = 500

  const performSubmit = async () => {
    // 1. Validasi Input Kosong
    if (!title.trim()) {
        showAlert('error', 'Validasi Gagal', 'Judul snippet tidak boleh kosong.')
        return
    }

    if (!code.trim() || code === '// Ketik kodemu disini...') {
        showAlert('error', 'Validasi Gagal', 'Kode tidak boleh kosong.')
        return
    }

    // 2. Validasi Panjang Input (Mencegah Spam/Buffer Overflow)
    if (title.length > MAX_TITLE_LENGTH) {
        showAlert('error', 'Judul Terlalu Panjang', `Maksimal ${MAX_TITLE_LENGTH} karakter.`)
        return
    }

    if (code.length > MAX_CODE_LENGTH) {
        showAlert('error', 'Kode Terlalu Panjang', `Snippet terlalu besar (maksimal ${MAX_CODE_LENGTH} karakter).`)
        return
    }

    if (description.length > MAX_DESC_LENGTH) {
        showAlert('error', 'Deskripsi Terlalu Panjang', `Maksimal ${MAX_DESC_LENGTH} karakter.`)
        return
    }
    
    setLoading(true)
    try {
      // 3. Sanitasi Input Sederhana (Trim)
      const tagsArray = tagsInput
        .split(',')
        .map(tag => tag.trim()) // Hapus spasi berlebih
        .filter(tag => tag.length > 0)
        .slice(0, 5) // Batasi maksimal 5 tag per snippet

      await addSnippet({
        title: title.trim(), // Simpan versi bersih
        language,
        code,
        description: description.trim(),
        is_public: isPublic,
        tags: tagsArray
      })
      
      // Reset Form
      setTitle('')
      setCode('// Ketik kodemu disini...')
      setDescription('')
      setTagsInput('')
      setLanguage('javascript')
      setIsPublic(false)
      
      onClose()
      showAlert('success', 'Berhasil!', 'Snippet baru telah disimpan dengan aman.')
    } catch (error) {
      showAlert('error', 'Gagal', error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFormat = async () => {
    setIsFormatting(true)
    try {
      const formatted = await formatCode(code, language)
      setCode(formatted)
    } catch (error) {
      console.warn("Format gagal", error)
    } finally {
      setIsFormatting(false)
    }
  }

  useShortcut('s', () => {
    if (isOpen && !loading) performSubmit()
  }, { ctrlKey: true })

  useShortcut('Escape', () => {
    if (isOpen) onClose()
  }, { ctrlKey: false })

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    performSubmit()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in zoom-in-95 duration-200">
      
      <div className="bg-white dark:bg-pastel-dark-surface w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 dark:border-pastel-dark-border overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-pastel-dark-border bg-gray-50 dark:bg-white/5">
          <h3 className="font-bold text-lg text-gray-800 dark:text-white flex items-center gap-2">
            <Code2 size={20} className="text-pink-500" />
            Create New Snippet
          </h3>
          <div className="flex items-center gap-2">
             <span className="hidden sm:inline-block text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-white/10 px-2 py-1 rounded border border-gray-200 dark:border-gray-600">
                ESC to close
             </span>
             <button onClick={onClose} className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition text-gray-500 dark:text-gray-400 hover:rotate-90 duration-300">
                <X size={20} />
             </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="snippet-form" onSubmit={handleSubmit} className="space-y-4">
            
            {/* Judul */}
            <div>
              <div className="flex justify-between">
                <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Judul Snippet</label>
                <span className={`text-[10px] ${title.length > MAX_TITLE_LENGTH ? 'text-red-500' : 'text-gray-400'}`}>{title.length}/{MAX_TITLE_LENGTH}</span>
              </div>
              <input 
                type="text" 
                required
                placeholder="Contoh: Navbar Responsive"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={MAX_TITLE_LENGTH}
                className="w-full px-4 py-2 bg-white dark:bg-[#252a33] border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500/50 dark:text-white focus:outline-none transition"
              />
            </div>

            {/* Grid Bahasa & Visibility */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Bahasa</label>
                <LanguageSelector value={language} onChange={(val) => setLanguage(val)} />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Visibility</label>
                <select 
                  value={isPublic}
                  onChange={(e) => setIsPublic(e.target.value === 'true')}
                  className="w-full px-4 py-2 bg-white dark:bg-[#252a33] border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500/50 dark:text-white focus:outline-none transition cursor-pointer"
                >
                  <option value="false">Private (Hanya Saya)</option>
                  <option value="true">Public (Masuk Forum)</option>
                </select>
              </div>
            </div>

            {/* Input Tags */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Tags (Max 5)</label>
              <div className="relative">
                <Tag className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="react, frontend, button (pisahkan dengan koma)"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#252a33] border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500/50 dark:text-white focus:outline-none transition"
                />
              </div>
            </div>

            {/* Code Editor */}
            <div>
              <div className="flex justify-between items-end mb-1">
                <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Kode</label>
                
                {/* TOMBOL FORMAT */}
                <button 
                    type="button" 
                    onClick={handleFormat}
                    disabled={isFormatting}
                    className="text-[10px] flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/40 transition disabled:opacity-50"
                    title="Rapikan Kode (Prettier)"
                >
                    <Wand2 size={12} className={isFormatting ? "animate-spin" : ""} />
                    {isFormatting ? "Formatting..." : "Format Code"}
                </button>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-inner group-focus-within:ring-2 ring-pink-500/20 transition">
                <CodeMirror 
                  value={code} 
                  height="200px" 
                  theme={theme === 'dark' ? dracula : githubLight} 
                  extensions={[getLanguageExtension(language)]}
                  onChange={(val) => setCode(val)}
                />
              </div>
              <div className="text-right">
                 <span className={`text-[10px] ${code.length > MAX_CODE_LENGTH ? 'text-red-500' : 'text-gray-400'}`}>
                    {code.length} / {MAX_CODE_LENGTH} chars
                 </span>
              </div>
            </div>

            {/* Deskripsi */}
            <div>
              <div className="flex justify-between">
                <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Deskripsi</label>
                <span className={`text-[10px] ${description.length > MAX_DESC_LENGTH ? 'text-red-500' : 'text-gray-400'}`}>{description.length}/{MAX_DESC_LENGTH}</span>
              </div>
              <textarea 
                rows="2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Catatan singkat..."
                maxLength={MAX_DESC_LENGTH}
                className="w-full px-4 py-2 bg-white dark:bg-[#252a33] border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500/50 dark:text-white focus:outline-none transition"
              />
            </div>

          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-pastel-dark-border flex justify-end gap-3">
          <button 
            onClick={onClose}
            type="button"
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg font-medium transition hover:scale-105 active:scale-95"
          >
            Batal
          </button>
          <button 
            type="submit"
            form="snippet-form"
            disabled={loading}
            className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-bold shadow-lg shadow-pink-500/30 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18}/> : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  )
}