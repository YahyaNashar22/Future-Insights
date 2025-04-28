import styles from "./HeroImage.module.css";

import graffiti from "../../assets/icons/man_graffiti.png";
import man from "../../assets/images/laptop_tablet1.png";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../langStore";

const HeroImage = () => {
  const { t } = useTranslation();
  const language = useLanguageStore((state) => state.language);

  const isArabic = language === "ar";
  return (
    <div className={styles.wrapper}>
      <img src={man} alt="man" className={styles.man} />
      <img src={graffiti} alt="graffiti" className={styles.graffiti} />
      <p
        className={`${styles.bubbleText} ${
          isArabic ? styles.bubbleTextArabic : ""
        }`}
      >
        {t("home-image-1")} <br /> {t("home-image-2")}
      </p>
    </div>
  );
};

export default HeroImage;
