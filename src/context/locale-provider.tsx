import React, { createContext, useEffect, useState } from 'react';
import languageDetector from '@/lib/languageDetector';

interface ICart {
  currency: 'USD' | 'BYN';
  // $ or ₽
  currencySign: '$' | 'byn';
  toggleCurrency: () => void;
  currentLanguage: string;
}

export const LocaleContext = createContext<ICart>({
  currency: 'USD',
  currencySign: '$',
  toggleCurrency: () => {
  },
  currentLanguage: 'en',
});

const LocaleProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrency] = useState<'USD' | 'BYN'>('USD');
  const [currencySign, setCurrencySign] = useState<'$' | 'byn'>('$');
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');

  const toggleCurrency = () => {
    if (currency === 'USD') {
      setCurrency('BYN');
      setCurrencySign('byn');
      setCurrentLanguage('ru');
    } else {
      setCurrency('USD');
      setCurrencySign('$');
      setCurrentLanguage('en');
    }
  };

  useEffect(() => {
    const lang = languageDetector.detect() || 'en';
    if (lang === 'ru') {
      setCurrency('BYN');
      setCurrencySign('byn');
      setCurrentLanguage('ru');
    } else {
      setCurrency('USD');
      setCurrencySign('$');
      setCurrentLanguage('en');
    }
  }, []);


  return (
    <LocaleContext.Provider value={{ currency, currencySign, toggleCurrency, currentLanguage }}>
      {children}
    </LocaleContext.Provider>
  );
};

export default LocaleProvider;