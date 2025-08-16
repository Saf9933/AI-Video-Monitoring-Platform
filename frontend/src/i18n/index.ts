import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation resources
import zhCN from './locales/zh-CN.json';
import en from './locales/en.json';

// Configure i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // Default language is Chinese
    lng: 'zh-CN',
    fallbackLng: 'en',
    
    // Language detection options
    detection: {
      // Detect from localStorage, then navigator
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },

    // Available languages - include both zh and zh-CN to handle browser detection
    supportedLngs: ['zh-CN', 'zh', 'en'],

    // Translation resources - use the JSON files directly
    resources: {
      'zh-CN': {
        translation: zhCN
      },
      'zh': {
        translation: zhCN // Use same translations for 'zh' as 'zh-CN'
      },
      'en': {
        translation: en
      },
    },

    // Interpolation options
    interpolation: {
      escapeValue: false, // React already does escaping
    },

    // React i18next options
    react: {
      useSuspense: false,
    },

    // Return key if translation is missing (development mode)
    returnKeyIfNotFound: true,
    returnNull: false,
    
    // Enable debug in development
    debug: import.meta.env.DEV,
  });

export default i18n;