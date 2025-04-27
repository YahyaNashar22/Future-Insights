import { create } from "zustand";

type LanguageStore = {
  language: "en" | "ar"; // You can extend this if needed with more languages
  setLanguage: (lang: "en" | "ar") => void;
};

export const useLanguageStore = create<LanguageStore>((set) => ({
  language: "en", // default language
  setLanguage: (lang) => set({ language: lang }), // set the language
}));
