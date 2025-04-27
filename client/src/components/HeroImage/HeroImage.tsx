import styles from "./HeroImage.module.css";

import graffiti from "../../assets/icons/man_graffiti.png";
import man from "../../assets/images/laptop_tablet1.png";

const HeroImage = () => {
  return (
    <div className={styles.wrapper}>
      <img src={man} alt="man" className={styles.man} />
      <img
        src={graffiti}
        alt="graffiti"
        className={styles.graffiti}
      />
      <p className={styles.bubbleText}>
        Accelerate <br /> Your Success
      </p>
    </div>
  );
};

export default HeroImage;
