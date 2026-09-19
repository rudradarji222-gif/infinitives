import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { translations } from './translations';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('ih-lang') || 'en');

  useEffect(() => {
    localStorage.setItem('ih-lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback(
    (key) => translations[lang]?.[key] || translations.en[key] || key,
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => useContext(LanguageContext);
