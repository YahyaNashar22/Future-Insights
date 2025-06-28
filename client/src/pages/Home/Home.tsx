import About from "../../components/About/About";
import Gallery from "../../components/Gallery/Gallery";
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
      <Gallery />
      <Team />
    </main>
  );
};

export default Home;
