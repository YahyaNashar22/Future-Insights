import { useTranslation } from "react-i18next";
import IClass from "../../interfaces/IClass";
import { useLanguageStore } from "../../langStore";
import { parseBullets } from "../../utils/ParseList";
import styles from "./DefaultClassView.module.css";

const DefaultClassView = ({ cls }: { cls: IClass | null }) => {
  const backend = import.meta.env.VITE_BACKEND;
  const { language } = useLanguageStore();
  const { t } = useTranslation();
  const isArabic = language === "ar";

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.classTitle}>
        {isArabic ? cls?.arabicTitle : cls?.title}
      </h1>
      {cls?.description && (
        <div className={styles.description}>
          {parseBullets(isArabic ? cls.arabicDescription : cls.description, isArabic)}
        </div>
      )}

      <img
        src={`${backend}/${cls?.thumbnail}`}
        alt={cls?.title}
        className={styles.thumbnail}
      />
      <p className={styles.duration}>
        {t(["duration"])}: {cls?.duration}
      </p>
    </div>
  );
};

export default DefaultClassView;
