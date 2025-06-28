import { useTranslation } from "react-i18next";
import styles from "./CpdGains.module.css";

const GainCard = ({ gain }: { gain: { [key: string]: string | number } }) => {
  return (
    <div className={styles.cardWrapper}>
      <div className={styles.number}>{gain.id}</div>
      <h4 className={styles.title}>{gain.title}</h4>
      <p className={styles.text}>{gain.text}</p>
    </div>
  );
};

const CpdGains = () => {
  const { t } = useTranslation();
  const gains = [
    {
      id: 1,
      title: t("gains-1-title"),
      text: t("gains-1-text"),
    },
    {
      id: 2,
      title: t("gains-2-title"),
      text: t("gains-2-text"),
    },
    {
      id: 3,
      title: t("gains-3-title"),
      text: t("gains-3-text"),
    },
  ];
  return (
    <section className={styles.wrapper}>
      {gains.map((gain) => {
        return <GainCard key={gain.id} gain={gain} />;
      })}
    </section>
  );
};

export default CpdGains;
