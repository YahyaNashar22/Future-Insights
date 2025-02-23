import styles from "./CourseCatalogue.module.css";

import CourseCatalogueHero from "../../components/CourseCatalogueHero/CourseCatalogueHero";

const CourseCatalogue = () => {
  return (
    <main className={styles.wrapper}>
      <CourseCatalogueHero />
    </main>
  );
};

export default CourseCatalogue;
