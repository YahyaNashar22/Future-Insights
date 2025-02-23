import HomeHero from "../../components/HomeHero/HomeHero";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <main className={styles.wrapper}>
      <HomeHero />
    </main>
  );
};

export default Home;
