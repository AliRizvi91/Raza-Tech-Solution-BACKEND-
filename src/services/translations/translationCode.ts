const dotenv = require('dotenv')
dotenv.config()

import axios from 'axios'

// MyMemory Translation API endpoint
const TRANSLATE_API: string = process.env.Translation_API || ''

// ✅ Allow only en, ur, ar
function normalizeLang(lang: string): 'en' | 'ur' | 'ar' {
  if (!lang) return 'en'

  const normalized = lang.toLowerCase().trim()

  if (normalized === 'ur') return 'ur'
  if (normalized === 'ar') return 'ar'
  return 'en' // default fallback
}

async function translateText(text: string, targetLang: string): Promise<string> {
  const lang = normalizeLang(targetLang)

  try {
    if (!text) return text

    // 🚀 Skip translation if language is English
    if (lang === 'en') {
      return text
    }

    if (!TRANSLATE_API) {
      console.error('Translation API endpoint not configured')
      return text
    }

    const response = await axios.get(TRANSLATE_API, {
      params: {
        q: text,
        langpair: `en|${lang}`,
        de: 'your-email@example.com' // optional
      }
    })

    return response.data.responseData?.translatedText || text
  } catch (error) {
    console.error('Translation error:', error)
    return text
  }
}

export async function translateData(data: any, lang: string): Promise<any> {
  const result = JSON.parse(JSON.stringify(data))
  const normalizedLang = normalizeLang(lang)

  async function translateObject(obj: any): Promise<any> {
    for (const key in obj) {
      if (!obj[key]) continue

      if (typeof obj[key] === 'string') {
        obj[key] = await translateText(obj[key], normalizedLang)
      } else if (typeof obj[key] === 'object') {
        obj[key] = await translateObject(obj[key])
      }
    }
    return obj
  }

  return await translateObject(result)
}
