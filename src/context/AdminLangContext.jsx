import { createContext, useContext, useState } from 'react';
import es from '../locales/es.json';
import en from '../locales/en.json';

const TRANSLATIONS = { es, en };

const AdminLangContext = createContext(null);

export const AdminLangProvider = ({ children }) => {
  const [lang, setLangState] = useState(
    () => localStorage.getItem('adminLang') || 'es'
  );

  const setLang = (l) => {
    localStorage.setItem('adminLang', l);
    setLangState(l);
  };

  const t = (TRANSLATIONS[lang] || TRANSLATIONS.es).admin;

  return (
    <AdminLangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </AdminLangContext.Provider>
  );
};

export const useAdminT = () => {
  const ctx = useContext(AdminLangContext);
  if (!ctx) throw new Error('useAdminT must be used inside AdminLangProvider');
  return ctx;
};
