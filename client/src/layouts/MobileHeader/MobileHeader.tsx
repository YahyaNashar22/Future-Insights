import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./MobileHeader.module.css";
import logo from "../../assets/icons/logo_svg.svg";
import { useUserStore } from "../../store";
import SignoutModal from "../../components/SignoutModal/SignoutModal";

const MobileHeader = () => {
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
      <img
        src={logo}
        alt="Logo"
        className={styles.logo}
        onClick={() => navigate("/")}
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
          {user && (
            <li>
              <Link to="/my-courses" className={styles.link}>
                My Courses
              </Link>
            </li>
          )}
          {user && (user.role === "teacher" || user.role === "admin") && (
            <li>
              <Link to="/dashboard" className={styles.link}>
                Dashboard
              </Link>
            </li>
          )}
          {!user && (
            <li>
              <Link to="/instructor-request" className={styles.link}>
                Become an Instructor
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
        )}
      </nav>
      {showModal && <SignoutModal setShowModal={setShowModal} />}
    </header>
  );
};

export default MobileHeader;
