import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./MobileHeader.module.css";
import logo from "../../assets/icons/logo.png";

const MobileHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.mobileHeader}>
      {/* Logo */}
      <img
        src={logo}
        alt="Logo"
        className={styles.logo}
        onClick={() => setMenuOpen(false)}
      />

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
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/course-catalogue"
              className={styles.link}
              onClick={() => setMenuOpen(false)}
            >
              Course Catalogue
            </Link>
          </li>
          <li>
            <Link
              to="/teacher-signup"
              className={styles.link}
              onClick={() => setMenuOpen(false)}
            >
              Become an Instructor
            </Link>
          </li>
          <li>
            <Link
              to="/my-courses"
              className={styles.link}
              onClick={() => setMenuOpen(false)}
            >
              My Courses
            </Link>
          </li>
        </ul>

        <div className={styles.authButtons}>
          <Link
            to="/signin"
            className={styles.signin}
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/signup"
            className={styles.signup}
            onClick={() => setMenuOpen(false)}
          >
            Sign up
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default MobileHeader;
