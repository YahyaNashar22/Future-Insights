import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "../src/assets/locales/en.json";
import arTranslation from "../src/assets/locales/ar.json";

i18n
  .use(initReactI18next) // pass i18n down to react-i18next
  .init({
    resources: {
      en: { translation: enTranslation },
      ar: { translation: arTranslation },
    },
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
