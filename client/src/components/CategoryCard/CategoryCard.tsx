import { FC } from "react";
import styles from "./CategoryCard.module.css";

import bottomLeft from "../../assets/icons/category_design.png";
import categoryTitleLeading from "../../assets/icons/category_title_leading.png";
import { Link } from "react-router-dom";
import ICategoryCard from "../../interfaces/ICategoryCard";

const CategoryCard: FC<ICategoryCard> = ({ selectedCategory, showButton }) => {
  const backend = import.meta.env.VITE_BACKEND;
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
        {selectedCategory ? selectedCategory.title : "Select a Category"}
      </h2>
      <p className={styles.description}>
        {selectedCategory
          ? selectedCategory?.description
          : "Please select a category to read more about it and discover the courses within it"}
      </p>
      {selectedCategory && showButton && (
        <Link
          to={`/course-catalogue/category/${selectedCategory.slug}`}
          className={styles.readMore}
        >
          Discover Courses
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
