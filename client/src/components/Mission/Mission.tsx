import { useTranslation } from "react-i18next";
import styles from "./Mission.module.css";
import { useLanguageStore } from "../../langStore";

const Mission = () => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();

  const isArabic = language === "ar";
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <p className={styles.header}>{t("our-mission")}</p>
        <h2 className={`${styles.title} ${isArabic ? styles.arabicTitle : ""}`}>
          {t("our-mission-text-1")}
        </h2>
        <p className={styles.description}>{t("our-mission-text-2")}</p>
      </div>
    </div>
  );
};

export default Mission;
