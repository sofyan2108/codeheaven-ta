import { javascript } from '@codemirror/lang-javascript'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { python } from '@codemirror/lang-python'
import { php } from '@codemirror/lang-php'
import { java } from '@codemirror/lang-java'
import { sql } from '@codemirror/lang-sql'
import { cpp } from '@codemirror/lang-cpp'
// Kita gunakan markdown sebagai "fallback" untuk bahasa yang tidak dikenal highlightnya
import { markdown } from '@codemirror/lang-markdown' 

// 1. Helper Extension (Logic Pewarnaan)
export const getLanguageExtension = (lang) => {
  // Normalisasi string ke lowercase agar pencarian tidak sensitif huruf besar/kecil
  const normalizedLang = lang.toLowerCase().trim()

  switch(normalizedLang) {
    case 'javascript': 
    case 'js': 
    case 'jsx': 
    case 'typescript': 
    case 'ts': 
    case 'tsx':
        return javascript()
    
    case 'html': return html()
    case 'css': return css()
    case 'python': case 'py': return python()
    case 'php': return php()
    case 'java': return java()
    case 'sql': return sql()
    case 'c++': case 'cpp': case 'c': case 'c#': case 'csharp': return cpp()
    
    // Default: Jika bahasa tidak dikenal (misal 'Go', 'Rust'), 
    // kembalikan Markdown agar setidaknya tidak error dan tetap berwarna sedikit.
    default: return markdown() 
  }
}

// 2. Helper Warna Badge (Logic Kosmetik)
export const getLangColor = (lang) => {
  const l = lang.toLowerCase().trim()
  
  if (['js', 'javascript', 'jsx', 'ts', 'typescript'].includes(l)) return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
  if (['html', 'xml'].includes(l)) return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20'
  if (['css', 'scss', 'sass', 'less'].includes(l)) return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
  if (['py', 'python', 'django'].includes(l)) return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
  if (['php', 'laravel'].includes(l)) return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
  if (['java', 'kotlin', 'android'].includes(l)) return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
  
  // Default warna abu-abu untuk bahasa lain
  return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800'
}

// 3. DATABASE NAMA BAHASA (Hanya String)
// Ini hanya untuk saran di dropdown. User bebas mengetik selain ini.
export const popularLanguages = [
  "JavaScript", "HTML", "CSS", "Python", "SQL", "Java", "PHP", "C++", 
  "TypeScript", "C#", "C", "Go", "Rust", "Swift", "Ruby", "Kotlin", 
  "Dart", "R", "Shell", "PowerShell", "Markdown", "JSON", "XML", "YAML",
  "Scala", "Perl", "Lua", "Elixir", "Haskell", "Objective-C"
].sort() // Urutkan abjad

// 4. Helper File Extension untuk Download
export const getFileExtension = (lang) => {
  const normalizedLang = lang.toLowerCase().trim()
  const map = {
    javascript: 'js', js: 'js', jsx: 'jsx',
    typescript: 'ts', ts: 'ts', tsx: 'tsx',
    html: 'html',
    css: 'css',
    python: 'py', py: 'py',
    php: 'php',
    java: 'java',
    sql: 'sql',
    'c++': 'cpp', cpp: 'cpp', c: 'c',
    'c#': 'cs', csharp: 'cs',
    go: 'go',
    rust: 'rs',
    swift: 'swift',
    ruby: 'rb',
    kotlin: 'kt',
    dart: 'dart',
    r: 'r',
    shell: 'sh',
    powershell: 'ps1',
    markdown: 'md',
    json: 'json',
    xml: 'xml',
    yaml: 'yaml'
  }
  return map[normalizedLang] || 'txt'
}