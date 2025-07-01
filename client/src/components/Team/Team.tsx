import styles from "./Team.module.css";

import financial from "../../assets/icons/financial.png";
import professional from "../../assets/icons/professional.png";
import business from "../../assets/icons/business.png";
import intelligence from "../../assets/icons/intelligence.png";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../langStore";
import AccreditationBanner from "../AccreditationBanner/AccreditationBanner";
import ProviderReference from "../ProviderReference/ProviderReference";

const data = [
  {
    icon: financial,
    title: "Financial Management & Strategic Leadership",
    description:
      "Helping businesses navigate complex financial landscapes and drive long-term success.",
    arabicTitle: "الإدارة المالية والقيادة الإستراتيجية",
    arabicDescription:
      "لمساعدة الشركات على التنقّل في البيئات الماليّة المعقّدة ودفعها نحو النجاح على المدى الطويل.",
  },
  {
    icon: professional,
    title: "Professional & Executive Development",
    description:
      "Equipping professionals with leadership, decision-making, and growth-oriented skills.",
    arabicTitle: "التطوير المهني والتنفيذي",
    arabicDescription:
      "تزويد المهنيين بالمهارات القيادية ومهارات اتخاذ القرار والنمو المستدام.",
  },
  {
    icon: business,
    title: "Business Development & Innovation",
    description:
      "Crafting strategies that foster growth, sustainability, and market expansion.",
    arabicTitle: "تطوير الأعمال والابتكار",
    arabicDescription:
      "وضع استراتيجيات تعزز النمو، والاستدامة، والتوسّع في الأسواق",
  },
  {
    icon: intelligence,
    title: "Solid Emotional Intelligence & Executive Coaching Foundation",
    description:
      "Enhancing leadership effectiveness, resilience, and team dynamics.",
    arabicTitle: "الذكاء العاطفي الراسخ وأساسيات التدريب التنفيذي",
    arabicDescription: "تعزيز فعالية القيادة، والمرونة، وديناميكيات الفريق.",
  },
];

const Card = ({
  icon,
  title,
  description,
  arabicTitle,
  arabicDescription,
  isArabic,
}: {
  icon: string;
  title: string;
  description: string;
  arabicTitle: string;
  arabicDescription: string;
  isArabic: boolean;
}) => {
  return (
    <div className={styles.card}>
      <img src={icon} alt={title} loading="lazy" className={styles.cardIcon} />
      <h3 className={styles.cardTitle}>{isArabic ? arabicTitle : title}</h3>
      <p className={styles.cardDescription}>
        {isArabic ? arabicDescription : description}
      </p>
    </div>
  );
};

const Team = () => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();

  const isArabic = language === "ar";
  return (
    <section className={styles.wrapper}>
      <AccreditationBanner />
      <ProviderReference />

      <h2 className={styles.title}>
        {t("team-title-1")}{" "}
        <span className={styles.beige}> {t("team-title-beige")}</span>
        {t("team-title-2")}
      </h2>

      <ul className={styles.container}>
        {data.map((card, index) => {
          return (
            <Card
              key={index}
              icon={card.icon}
              title={card.title}
              description={card.description}
              arabicTitle={card.arabicTitle}
              arabicDescription={card.arabicDescription}
              isArabic={isArabic}
            />
          );
        })}
      </ul>
    </section>
  );
};

export default Team;
