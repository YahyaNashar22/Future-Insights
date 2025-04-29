import { useTranslation } from "react-i18next";
import Vision from "../Vision/Vision";
import styles from "./AboutRight.module.css";
import { useLanguageStore } from "../../langStore";

const AboutRight = () => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();

  const isArabic = language === "ar";
  return (
    <div className={styles.wrapper}>
      <div className={styles.upper}>
        <h2 className={`${styles.title} ${isArabic ? styles.arabicTitle : ""}`}>
          {t("we-are")}
        </h2>
        <p className={styles.content}>{t("we-are-text")}</p>
      </div>
      <Vision />
    </div>
  );
};

export default AboutRight;
