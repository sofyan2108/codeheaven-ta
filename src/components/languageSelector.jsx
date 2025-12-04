import { useState, useRef, useEffect } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { popularLanguages } from '../utils/languageConfig'

export default function LanguageSelector({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const wrapperRef = useRef(null)

  // Filter bahasa berdasarkan ketikan
  const filteredLangs = popularLanguages.filter(lang => 
    lang.toLowerCase().includes(search.toLowerCase())
  )

  // Logic: Klik di luar komponen akan menutup dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [wrapperRef])

  // Saat user memilih opsi
  const handleSelect = (lang) => {
    onChange(lang) // Kirim ke parent
    setSearch('')  // Reset search (opsional, bisa juga diset ke lang)
    setIsOpen(false)
  }

  // Saat user mengetik manual (untuk bahasa custom yang tidak ada di list)
  const handleType = (e) => {
    const val = e.target.value
    setSearch(val)
    onChange(val)
    setIsOpen(true)
  }

  return (
    <div className="relative" ref={wrapperRef}>
      {/* Input Field */}
      <div className="relative">
        <input
          type="text"
          value={isOpen ? search : value} // Tampilkan search saat ngetik, tampilkan value saat diam
          onChange={handleType}
          onClick={() => {
            setIsOpen(true)
            setSearch(value) // Isi search dengan value saat ini biar user bisa edit
          }}
          placeholder="Pilih atau ketik..."
          className="w-full pl-4 pr-10 py-2 bg-white dark:bg-[#252a33] border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-pastel-primary/50 dark:focus:ring-pastel-primary-dark/50 focus:outline-none dark:text-white transition cursor-text"
        />
        {/* Icon Panah Kecil */}
        <ChevronDown 
            size={16} 
            className={`absolute right-3 top-3 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </div>

      {/* Dropdown Menu Custom */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-[#2b303b] border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl max-h-48 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-100">
          
          {filteredLangs.length > 0 ? (
            filteredLangs.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => handleSelect(lang)}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-pastel-bg dark:hover:bg-white/5 transition-colors flex items-center justify-between group"
              >
                <span className="text-gray-700 dark:text-gray-200 group-hover:text-pastel-primary dark:group-hover:text-pastel-primary-dark">
                    {lang}
                </span>
                {/* Checkmark jika sedang dipilih */}
                {value.toLowerCase() === lang.toLowerCase() && (
                    <Check size={14} className="text-pastel-secondary dark:text-pastel-secondary-dark" />
                )}
              </button>
            ))
          ) : (
            // Jika tidak ditemukan di list populer
            <div className="px-4 py-3 text-xs text-gray-400 italic text-center">
              Bahasa "{search}" akan disimpan sebagai custom.
            </div>
          )}
        </div>
      )}
    </div>
  )
}