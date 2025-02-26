import { FC } from "react";

import styles from "./CourseCategories.module.css";

import category from "../../assets/icons/category.png";
import ICategory from "../../interfaces/ICategory";

const CourseCategories: FC<{
  categories: ICategory[] | null;
  setSelectedCategory: (category: ICategory) => void;
}> = ({ categories, setSelectedCategory }) => {
  return (
    <section className={styles.wrapper}>
      <img
        src={category}
        alt="category"
        loading="lazy"
        className={styles.category}
      />
      <ul className={styles.categoryContainer}>
        {categories?.map((category, index) => {
          return (
            <li
              key={category.id || index}
              className={styles.categoryTitle}
              onClick={() => setSelectedCategory(category)}
            >
              {category.title}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default CourseCategories;
