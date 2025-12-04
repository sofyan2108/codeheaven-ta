import * as prettier from "prettier/standalone"
import * as parserBabel from "prettier/plugins/babel"
import * as parserEstree from "prettier/plugins/estree"
import * as parserHtml from "prettier/plugins/html"
import * as parserCss from "prettier/plugins/postcss"

// Mapping bahasa aplikasi ke parser Prettier
const parserMap = {
  javascript: 'babel',
  js: 'babel',
  jsx: 'babel',
  html: 'html',
  css: 'css',
  json: 'json',
  // Python & PHP belum didukung penuh di versi standalone basic ini tanpa plugin berat tambahan
}

export const formatCode = async (code, language) => {
  const parser = parserMap[language.toLowerCase()]
  
  if (!parser) {
    // Jika bahasa tidak didukung formatter, kembalikan kode asli (jangan error)
    return code
  }

  try {
    const formatted = await prettier.format(code, {
      parser: parser,
      plugins: [parserBabel, parserEstree, parserHtml, parserCss],
      // Opsi formatting standar
      semi: true,
      singleQuote: true,
      tabWidth: 2,
      printWidth: 80,
    })
    
    // Prettier kadang menambah newline di akhir, bisa kita trim jika mau
    return formatted
  } catch (error) {
    console.error("Format Error:", error)
    throw new Error("Gagal memformat kode. Pastikan sintaks benar.")
  }
}