import styles from "./Vision.module.css";
import vision from "../../assets/images/vision.png";

const Vision = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <h2>Our Vision</h2>
        <p>
          To become the trusted partner for Leaders and executives in their
          journey toward excellence and innovation.
        </p>
      </div>

      <div className={styles.imageContainer}>
        <img src={vision} alt="vision" loading="lazy" className={styles.img} />
        <div className={styles.overlay}></div>
      </div>
    </div>
  );
};

export default Vision;
