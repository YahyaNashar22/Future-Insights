import { useTranslation } from "react-i18next";
import styles from "./Loading.module.css"; // Import CSS Module

const Loading = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p className={styles.loadingText}>{t("loading")}</p>
    </div>
  );
};

export default Loading;
