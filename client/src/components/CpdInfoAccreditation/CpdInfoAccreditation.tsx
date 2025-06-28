import styles from "./CpdInfoAccreditation.module.css";

import cpd from "../../assets/icons/cpd_logo_no_bg.png";
import { useTranslation } from "react-i18next";

const CpdInfoAccreditation = () => {
  const { t } = useTranslation();
  return (
    <section className={styles.wrapper}>
      <div className={styles.middle}>
        <h1>{t("cpd-accreditation-title")}</h1>
        <p>{t("cpd-accreditation-p1")}</p>
        <p>{t("cpd-accreditation-p2")}</p>
      </div>
      <div className={styles.left}>
        <img src={cpd} alt="cpd logo" />
        <a
          href="https://www.cpdinstitute.org/"
          target="_blank"
          rel="noreferrer"
        >
          {t("visit")}
        </a>
      </div>
    </section>
  );
};

export default CpdInfoAccreditation;
