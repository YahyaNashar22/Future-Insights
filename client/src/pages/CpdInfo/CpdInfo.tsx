import CpdInfoGlobe from "../../components/CpdInfoGlobe/CpdInfoGlobe";
import CpdInfoHero from "../../components/CpdInfoHeader/CpdInfoHero";
import styles from "./CpdInfo.module.css";

const CpdInfo = () => {
  return (
    <main className={styles.wrapper}>
      <CpdInfoHero />
      <CpdInfoGlobe />
    </main>
  );
};

export default CpdInfo;
