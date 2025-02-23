import styles from "./Team.module.css";

import financial from "../../assets/icons/financial.png";
import professional from "../../assets/icons/professional.png";
import business from "../../assets/icons/business.png";
import intelligence from "../../assets/icons/intelligence.png";

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
  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>
        We bring together a team of seasoned experts, including{" "}
        <span className={styles.beige}> Certified Master Trainers (CMTs)</span>,
        executive coaches, and industry leaders, specializing in
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
