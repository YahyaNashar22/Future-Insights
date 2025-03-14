import styles from "./Header.module.css";

import logo from "../../assets/icons/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../../store";

const Header = () => {
  const navigate = useNavigate();

  const { user } = useUserStore();

  const getInitials = (name: string) => {
    const nameParts = name.split(" ");
    const initials = nameParts
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
    return initials;
  };

  return (
    <header className={styles.wrapper}>
      <img src={logo} alt="logo" loading="lazy" onClick={() => navigate("/")} />
      <ul className={styles.navLinks}>
        <li>
          <Link to="/" className={styles.link}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/course-catalogue" className={styles.link}>
            Course Catalogue
          </Link>
        </li>
        <li>
          <Link to="/teacher-signup" className={styles.link}>
            Become an Instructor
          </Link>
        </li>
        <li>
          <Link to="/my-courses" className={styles.link}>
            My Courses
          </Link>
        </li>
      </ul>
      {user ? (
        <div className={styles.userInitials}>{getInitials(user.fullname)}</div>
      ) : (
        <div className={styles.signContainer}>
          <Link to="/signin" className={styles.signin}>
            Login
          </Link>
          <Link to="/signup" className={styles.signup}>
            Sign up
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
