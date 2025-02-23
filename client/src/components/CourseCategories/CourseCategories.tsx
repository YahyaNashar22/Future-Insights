import styles from "./CourseCategories.module.css";

import category from "../../assets/icons/category.png";

const CourseCategories = () => {
  return (
    <section className={styles.wrapper}>
      <img
        src={category}
        alt="category"
        loading="lazy"
        className={styles.category}
      />
      <ul className={styles.categoryContainer}>
        
      </ul>
    </section>
  );
};

export default CourseCategories;
