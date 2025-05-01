import { useNavigate } from "react-router-dom";
import styles from "./TermsOfUse.module.css";
import { useTranslation } from "react-i18next";

const TermsOfUse = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <main className={styles.wrapper}>
      <section className={styles.termsContainer}>
        <h1 className={styles.termsTitle}>{t("terms-title")}</h1>

        <div className={styles.termsSection}>
          <h2 className={styles.termsSubtitle}>{t("terms-1-title")}</h2>
          <p>{t("terms-1-desc")}</p>
        </div>

        <div className={styles.termsSection}>
          <h2 className={styles.termsSubtitle}>{t("terms-2-title")}</h2>
          <ul className={styles.termsList}>
            <li className={styles.termsItem}>{t("terms-2-dec-1")}</li>
            <li className={styles.termsItem}>{t("terms-2-desc-2")}</li>
            <li className={styles.termsItem}>{t("terms-2-desc-3")}</li>
          </ul>
        </div>

        <div className={styles.termsSection}>
          <h2 className={styles.termsSubtitle}>{t("terms-3-title")}</h2>
          <ul className={styles.termsList}>
            <li className={styles.termsItem}>{t("terms-3-desc-1")}</li>
            <li className={styles.termsItem}>{t("terms-3-desc-2")}</li>
          </ul>
        </div>

        <div className={styles.termsSection}>
          <h2 className={styles.termsSubtitle}>{t("terms-4-title")}</h2>
          <ul className={styles.termsList}>
            <li className={styles.termsItem}>{t("terms-4-desc-1")}</li>
            <li className={styles.termsItem}>
              {t("terms-4-desc-2-1")}{" "}
              <span
                className={styles.refundPolicyLink}
                onClick={() => navigate("/refund-policies")}
              >
                {t("terms-4-desc-2-link")}
              </span>{" "}
              {t("terms-4-desc-2-2")}
            </li>
          </ul>
        </div>

        <div className={styles.termsSection}>
          <h2 className={styles.termsSubtitle}>{t("terms-5-title")}</h2>
          <ul className={styles.termsList}>
            <li className={styles.termsItem}>{t("terms-5-desc-1")}</li>
            <li className={styles.termsItem}>{t("terms-5-desc-2")}</li>
          </ul>
        </div>
      </section>
    </main>
  );
};

export default TermsOfUse;
