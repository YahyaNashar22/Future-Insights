import { Link } from "react-router-dom";
import styles from "./NotFound.module.css"; // Import the CSS file

const NotFound = () => {
  return (
    <div className={styles.notFoundContainer}>
      <h1 className={styles.errorCode}>404</h1>
      <h2 className={styles.errorMessage}>Page Not Found</h2>
      <p className={styles.errorDescription}>
        Sorry, the page you're looking for doesn't exist.
      </p>
      <Link to="/" className={styles.homeLink}>
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
