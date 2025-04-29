import styles from "./Partner.module.css";

import logo from "../../assets/icons/logo_shape.png";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../langStore";

const Partner = () => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();

  const isArabic = language === "ar";

  return (
    <section className={styles.wrapper}>
      <div className={styles.content}>
        <img src={logo} alt="logo" loading="lazy" className={styles.logo} />
        <p className={`${styles.text} ${isArabic ? styles.arabicText : ""}`}>
          {t("partner-text-1")}{" "}
          <span className={styles.beige}> {t("partner-text-2")}</span>
          {t("partner-text-3")}
        </p>
      </div>
    </section>
  );
};

export default Partner;
