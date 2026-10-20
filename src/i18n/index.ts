import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from '@/i18n/en.json'
import id from '@/i18n/id.json'

const STORAGE_KEY = 'skillopa_locale'

function detectLocale(): string {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'en' || stored === 'id') return stored
  const browser = navigator.language.slice(0, 2)
  return browser === 'id' ? 'id' : 'en'
}

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    id: { translation: id },
  },
  lng: detectLocale(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export function setAppLocale(locale: 'en' | 'id') {
  localStorage.setItem(STORAGE_KEY, locale)
  void i18n.changeLanguage(locale)
}

export default i18n
