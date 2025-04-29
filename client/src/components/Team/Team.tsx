import styles from "./Team.module.css";

import financial from "../../assets/icons/financial.png";
import professional from "../../assets/icons/professional.png";
import business from "../../assets/icons/business.png";
import intelligence from "../../assets/icons/intelligence.png";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../langStore";

const data = [
  {
    icon: financial,
    title: "Financial Management & Strategic Leadership",
    description:
      "Helping businesses navigate complex financial landscapes and drive long-term success.",
  },
  {
    icon: professional,
    title: "Professional & Executive Development",
    description:
      "Equipping professionals with leadership, decision-making, and growth-oriented skills.",
  },
  {
    icon: business,
    title: "Business Development & Innovation",
    description:
      "Crafting strategies that foster growth, sustainability, and market expansion.",
  },
  {
    icon: intelligence,
    title: "Solid Emotional Intelligence & Executive Coaching Foundation",
    description:
      "Enhancing leadership effectiveness, resilience, and team dynamics.",
  },
];

const Card = ({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) => {
  return (
    <div className={styles.card}>
      <img src={icon} alt={title} loading="lazy" className={styles.cardIcon} />
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDescription}>{description}</p>
    </div>
  );
};

const Team = () => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();

  const isArabic = language === "ar";
  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>
        {t('team-title-1')}{" "}
        <span className={styles.beige}> {t('team-title-beige')}</span>
        {t('team-title-2')}
      </h2>
      <ul className={styles.container}>
        {data.map((card, index) => {
          return (
            <Card
              key={index}
              icon={card.icon}
              title={card.title}
              description={card.description}
            />
          );
        })}
      </ul>
    </section>
  );
};

export default Team;
