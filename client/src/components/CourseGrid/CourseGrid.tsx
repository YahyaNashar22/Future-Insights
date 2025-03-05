import { FC, Suspense, useEffect, useState } from "react";
import styles from "./CourseGrid.module.css";
import ICourse from "../../interfaces/ICourse";
import axios from "axios";
import Loading from "../Loading/Loading";
import { Link } from "react-router-dom";

const CourseCard: FC<{ course: ICourse }> = ({ course }) => {
  const backend = import.meta.env.VITE_BACKEND;

  return (
    <li className={styles.courseCard}>
      <div className={styles.thumbnailWrapper}>
        <img
          src={`${backend}/${course.thumbnail}`}
          alt={course.title}
          loading="lazy"
          className={styles.thumbnail}
        />
      </div>
      <div className={styles.courseInfo}>
        <h2 className={styles.courseTitle}>{course.title}</h2>
        <p className={styles.courseDescription}>{course.description}</p>
        <div className={styles.courseFooter}>
          <span className={styles.coursePrice}>${course.price}</span>
          <Link
            to={`/course-catalogue/course/${course.slug}`}
            className={styles.viewCourse}
          >
            View Course
          </Link>
        </div>
      </div>
    </li>
  );
};

const CourseGrid: FC<{ categoryId?: string }> = ({ categoryId }) => {
  const backend = import.meta.env.VITE_BACKEND;

  const [courses, setCourses] = useState<ICourse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setIsLoading(true);
        const res = await axios.post(
          `${backend}/course/get-courses-by-category`,
          {
            categoryId,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(res);
        setCourses(res.data.payload);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategory();
  }, [categoryId, backend]);

  return (
    <Suspense fallback={<Loading />}>
      <section className={styles.wrapper}>
        {isLoading ? (
          <Loading />
        ) : (
          <ul className={styles.courseGrid}>
            {courses.map((course) => {
              return <CourseCard key={course._id} course={course} />;
            })}
          </ul>
        )}
      </section>
    </Suspense>
  );
};

export default CourseGrid;
