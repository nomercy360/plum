import React, { createContext, useEffect, useState } from 'react';
import languageDetector from '@/lib/languageDetector';

interface ILocaleContext {
  currentLanguage: string;
}

export const LocaleContext = createContext<ILocaleContext>({
  currentLanguage: 'en',
});

const LocaleProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const detectedLanguage = languageDetector.detect() || 'en';
    setCurrentLanguage(detectedLanguage);
  }, []);

  return <LocaleContext.Provider value={{ currentLanguage }}>{children}</LocaleContext.Provider>;
};

export default LocaleProvider;
