import styles from "./CourseCatalogueHeader.module.css";

import logo from "../../assets/icons/logo_svg_white.svg";
import cpd from "../../assets/icons/cpd_logo.webp";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../../store";
import { useState } from "react";
import SignoutModal from "../../components/SignoutModal/SignoutModal";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../langStore";

const CourseCatalogueHeader = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const language = useLanguageStore((state) => state.language);

  const isArabic = language === "ar";

  const { user } = useUserStore();

  const [showModal, setShowModal] = useState<boolean>(false);

  const getInitials = (name: string) => {
    const nameParts = name.split(" ");
    const initials = nameParts
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
    return initials;
  };
  return (
    <header className={styles.wrapper}>
      <div className={styles.logoContainer}>
        <img
          src={logo}
          alt="logo"
          loading="lazy"
          width={150}
          onClick={() => navigate("/")}
        />
        <img
          src={cpd}
          alt="cpd logo"
          loading="lazy"
          width={70}
          onClick={() => navigate("/cpd")}
        />
      </div>
      <ul className={`${styles.navLinks} ${isArabic ? styles.arabic : ""}`}>
        <li>
          <Link to="/" className={styles.link}>
            {t("nav-1")}
          </Link>
        </li>
        <li>
          <Link to="/course-catalogue" className={styles.link}>
            {t("nav-2")}
          </Link>
        </li>
        <li>
          <Link to="/coaching-session" className={styles.link}>
            {t("nav-3")}
          </Link>
        </li>
        <Link to="/cpd" className={styles.link}>
          {t("nav-9")}
        </Link>
        {user && (
          <>
            <li>
              <Link to="/my-courses" className={styles.link}>
                {t("nav-4")}
              </Link>
            </li>
            <li>
              <Link to="/my-transactions" className={styles.link}>
                {t("nav-8")}
              </Link>
            </li>
          </>
        )}
        {user &&
          (user.role === "teacher" ||
            user.role === "admin" ||
            user.role === "super") && (
            <li>
              <Link to="/dashboard" className={styles.link}>
                {t("nav-5")}
              </Link>
            </li>
          )}
        {!user && (
          <li>
            <Link to="/teacher-signup" className={styles.link}>
              {t("nav-6")}
            </Link>
          </li>
        )}
        {user && user.role === "super" && (
          <li>
            <Link to="/user-management" className={styles.link}>
              {t("nav-7")}
            </Link>
          </li>
        )}
      </ul>
      {user ? (
        <div className={styles.userInitials} onClick={() => setShowModal(true)}>
          {getInitials(user.fullname)}
        </div>
      ) : (
        <div className={styles.signContainer}>
          <Link to="/signin" className={styles.signin}>
            {t("login")}
          </Link>
          <Link to="/signup" className={styles.signup}>
            {t("signup")}
          </Link>
        </div>
      )}
      {showModal && <SignoutModal setShowModal={setShowModal} />}
    </header>
  );
};

export default CourseCatalogueHeader;
