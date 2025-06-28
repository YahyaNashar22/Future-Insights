import { useTranslation } from "react-i18next";
import styles from "./CpdInfoGlobe.module.css";

const CpdInfoGlobe = () => {
  const { t } = useTranslation();
  return (
    <section className={styles.wrapper}>
      <p className={styles.slogan}>{t("accreditation-banner-slogan")}</p>
    </section>
  );
};

export default CpdInfoGlobe;
