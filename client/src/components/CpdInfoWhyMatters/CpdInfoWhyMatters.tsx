import styles from "./CpdInfoWhyMatters.module.css";

import { useTranslation } from "react-i18next";

import logo from "../../assets/icons/logo_shape.png";

const CpdInfoWhyMatters = () => {
  const { t } = useTranslation();
  return (
    <section className={styles.wrapper}>
      <div className={styles.content}>
        <img src={logo} alt="logo" loading="lazy" className={styles.logo} />
        <div className={styles.textContainer}>
          <p className={styles.text}>{t("cpd-why-matters-1")} </p>
          <p className={styles.text2}>{t("cpd-why-matters-2")} </p>
        </div>
      </div>
    </section>
  );
};

export default CpdInfoWhyMatters;
