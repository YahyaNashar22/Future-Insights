import styles from "./CourseCatalogueHero.module.css";

import BlueBeige from "../BlueBeige/BlueBeige";
import CourseCatalogueHeroImage from "../CourseCatalogueHeroImage/CourseCatalogueHeroImage";

import bubble from "../../assets/icons/bubble.png";

const CourseCatalogueHero = () => {
  return (
    <section className={styles.wrapper}>
      <img src={bubble} alt="bubble" className={styles.bubble} loading="lazy" />
      <h1 className={styles.title}>
        Course <br /> Catalogue
      </h1>
      <div className={styles.container}>
        <CourseCatalogueHeroImage />
      </div>
      <BlueBeige />
    </section>
  );
};

export default CourseCatalogueHero;
