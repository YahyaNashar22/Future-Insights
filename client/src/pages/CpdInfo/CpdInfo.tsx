import styles from "./CpdInfo.module.css";

import CpdGains from "../../components/CpdGains/CpdGains";
import CpdInfoAccreditation from "../../components/CpdInfoAccreditation/CpdInfoAccreditation";
import CpdInfoExclusive from "../../components/CpdInfoExclusive/CpdInfoExclusive";
import CpdInfoGlobe from "../../components/CpdInfoGlobe/CpdInfoGlobe";
import CpdInfoHero from "../../components/CpdInfoHeader/CpdInfoHero";
import CpdInfoReferenceNumber from "../../components/CpdInfoReferenceNumber/CpdInfoReferenceNumber";
import CpdInfoWhyMatters from "../../components/CpdInfoWhyMatters/CpdInfoWhyMatters";

const CpdInfo = () => {
  return (
    <main className={styles.wrapper}>
      <CpdInfoHero />
      <CpdInfoGlobe />
      <CpdInfoReferenceNumber />
      <CpdInfoAccreditation />
      <CpdInfoWhyMatters />
      <CpdGains />
      <CpdInfoExclusive />
    </main>
  );
};

export default CpdInfo;
