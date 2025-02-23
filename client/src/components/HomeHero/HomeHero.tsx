import HeroImage from "../HeroImage/HeroImage";
import HeroTitle from "../HeroTitle/HeroTitle";
import styles from "./HomeHero.module.css";

const HomeHero = () => {
  return (
    <section className={styles.wrapper}>
      <HeroTitle />
      <HeroImage />
    </section>
  );
};

export default HomeHero;
