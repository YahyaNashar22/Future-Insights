import About from "../../components/About/About";
import HomeHero from "../../components/HomeHero/HomeHero";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <main className={styles.wrapper}>
      <HomeHero />
      <About />
    </main>
  );
};

export default Home;
