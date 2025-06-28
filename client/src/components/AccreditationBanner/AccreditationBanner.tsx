import { useTranslation } from "react-i18next";
import styles from "./AccreditationBanner.module.css";

const AccreditationBanner = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>{t("accreditation-banner-title")}</h1>
      <p className={styles.slogan}>{t("accreditation-banner-slogan")}</p>
    </div>
  );
};

export default AccreditationBanner;
