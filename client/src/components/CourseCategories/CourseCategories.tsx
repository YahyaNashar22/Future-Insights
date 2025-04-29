import { FC } from "react";

import styles from "./CourseCategories.module.css";

import category from "../../assets/icons/category.png";
import ICategory from "../../interfaces/ICategory";
import { useLanguageStore } from "../../langStore";

const CourseCategories: FC<{
  categories: ICategory[] | null;
  setSelectedCategory: (category: ICategory) => void;
}> = ({ categories, setSelectedCategory }) => {
  const { language } = useLanguageStore();
  const isArabic = language === "ar";
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
              key={category._id || index}
              className={styles.categoryTitle}
              onClick={() => {
                setSelectedCategory(category);

                document
                  .getElementById("cat-card")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              {isArabic ? category.arabicTitle : category.title}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default CourseCategories;
