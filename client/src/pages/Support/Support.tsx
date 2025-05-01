import { useTranslation } from "react-i18next";
import styles from "./Support.module.css";

const Support = () => {
  const { t } = useTranslation();
  return (
    <main className={styles.wrapper}>
      <section className={styles.supportSection}>
        <h1 className={styles.title}>{t("support-title")}</h1>

        <div className={styles.section}>
          <h2 className={styles.subtitle}>{t("support-1-title")}</h2>
          <p className={styles.text}>
            {t("support-1-desc-1")}
            <a href="mailto:info@futureinsights.ae" className={styles.link}>
              {" "}
              {t("support-1-desc-2")}
            </a>
            .
          </p>
          <p className={styles.text}>
            {t("support-1-desc-3")}{" "}
            <strong className={styles.strong}>{t("support-1-desc-4")}</strong>.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.subtitle}>{t("support-2-title")}</h2>
          <p className={styles.text}>
            {t("support-2-desc-1")}
            <span className={styles.link}> {t("support-2-desc-2")}</span>.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.subtitle}>{t("support-3-title")}</h2>
          <p className={styles.text}>
            {t("support-3-desc-1")}{" "}
            <strong className={styles.strong}>{t("support-3-desc-2")}</strong>{" "}
            {t("support-3-desc-3")}
          </p>
        </div>
      </section>
    </main>
  );
};

export default Support;
