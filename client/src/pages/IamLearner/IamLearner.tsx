import { useNavigate } from "react-router-dom";
import styles from "./IamLearner.module.css";

const IamLearner = () => {
  const navigate = useNavigate();
  return (
    <main className={styles.wrapper}>
      <h1 className={styles.title}>What Would You Like To Do ?</h1>
      <div className={styles.cardsContainer}>
        <div className={styles.singinCard} onClick={() => navigate("/signin")}>
          <h2 className={styles.cardTitle}>Sign in and start learning!</h2>
        </div>
        <div
          className={styles.discoverCoursesCard}
          onClick={() => navigate("/course-catalogue")}
        >
          <h2 className={styles.cardTitle}>
            Have a look around and check our course catalogue
          </h2>
        </div>
      </div>
    </main>
  );
};

export default IamLearner;
