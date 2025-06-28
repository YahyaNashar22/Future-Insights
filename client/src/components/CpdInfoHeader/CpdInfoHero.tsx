import { useTranslation } from "react-i18next";
import styles from "./CpdInfoHero.module.css";

const CpdInfoHero = () => {
  const { t } = useTranslation();
  return (
    <section className={styles.wrapper}>
      <h1 className={styles.title}>{t("accreditation-banner-title")}</h1>
    </section>
  );
};

export default CpdInfoHero;
