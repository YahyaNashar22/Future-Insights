import styles from "./HeroTitle.module.css";

import graffiti from "../../assets/icons/title_graffiti.png";
import { Link } from "react-router-dom";
import { useUserStore } from "../../store";

const HeroTitle = () => {
  const { user } = useUserStore();
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <img
          src={graffiti}
          alt="graffiti"
          loading="lazy"
          className={styles.graffiti}
        />
        <h1 className={styles.title}>
          <span className={styles.beige}>Grow Your</span>
          <span className={styles.blue}>Business</span>
          <span className={styles.blue}>With us</span>
        </h1>
      </div>
      {!user && (
        <div className={styles.buttons}>
          <Link to="/signup" className={styles.teacher}>
            I'm an Instructor
          </Link>
          <Link to="/teacher-signup" className={styles.student}>
            I Need Help
          </Link>
        </div>
      )}
    </div>
  );
};

export default HeroTitle;
