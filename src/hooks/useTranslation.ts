/**
 * useTranslation Hook
 * Custom hook for accessing translations
 */

import translations from '../locales/pt-BR.json';

type TranslationPath = string;

/**
 * Hook para acessar traduções de forma tipada
 * Uso: const t = useTranslation();
 *      t('auth.tagline') // "Pule a fila, sempre"
 */
export const useTranslation = () => {
  const currentLanguage = 'pt-BR';
  const messages = translations[currentLanguage as keyof typeof translations];

  const translate = (path: TranslationPath, defaultValue?: string): string => {
    try {
      const keys = path.split('.');
      let value: any = messages;

      for (const key of keys) {
        value = value[key];
        if (value === undefined) {
          return defaultValue || path;
        }
      }

      return typeof value === 'string' ? value : path;
    } catch (error) {
      console.warn(`Translation not found for key: ${path}`);
      return defaultValue || path;
    }
  };

  return {
    t: translate,
    locale: currentLanguage,
  };
};

/**
 * Função auxiliar para acessar traduções fora de componentes React
 */
export const getTranslation = (path: TranslationPath, defaultValue?: string): string => {
  try {
    const keys = path.split('.');
    const message = translations['pt-BR'];
    let value: any = message;

    for (const key of keys) {
      value = value[key];
      if (value === undefined) {
        return defaultValue || path;
      }
    }

    return typeof value === 'string' ? value : path;
  } catch (error) {
    console.warn(`Translation not found for key: ${path}`);
    return defaultValue || path;
  }
};

