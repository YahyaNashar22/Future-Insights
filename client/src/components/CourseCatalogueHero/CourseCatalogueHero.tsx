import styles from "./CourseCatalogueHero.module.css";

import BlueBeige from "../BlueBeige/BlueBeige";
import CourseCatalogueHeroImage from "../CourseCatalogueHeroImage/CourseCatalogueHeroImage";

import bubble from "../../assets/icons/bubble.png";
import { useTranslation } from "react-i18next";

const CourseCatalogueHero = () => {
  const { t } = useTranslation();
  return (
    <section className={styles.wrapper}>
      <img src={bubble} alt="bubble" className={styles.bubble} loading="lazy" />
      <h1 className={styles.title}>
        {t('course-catalogue-hero-1')} <br /> {t('course-catalogue-hero-2')}
      </h1>
      <div className={styles.container}>
        <CourseCatalogueHeroImage />
      </div>
      <BlueBeige />
    </section>
  );
};

export default CourseCatalogueHero;
