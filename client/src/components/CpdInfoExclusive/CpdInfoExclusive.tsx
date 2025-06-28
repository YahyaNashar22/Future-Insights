import styles from "./CpdInfoExclusive.module.css";

import { useTranslation } from "react-i18next";

import rami from "../../assets/images/rami.jpg";

const CpdInfoExclusive = () => {
  const { t } = useTranslation();
  return (
    <section className={styles.wrapper}>
      <div className={styles.middle}>
        <h1>{t("cpd-exclusive-title")}</h1>
        <p>{t("cpd-exclusive-text")}</p>
        <strong>{t("cpd-exclusive-s1")}</strong>
        <strong>{t("cpd-exclusive-s2")}</strong>
        <strong>{t("cpd-exclusive-s3")}</strong>
      </div>
      <div className={styles.left}>
        <img src={rami} alt="rami" />
      </div>
    </section>
  );
};

export default CpdInfoExclusive;
