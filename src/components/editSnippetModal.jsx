import { X, Save, Trash2, Loader2, Tag } from 'lucide-react'
import { useState, useEffect } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { dracula } from '@uiw/codemirror-theme-dracula'
import { githubLight } from '@uiw/codemirror-theme-github'
import { useSnippetStore } from '../store/snippetStore'
import { useAlertStore } from '../store/alertStore'
import { useThemeStore } from '../store/themeStore'
import { getLanguageExtension, popularLanguages } from '../utils/languageConfig'
import LanguageSelector from './languageSelector'

export default function EditSnippetModal({ isOpen, onClose, snippet }) {
  const { updateSnippet, deleteSnippet } = useSnippetStore()
  const { showAlert } = useAlertStore()
  const { theme } = useThemeStore()
  const [loading, setLoading] = useState(false)
  
  const [title, setTitle] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [isPublic, setIsPublic] = useState(false)

  useEffect(() => {
    if (snippet) {
      setTitle(snippet.title)
      setLanguage(snippet.language)
      setCode(snippet.code)
      setDescription(snippet.description || '')
      setTagsInput(snippet.tags ? snippet.tags.join(', ') : '')
      setIsPublic(snippet.is_public)
    }
  }, [snippet, isOpen])

  if (!isOpen) return null

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const tagsArray = tagsInput.split(',').map(t => t.trim()).filter(t => t.length > 0)
      
      await updateSnippet(snippet.id, {
        title, language, code, description, is_public: isPublic, tags: tagsArray
      })
      
      onClose()
      showAlert('success', 'Snippet Diperbarui', 'Perubahan telah disimpan.')
    } catch (error) {
      showAlert('error', 'Gagal Update', error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if(!confirm("Yakin ingin menghapus snippet ini secara permanen?")) return

    setLoading(true)
    try {
      await deleteSnippet(snippet.id)
      onClose()
      showAlert('success', 'Terhapus', 'Snippet telah dihapus permanen.')
    } catch (error) {
      showAlert('error', 'Gagal Hapus', error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in zoom-in-95 duration-200">
      
      <div className="bg-white dark:bg-pastel-dark-surface w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-100 dark:border-pastel-dark-border overflow-hidden flex flex-col max-h-[95vh]">
        
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-pastel-dark-border bg-gray-50 dark:bg-white/5">
          <h3 className="font-bold text-lg text-gray-800 dark:text-white">Edit Snippet</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition text-gray-500 hover:rotate-90 duration-300">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <form id="edit-form" onSubmit={handleUpdate} className="space-y-4">
            
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Judul</label>
              <input 
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                className="w-full px-4 py-2 bg-white dark:bg-[#252a33] border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500/50 dark:focus:ring-pink-500/50 dark:text-white focus:outline-none" 
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Bahasa</label>
                <LanguageSelector value={language} onChange={(val) => setLanguage(val)} />
               </div>
               
               <div>
                <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Visibility</label>
                <select 
                    value={isPublic} 
                    onChange={e => setIsPublic(e.target.value === 'true')} 
                    className="w-full px-4 py-2 bg-white dark:bg-[#252a33] border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500/50 dark:focus:ring-pink-500/50 dark:text-white focus:outline-none cursor-pointer"
                >
                  <option value="false">Private</option>
                  <option value="true">Public</option>
                </select>
               </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Tags</label>
              <div className="relative">
                <Tag className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <input 
                    type="text" 
                    value={tagsInput} 
                    onChange={e => setTagsInput(e.target.value)} 
                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#252a33] border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500/50 dark:focus:ring-pink-500/50 dark:text-white focus:outline-none" 
                    placeholder="Pisahkan dengan koma..." 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Kode</label>
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                <CodeMirror 
                    value={code} 
                    height="300px" 
                    theme={theme === 'dark' ? dracula : githubLight} 
                    extensions={[getLanguageExtension(language)]} 
                    onChange={val => setCode(val)} 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Deskripsi</label>
              <textarea 
                rows="2" 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                className="w-full px-4 py-2 bg-white dark:bg-[#252a33] border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500/50 dark:focus:ring-pink-500/50 dark:text-white focus:outline-none" 
              />
            </div>
          </form>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-pastel-dark-border flex justify-between items-center">
          <button 
            onClick={handleDelete} 
            type="button" 
            className="text-red-500 hover:text-white hover:bg-red-500 px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 hover:shadow-lg hover:shadow-red-500/30"
          >
            <Trash2 size={18} /> <span className="hidden sm:inline">Hapus Snippet</span>
          </button>

          <div className="flex gap-3">
            <button 
                onClick={onClose} 
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg font-medium transition hover:scale-105 active:scale-95"
            >
                Batal
            </button>
            <button 
                type="submit" 
                form="edit-form" 
                disabled={loading} 
                className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-bold shadow-lg shadow-pink-500/30 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18}/> : <><Save size={18} /> Simpan Perubahan</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}