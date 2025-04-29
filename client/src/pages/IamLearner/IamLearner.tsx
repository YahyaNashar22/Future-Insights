import { useNavigate } from "react-router-dom";
import styles from "./IamLearner.module.css";
import { useTranslation } from "react-i18next";

const IamLearner = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <main className={styles.wrapper}>
      <h1 className={styles.title}>{t("Iam-learner-title")}</h1>
      <div className={styles.cardsContainer}>
        <div className={styles.singinCard} onClick={() => navigate("/signin")}>
          <h2 className={styles.cardTitle}>{t("Iam-learner-opt-1")}</h2>
        </div>
        <div
          className={styles.discoverCoursesCard}
          onClick={() => navigate("/course-catalogue")}
        >
          <h2 className={styles.cardTitle}>{t("Iam-learner-opt-2")}</h2>
        </div>
      </div>
    </main>
  );
};

export default IamLearner;
