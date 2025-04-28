import styles from "./HeroTitle.module.css";

import graffiti from "../../assets/icons/title_graffiti.png";
import { Link } from "react-router-dom";
import { useUserStore } from "../../store";
import { useTranslation } from "react-i18next";

const HeroTitle = () => {
  const { user } = useUserStore();
  const { t } = useTranslation();

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <img
          src={graffiti}
          alt="graffiti"
          loading="lazy"
          className={styles.graffiti}
        />
        <h1 className={styles.title}>
          <span className={styles.beige}>{t("home-hero-1")}</span>
          <span className={styles.blue}>{t("home-hero-2")}</span>
          <span className={styles.blue}>{t("home-hero-3")}</span>
        </h1>
      </div>
      {!user && (
        <div className={styles.buttons}>
          <Link to="/instructor-request" className={styles.teacher}>
          {t("instructor")}
          </Link>
          <Link to="/iam-learner" className={styles.student}>
          {t("learner")}
          </Link>
        </div>
      )}
    </div>
  );
};

export default HeroTitle;
