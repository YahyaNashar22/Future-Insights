import styles from "./HeroTitle.module.css";

import graffiti from "../../assets/icons/title_graffiti.png";
import { Link } from "react-router-dom";

const HeroTitle = () => {
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
      <div className={styles.buttons}>
        <Link to="/signup-student" className={styles.teacher}>
          I'm a Teacher
        </Link>
        <Link to="/signup-teacher" className={styles.student}>
          I Need Help
        </Link>
      </div>
    </div>
  );
};

export default HeroTitle;
