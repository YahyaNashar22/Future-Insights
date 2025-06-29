import styles from "./CpdInfoReferenceNumber.module.css";

import { useTranslation } from "react-i18next";

import rami from "../../assets/images/rami6.jpg";

const CpdInfoReferenceNumber = () => {
  const { t } = useTranslation();
  return (
    <section className={styles.wrapper}>
      <div className={styles.left}>
        <img src={rami} alt="rami" />
      </div>
      <div className={styles.middle}>
        <h1>{t("provider-reference-title")}</h1>
        <p>{t("provider-reference-p1")}</p>
        <p>{t("provider-reference-p2")}</p>
        <strong>{t("provider-reference-s1")}</strong>
        <strong>{t("provider-reference-s2")}</strong>
        <strong className={styles.last}>{t("provider-reference-s3")}</strong>
        <a
          href="https://directory.cpdstandards.com/providers/future-insights-for-management-consultancies-co-l-l-c/"
          target="_blank"
          rel="noreferrer"
        >
          {t('visit')}
        </a>
      </div>
    </section>
  );
};

export default CpdInfoReferenceNumber;
