import CpdInfoAccreditation from "../../components/CpdInfoAccreditation/CpdInfoAccreditation";
import CpdInfoGlobe from "../../components/CpdInfoGlobe/CpdInfoGlobe";
import CpdInfoHero from "../../components/CpdInfoHeader/CpdInfoHero";
import CpdInfoReferenceNumber from "../../components/CpdInfoReferenceNumber/CpdInfoReferenceNumber";
import styles from "./CpdInfo.module.css";

const CpdInfo = () => {
  return (
    <main className={styles.wrapper}>
      <CpdInfoHero />
      <CpdInfoGlobe />
      <CpdInfoReferenceNumber />
      <CpdInfoAccreditation />
    </main>
  );
};

export default CpdInfo;
