import AboutRight from "../AboutRight/AboutRight";
import Mission from "../Mission/Mission";
import styles from "./About.module.css";

const About = () => {
  return (
    <section className={styles.wrapper}>
      <Mission />
      <AboutRight />
    </section>
  );
};

export default About;
