
import { useState, useEffect } from 'react';
import { languageService, Language } from '@/services/languageService';

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    languageService.getCurrentLanguage()
  );

  useEffect(() => {
    const unsubscribe = languageService.subscribe((language) => {
      setCurrentLanguage(language);
    });

    return unsubscribe;
  }, []);

  const changeLanguage = (language: Language) => {
    languageService.setLanguage(language);
  };

  const t = (key: any, fallback?: string) => {
    return languageService.translate(key, fallback);
  };

  const formatNumber = (number: number, options?: Intl.NumberFormatOptions) => {
    return languageService.formatNumber(number, options);
  };

  const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions) => {
    return languageService.formatDate(date, options);
  };

  return {
    currentLanguage,
    changeLanguage,
    t,
    formatNumber,
    formatDate,
    availableLanguages: languageService.getAvailableLanguages(),
    direction: languageService.getDirection(),
  };
};
