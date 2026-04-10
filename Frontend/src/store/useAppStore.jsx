import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  // FIXED: Initialize from localStorage to persist language across reloads
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('language') || 'hi';
  });

  // FIXED: Update localStorage whenever the language changes
  useEffect(() => {
    localStorage.setItem('language', lang);
    // If you have i18n configured, uncomment the line below:
    // i18n.changeLanguage(lang);
  }, [lang]);

  return (
    <AppContext.Provider value={{ lang, setLang }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppStore() {
  return useContext(AppContext)
}