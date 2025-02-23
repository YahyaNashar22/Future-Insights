import BlueBeige from "../BlueBeige/BlueBeige";
import HeroImage from "../HeroImage/HeroImage";
import HeroTitle from "../HeroTitle/HeroTitle";
import styles from "./HomeHero.module.css";

const HomeHero = () => {
  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        <HeroTitle />
        <HeroImage />
      </div>
      <BlueBeige />
    </section>
  );
};

export default HomeHero;
