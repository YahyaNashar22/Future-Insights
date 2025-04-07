import { useEffect } from "react";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./routes/ScrollToTop";

function App() {
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
      <ScrollToTop />
      <AppRoutes />
    </>
  );
}

export default App;
