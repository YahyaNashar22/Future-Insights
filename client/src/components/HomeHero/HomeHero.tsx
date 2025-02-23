import HeroTitle from "../HeroTitle/HeroTitle";
import styles from "./HomeHero.module.css";

const HomeHero = () => {
  return (
    <section className={styles.wrapper}>
      <HeroTitle />
    </section>
  );
};

export default HomeHero;
