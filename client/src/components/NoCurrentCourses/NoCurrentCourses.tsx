import { Link } from "react-router-dom";
import styles from "./NoCurrentCourses.module.css";

const NoCurrentCourses = () => {
  return (
    <div className={styles.noCoursesContainer}>
      <h1 className={styles.noCoursesTitle}>No Courses Available</h1>
      <p className={styles.noCoursesMessage}>
        There are currently no courses in this section. Please check back later.
      </p>
      <Link to="/course-catalogue" className={styles.courseCatalogueLink}>
        Course Catalogue
      </Link>
    </div>
  );
};

export default NoCurrentCourses;
