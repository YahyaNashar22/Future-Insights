import { useTranslation } from "react-i18next";
import styles from "./PrivacyPolicy.module.css";

const PrivacyPolicy = () => {
  const { t } = useTranslation();
  return (
    <main className={styles.wrapper}>
      <section className={styles.policyContainer}>
        <h1 className={styles.policyTitle}>{t("privacy-policy-title")}</h1>

        <div className={styles.policySection}>
          <h2 className={styles.policySubtitle}>
            {t("privacy-policy-1-title")}
          </h2>
          <ul className={styles.policyList}>
            <li className={styles.policyItem}>
              <strong className={styles.strong}>
                {t("privacy-policy-1-desc-1-1")}
              </strong>{" "}
              {t("privacy-policy-1-desc-1-2")}
            </li>
            <li className={styles.policyItem}>
              <strong>{t("privacy-policy-1-desc-2-1")}</strong>{" "}
              {t("privacy-policy-1-desc-2-2")}
            </li>
            <li className={styles.policyItem}>
              <strong className={styles.strong}>
                {t("privacy-policy-1-desc-3-1")}
              </strong>{" "}
              {t("privacy-policy-1-desc-3-2")}
            </li>
          </ul>
        </div>

        <div className={styles.policySection}>
          <h2 className={styles.policySubtitle}>
            {t("privacy-policy-2-title")}
          </h2>
          <ul className={styles.policyList}>
            <li className={styles.policyItem}>
              {t("privacy-policy-2-desc-1")}
            </li>
            <li className={styles.policyItem}>
              {t("privacy-policy-2-desc-2")}
            </li>
            <li className={styles.policyItem}>
              {t("privacy-policy-2-desc-3")}
            </li>
          </ul>
        </div>

        <div className={styles.policySection}>
          <h2 className={styles.policySubtitle}>
            {t("privacy-policy-3-title")}
          </h2>
          <ul className={styles.policyList}>
            <li className={styles.policyItem}>
              {t("privacy-policy-3-desc-1")}
            </li>
            <li className={styles.policyItem}>
              {t("privacy-policy-3-desc-2")}
            </li>
          </ul>
        </div>

        <div className={styles.policySection}>
          <h2 className={styles.policySubtitle}>
            {t("privacy-policy-4-title")}
          </h2>
          <ul className={styles.policyList}>
            <li className={styles.policyItem}>
              {t("privacy-policy-4-desc-1")}
            </li>
            <li className={styles.policyItem}>
              {t("privacy-policy-4-desc-2")}
            </li>
          </ul>
        </div>

        <div className={styles.policySection}>
          <h2 className={styles.policySubtitle}>
            {t("privacy-policy-5-title")}
          </h2>
          <ul className={styles.policyList}>
            <li className={styles.policyItem}>
              {t("privacy-policy-5-desc-1")}
            </li>
            <li className={styles.policyItem}>
              {t("privacy-policy-5-desc-2")}
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
};

export default PrivacyPolicy;
