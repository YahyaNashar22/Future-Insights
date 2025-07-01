import styles from "./ProviderReference.module.css";

import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import rami from "../../assets/images/rami6.jpg";
import cpd from "../../assets/icons/cpd_logo.webp";

const ProviderReference = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <img src={rami} alt="rami" />
      </div>
      <div className={styles.middle}>
        <h1>{t("provider-reference-title")}</h1>
        <p>{t("provider-reference-p1")}</p>
        <p>{t("provider-reference-p2")}</p>
        <strong>{t("provider-reference-s1")}</strong>
        <strong>{t("provider-reference-s2")}</strong>
        <strong>{t("provider-reference-s3")}</strong>
      </div>
      <div className={styles.right}>
        <img src={cpd} alt="cpd logo" />
        <Link to="/cpd">{t("learn-more")}</Link>
      </div>
    </div>
  );
};

export default ProviderReference;
