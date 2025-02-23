import Vision from "../Vision/Vision";
import styles from "./AboutRight.module.css";

const AboutRight = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.upper}>
        <h2 className={styles.title}>We are Future Insights</h2>
        <p className={styles.content}>
          In a world full of challenges and rapid changes, Future Insights
          Academy stands as the premier destination for executives and aspiring
          leaders. We are a comprehensive platform dedicated to providing a
          holistic learning experience and Management consultation that combines
          theoretical knowledge with practical applications to develop strategic
          leadership and management skills.
        </p>
      </div>
      <Vision />
    </div>
  );
};

export default AboutRight;
