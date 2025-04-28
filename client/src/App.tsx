import { useEffect } from "react";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./routes/ScrollToTop";
import i18n from "./i18n";
import { I18nextProvider } from "react-i18next";
import { useLanguageStore } from "./langStore";

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
          <button onClick={() => setLanguage("en")}>English</button>
          <button onClick={() => setLanguage("ar")}>العربية</button>
        </div>
        <ScrollToTop />
        <AppRoutes />
      </I18nextProvider>
    </>
  );
}

export default App;
