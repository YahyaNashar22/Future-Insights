import styles from "./Vision.module.css";
import rami from "../../assets/images/rami.jpg";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../langStore";

const Vision = () => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();

  const isArabic = language === "ar";
  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.content} ${isArabic ? styles.arabicContent : ""}`}
      >
        <h2> {t("our-vision")}</h2>
        <p>{t("our-vision-text")}</p>
      </div>

      <div className={styles.imageContainer}>
        <img src={rami} alt="vision" loading="lazy" className={styles.img} />
        {/* <div className={styles.overlay}></div> */}
      </div>
    </div>
  );
};

export default Vision;
