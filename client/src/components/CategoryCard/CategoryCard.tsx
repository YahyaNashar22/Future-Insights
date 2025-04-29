import { FC } from "react";
import styles from "./CategoryCard.module.css";

import bottomLeft from "../../assets/icons/category_design.png";
import categoryTitleLeading from "../../assets/icons/category_title_leading.png";
import { Link } from "react-router-dom";
import ICategoryCard from "../../interfaces/ICategoryCard";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../langStore";

const CategoryCard: FC<ICategoryCard> = ({ selectedCategory, showButton }) => {
  const backend = import.meta.env.VITE_BACKEND;

  const { t } = useTranslation();
  const { language } = useLanguageStore();

  const isArabic = language === "ar";
  return (
    <div
      id="cat-card"
      className={styles.wrapper}
      style={{
        backgroundImage: selectedCategory?.image
          ? `url(${backend}/${selectedCategory.image})`
          : "none",
        backgroundColor: selectedCategory?.image ? "" : "var(--primary-blue)",
      }}
    >
      <h2 className={styles.cardTitle}>
        <span className={styles.leading}>
          <img src={categoryTitleLeading} alt="leading" loading="lazy" />
        </span>
        {selectedCategory
          ? isArabic
            ? selectedCategory.arabicTitle
            : selectedCategory.title
          : t("select-category")}
      </h2>
      <p
        className={`${styles.description} ${
          isArabic ? styles.arabicDescription : ""
        }`}
      >
        {selectedCategory
          ? isArabic
            ? selectedCategory?.arabicDescription
            : selectedCategory?.description
          : t("select-category-desc")}
      </p>
      {selectedCategory && showButton && (
        <Link
          to={`/course-catalogue/category/${selectedCategory.slug}`}
          className={styles.readMore}
        >
          {t("select-category-discover")}
        </Link>
      )}
      <img
        src={bottomLeft}
        alt="category design"
        loading="lazy"
        className={styles.bottomLeft}
      />
    </div>
  );
};

export default CategoryCard;
