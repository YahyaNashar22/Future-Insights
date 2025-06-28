import "./App.css";

import { useEffect } from "react";
import i18n from "./i18n";
import { I18nextProvider } from "react-i18next";
import { useLanguageStore } from "./langStore";

import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./routes/ScrollToTop";

import uae from "./assets/icons/uae.png";
import uk from "./assets/icons/uk.png";

function App() {
  const { language, setLanguage } = useLanguageStore();

  // Update i18n language when Zustand store language changes
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  useEffect(() => {
    document.body.setAttribute("dir", language === "ar" ? "rtl" : "ltr");
  }, [language]);

  useEffect(() => {
    const handleActivity = () => {
      localStorage.setItem("future-insights-login-time", Date.now().toString());
    };

    window.addEventListener("click", handleActivity);
    window.addEventListener("keydown", handleActivity);

    return () => {
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("keydown", handleActivity);
    };
  }, []);
  return (
    <>
      <I18nextProvider i18n={i18n}>
        <div className="language-btn-container">
          <button
            style={{
              color: "var(--primary-blue)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
            onClick={() => setLanguage("en")}
          >
            <img src={uk} alt="united kingdoms" width={24} />
            English
          </button>
          <button
            style={{
              color: "var(--primary-blue)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
            onClick={() => setLanguage("ar")}
          >
            العربية
            <img src={uae} alt="united arabs emirates" width={24} />
          </button>
        </div>
        <ScrollToTop />
        <AppRoutes />
      </I18nextProvider>
    </>
  );
}

export default App;
