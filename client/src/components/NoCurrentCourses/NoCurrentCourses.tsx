import { Link } from "react-router-dom";
import styles from "./NoCurrentCourses.module.css";
import { useTranslation } from "react-i18next";

const NoCurrentCourses = ({ course }: { course: boolean }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.noCoursesContainer}>
      <h1 className={styles.noCoursesTitle}>
        {t("no")} {course ? t("courses-no-ll") : t("classes-no-ll")}{" "}
        {t("available")}
      </h1>
      <p className={styles.noCoursesMessage}>
        {t("no-classes-available-1")}{" "}
        {course ? t("courses-no-ll") : t("classes-no-ll")}{" "}
        {t("no-classes-available-2")}
      </p>
      <Link to="/course-catalogue" className={styles.courseCatalogueLink}>
        {t("course-catalogue")}
      </Link>
    </div>
  );
};

export default NoCurrentCourses;
