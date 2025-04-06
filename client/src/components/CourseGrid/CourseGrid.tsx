import { FC, Suspense, useEffect, useState } from "react";
import styles from "./CourseGrid.module.css";
import ICourse from "../../interfaces/ICourse";
import axios from "axios";
import Loading from "../Loading/Loading";
import NoCurrentCourses from "../NoCurrentCourses/NoCurrentCourses";
import CourseCard from "../CourseCard/CourseCard";

const CourseGrid: FC<{ categoryId?: string }> = ({ categoryId }) => {
  const backend = import.meta.env.VITE_BACKEND;

  const [courses, setCourses] = useState<ICourse[]>([]);
  const [classes, setClasses] = useState<ICourse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchClasses = async () => {
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${backend}/class/get-classes-by-category`,
        {
          categoryId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setClasses(res.data.payload);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCourses = async () => {
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
      setCourses(res.data.payload);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchClasses();
  }, [categoryId, backend]);

  return (
    <Suspense fallback={<Loading />}>
      <section className={styles.wrapper}>
        {isLoading ? (
          <Loading />
        ) : (
          <div className={styles.coursesAndClasses}>
            <div className={styles.container}>
              <h2 className={styles.containerTitle}>Courses</h2>
              {courses.length > 0 ? (
                <ul className={styles.courseGrid}>
                  {courses.map((course) => {
                    return (
                      <CourseCard
                        key={course._id}
                        course={course}
                        isCourse={true}
                        fetchCourses={fetchCourses}
                        fetchClasses={fetchClasses}
                      />
                    );
                  })}
                </ul>
              ) : (
                <NoCurrentCourses course={true} />
              )}
            </div>

            <div className={styles.container}>
              <h2 className={styles.containerTitle}>Classes</h2>
              {classes.length > 0 ? (
                <ul className={styles.courseGrid}>
                  {classes.map((cls) => {
                    return (
                      <CourseCard
                        key={cls._id}
                        course={cls}
                        isCourse={false}
                        fetchCourses={fetchCourses}
                        fetchClasses={fetchClasses}
                      />
                    );
                  })}
                </ul>
              ) : (
                <NoCurrentCourses course={false} />
              )}
            </div>
          </div>
        )}
      </section>
    </Suspense>
  );
};

export default CourseGrid;
