import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { sepedi } from "./sepedi";

export type Language = "English" | "Sepedi";
export const LANGUAGE_STORAGE_KEY = "sheconnect-language";

export function translate(text: string, language: Language): string {
  return language === "Sepedi" ? sepedi[text] ?? text : text;
}

export function parseLanguage(value: unknown): Language {
  return value === "Sepedi" ? "Sepedi" : "English";
}

const LanguageContext = createContext({
  language: "English" as Language,
  setLanguage: (_language: Language) => {},
  t: (text: string) => text,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, updateLanguage] = useState<Language>("English");
  useEffect(() => {
    try {
      updateLanguage(parseLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)));
    } catch { /* Language switching still works when browser storage is unavailable. */ }
  }, []);
  useEffect(() => {
    document.documentElement.lang = language === "Sepedi" ? "nso" : "en";
  }, [language]);
  const setLanguage = (next: Language) => {
    updateLanguage(next);
    try { window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next); } catch { /* Optional device preference. */ }
  };
  return <LanguageContext.Provider value={{ language, setLanguage, t: text => translate(text, language) }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}