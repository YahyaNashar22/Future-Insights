import About from "../../components/About/About";
import HomeHero from "../../components/HomeHero/HomeHero";
import Partner from "../../components/Partner/Partner";
import Team from "../../components/Team/Team";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <main className={styles.wrapper}>
      <HomeHero />
      <About />
      <Partner />
      <Team />
    </main>
  );
};

export default Home;
