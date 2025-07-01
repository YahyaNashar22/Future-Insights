import styles from "./MobileHeader.module.css";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../../store";
import { useLanguageStore } from "../../langStore";
import { useTranslation } from "react-i18next";

import SignoutModal from "../../components/SignoutModal/SignoutModal";

import logo from "../../assets/icons/logo_svg.svg";
import cpd from "../../assets/icons/cpd_logo.webp";

import uk from "../../assets/icons/uk.png";
import uae from "../../assets/icons/uae.png";

const MobileHeader = () => {
  const { t } = useTranslation();
  const { setLanguage } = useLanguageStore();

  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

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
    <header className={styles.mobileHeader}>
      {/* Logo */}
      <div className={styles.logoContainer}>
        <img
          src={logo}
          alt="logo"
          loading="lazy"
          height={40}
          onClick={() => navigate("/")}
        />
        <img
          src={cpd}
          alt="cpd logo"
          loading="lazy"
          height={60}
          onClick={() => navigate("/cpd")}
        />
      </div>

      {/* Burger Menu Icon */}
      <div className={styles.burgerIcon} onClick={() => setMenuOpen(!menuOpen)}>
        <div className={`${styles.bar} ${menuOpen ? styles.open1 : ""}`}></div>
        <div className={`${styles.bar} ${menuOpen ? styles.open2 : ""}`}></div>
        <div className={`${styles.bar} ${menuOpen ? styles.open3 : ""}`}></div>
      </div>

      {/* Mobile Menu */}
      <nav
        className={`${styles.mobileMenu} ${menuOpen ? styles.showMenu : ""}`}
      >
        {/* Close Button */}
        <button
          className={styles.closeButton}
          onClick={() => setMenuOpen(false)}
        >
          &times;
        </button>

        <ul>
          <li>
            <Link
              to="/"
              className={styles.link}
              onClick={() => setMenuOpen(false)}
            >
              {t("nav-1")}
            </Link>
          </li>
          <li>
            <Link
              to="/course-catalogue"
              className={styles.link}
              onClick={() => setMenuOpen(false)}
            >
              {t("nav-2")}
            </Link>
          </li>
          <li>
            <Link
              to="/coaching-session"
              className={styles.link}
              onClick={() => setMenuOpen(false)}
            >
              {t("nav-3")}
            </Link>
          </li>
          <li>
            <Link to="/cpd" className={styles.link}>
              {t("nav-9")}
            </Link>
          </li>
          {user && (
            <>
              <li>
                <Link
                  to="/my-courses"
                  className={styles.link}
                  onClick={() => setMenuOpen(false)}
                >
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
                <Link
                  to="/dashboard"
                  className={styles.link}
                  onClick={() => setMenuOpen(false)}
                >
                  {t("nav-5")}
                </Link>
              </li>
            )}
          {!user && (
            <li>
              <Link
                to="/instructor-request"
                className={styles.link}
                onClick={() => setMenuOpen(false)}
              >
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
          <div
            className={styles.userInitials}
            onClick={() => setShowModal(true)}
          >
            {getInitials(user.fullname)}
          </div>
        ) : (
          <div className={styles.authButtons}>
            <Link
              to="/signin"
              className={styles.signin}
              onClick={() => setMenuOpen(false)}
            >
              {t("login")}
            </Link>
            <Link
              to="/signup"
              className={styles.signup}
              onClick={() => setMenuOpen(false)}
            >
              {t("signup")}
            </Link>
          </div>
        )}

        <div className="language-btn-container">
          <button
            onClick={() => setLanguage("en")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <img src={uk} alt="united kingdoms" width={24} />
            English
          </button>
          <button
            onClick={() => setLanguage("ar")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            العربية
            <img src={uae} alt="united kingdoms" width={24} />
          </button>
        </div>
      </nav>
      {showModal && <SignoutModal setShowModal={setShowModal} />}
    </header>
  );
};

export default MobileHeader;
