import { Link } from "react-router-dom";
import styles from "./UnderDevelopment.module.css"; // Import the CSS file

const UnderDevelopment = () => {
  return (
    <div className={styles.underDevelopmentContainer}>
      <h1 className={styles.devTitle}>Under Development</h1>
      <h2 className={styles.devMessage}>We're working on something amazing!</h2>
      <p className={styles.devDescription}>
        This page is currently under development. Please check back later.
      </p>
      <Link to="/" className={styles.homeLink}>
        Go Home
      </Link>
    </div>
  );
};

export default UnderDevelopment;
