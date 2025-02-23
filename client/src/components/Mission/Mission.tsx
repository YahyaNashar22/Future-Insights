import styles from "./Mission.module.css";

const Mission = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <p className={styles.header}>Our Mission</p>
        <h2 className={styles.title}>
          Empowering leaders to make a sustainable and positive impact
        </h2>
        <p className={styles.description}>
          within their organizations through high-quality Training &
          Consultation.
        </p>
      </div>
    </div>
  );
};

export default Mission;
