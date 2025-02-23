import { Outlet } from "react-router-dom";
import Header from "../layouts/Header/Header";
import Footer from "../layouts/Footer/Footer";
import MobileHeader from "../layouts/MobileHeader/MobileHeader";
import { useEffect, useState } from "react";

const Container = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1100);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <>
      {isMobile ? <MobileHeader /> : <Header />}
      <Outlet />
      <Footer />
    </>
  );
};

export default Container;
