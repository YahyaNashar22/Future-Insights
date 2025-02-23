import styles from "./CourseCatalogueHeroImage.module.css";

import graffiti from "../../assets/icons/man_graffiti.png";
import woman from "../../assets/images/woman.png";

const CourseCatalogueHeroImage = () => {
  return (
    <div className={styles.wrapper}>
      <img src={woman} alt="woman" loading="lazy" className={styles.woman} />
      <img
        src={graffiti}
        alt="graffiti"
        loading="lazy"
        className={styles.graffiti}
      />
    </div>
  );
};

export default CourseCatalogueHeroImage;
