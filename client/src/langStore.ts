import { create } from "zustand";

type LanguageStore = {
  language: "en" | "ar"; // You can extend this if needed with more languages
  setLanguage: (lang: "en" | "ar") => void;
};

export const useLanguageStore = create<LanguageStore>((set) => ({
  language: (localStorage.getItem("language") as "en" | "ar") || "en",
  setLanguage: (lang) => {
    localStorage.setItem("language", lang);
    set({ language: lang });
  },
}));
