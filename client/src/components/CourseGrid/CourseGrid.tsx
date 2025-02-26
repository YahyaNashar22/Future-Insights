import { FC } from "react";
import styles from "./CourseGrid.module.css";

const CourseGrid: FC<{ categoryId?: string }> = ({ categoryId }) => {
  return <section className={styles.wrapper}>{categoryId}</section>;
};

export default CourseGrid;
