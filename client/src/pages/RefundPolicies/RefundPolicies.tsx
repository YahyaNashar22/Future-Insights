import { useTranslation } from "react-i18next";
import styles from "./RefundPolicies.module.css";

const RefundPolicies = () => {
  const { t } = useTranslation();
  return (
    <main className={styles.wrapper}>
      <section className={styles.policyContainer}>
        <h1 className={styles.policyTitle}>{t("refund-policy-title")}</h1>
        <p className={styles.effectiveDate}>
          <strong className={styles.strong}>
            {t("refund-policy-effective-1")}
          </strong>{" "}
          {t("refund-policy-effective-2")}
        </p>
        <p className={styles.policyDescription}>
          {t("refund-policy-description")}
        </p>

        <div className={styles.policySection}>
          <h2 className={styles.policySubtitle}>
            {t("refund-policy-1-title")}
          </h2>
          <p className={styles.policyText}>
            {t("refund-policy-1-description")}
          </p>

          <h3 className={styles.policySubSubtitle}>
            {t("refund-policy-1.1-title")}
          </h3>
          <ul className={styles.policyList}>
            <li className={styles.policyItem}>
              <strong className={styles.strong}>
                {t("refund-policy-1.1-strong-1")}
              </strong>{" "}
              {t("refund-policy-1.1-desc-1")}
            </li>
            <li className={styles.policyItem}>
              <strong className={styles.strong}>
                {t("refund-policy-1.1-strong-2")}
              </strong>{" "}
              {t("refund-policy-1.1-desc-2")}
            </li>
            <li className={styles.policyItem}>
              <strong className={styles.strong}>
                {t("refund-policy-1.1-strong-3")}
              </strong>{" "}
              {t("refund-policy-1.1-desc-3")}
            </li>
          </ul>

          <h3 className={styles.policySubSubtitle}>
            {t("refund-policy-1.2-title")}
          </h3>
          <ul className={styles.policyList}>
            <li className={styles.policyItem}>
              <strong className={styles.strong}>
                {t("refund-policy-1.2-strong-1")}
              </strong>{" "}
              {t("refund-policy-1.2-desc-1")}
            </li>
            <li className={styles.policyItem}>
              <strong className={styles.strong}>
                {t("refund-policy-1.2-strong-2")}
              </strong>{" "}
              {t("refund-policy-1.2-desc-2")}
            </li>
            <li className={styles.policyItem}>
              <strong className={styles.strong}>
                {t("refund-policy-1.2-strong-3")}
              </strong>{" "}
              {t("refund-policy-1.2-desc-3")}
            </li>
          </ul>
        </div>

        <div className={styles.policySection}>
          <h2 className={styles.policySubtitle}>
            {t("refund-policy-2-title")}
          </h2>
          <ul className={styles.policyList}>
            <li className={styles.policyItem}>
              {t("refund-policy-2-description-1")}
            </li>
            <li className={styles.policyItem}>
              {t("refund-policy-2-description-2")}
            </li>
          </ul>
        </div>

        <div className={styles.policySection}>
          <h2 className={styles.policySubtitle}>
            {t("refund-policy-3-title")}
          </h2>
          <ul className={styles.policyList}>
            <li className={styles.policyItem}>
              {t("refund-policy-3-description-1-1")}{" "}
              <strong className={styles.strong}>
                {t("refund-policy-3-description-1-2")}
              </strong>
              .
            </li>
            <li className={styles.policyItem}>
              {t("refund-policy-3-description-2")}
            </li>
          </ul>
        </div>

        <div className={styles.policySection}>
          <h2 className={styles.policySubtitle}>
            {t("refund-policy-4-title")}
          </h2>
          <ul className={styles.policyList}>
            <li className={styles.policyItem}>
              {t("refund-policy-4-description-1")}
            </li>
            <li className={styles.policyItem}>
              {t("refund-policy-4-description-2")}
            </li>
          </ul>
        </div>

        <div className={styles.policySection}>
          <h2 className={styles.policySubtitle}>
            {t("refund-policy-5-title")}
          </h2>
          <p className={styles.policyText}>
            {t("refund-policy-5-description")}
          </p>
          <ul className={styles.policyList}>
            <li className={styles.policyItem}>
              <strong className={styles.strong}>
                {t("refund-policy-5-strong-1")}
              </strong>{" "}
              {t("refund-policy-5-desc-1")}
            </li>
            <li className={styles.policyItem}>
              <strong className={styles.strong}>
                {t("refund-policy-5-strong-2")}
              </strong>{" "}
              {t("refund-policy-5-desc-2")}
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
};

export default RefundPolicies;
