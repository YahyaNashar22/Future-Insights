import { useParams } from "react-router-dom";
import styles from "./CertificationPage.module.css";

const CertificationPage = () => {
  const { slug } = useParams();
  return <main className={styles.wrapper}>{slug}</main>;
};

export default CertificationPage;
