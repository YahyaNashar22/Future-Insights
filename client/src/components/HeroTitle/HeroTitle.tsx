import styles from "./HeroTitle.module.css";

import graffiti from "../../assets/icons/title_graffiti.png";

const HeroTitle = () => {
  return (
    <div className={styles.wrapper}>
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
  );
};

export default HeroTitle;
