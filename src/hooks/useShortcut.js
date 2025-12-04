import { useEffect } from 'react'

/**
 * Hook shortcut yang lebih fleksibel
 * options: { ctrlKey: boolean, altKey: boolean }
 */
export const useShortcut = (targetKey, callback, options = {}) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const isKeyMatch = event.key.toLowerCase() === targetKey.toLowerCase()
      
      const isCtrl = event.ctrlKey || event.metaKey
      const isAlt = event.altKey

      // Default: false jika tidak didefinisikan
      const reqCtrl = options.ctrlKey || false
      const reqAlt = options.altKey || false

      // Cek apakah tombol yang ditekan SESUAI dengan requirement
      // (Misal: jika reqCtrl true, maka isCtrl harus true. Jika false, isCtrl harus false)
      if (isKeyMatch && isCtrl === reqCtrl && isAlt === reqAlt) {
        event.preventDefault()
        callback()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [targetKey, callback, options.ctrlKey, options.altKey])
}