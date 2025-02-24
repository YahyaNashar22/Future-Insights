import { FC } from "react";

import styles from "./CourseCategories.module.css";

import category from "../../assets/icons/category.png";
import ICategory from "../../interfaces/ICategory";

const CourseCategories: FC<{ categories: ICategory[] | null }> = ({
  categories,
}) => {
  return (
    <section className={styles.wrapper}>
      <img
        src={category}
        alt="category"
        loading="lazy"
        className={styles.category}
      />
      <ul className={styles.categoryContainer}>
        {categories?.map((category) => {
          return <li key={category.id} className={styles.categoryTitle}>{category.title}</li>;
        })}
      </ul>
    </section>
  );
};

export default CourseCategories;
