import About from "../../components/About/About";
import HomeHero from "../../components/HomeHero/HomeHero";
import Partner from "../../components/Partner/Partner";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <main className={styles.wrapper}>
      <HomeHero />
      <About />
      <Partner />
    </main>
  );
};

export default Home;
