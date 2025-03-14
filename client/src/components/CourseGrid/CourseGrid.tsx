import { FC, Suspense, useEffect, useState } from "react";
import styles from "./CourseGrid.module.css";
import ICourse from "../../interfaces/ICourse";
import axios from "axios";
import Loading from "../Loading/Loading";
import { Link } from "react-router-dom";
import NoCurrentCourses from "../NoCurrentCourses/NoCurrentCourses";
import { useUserStore } from "../../store";

const CourseCard: FC<{ course: ICourse }> = ({ course }) => {
  const { user } = useUserStore();
  const backend = import.meta.env.VITE_BACKEND;

  const enrollInCourse = async () => {
    try {
      const response = await axios.post(
        `${backend}/user/enroll-course`,
        {
          userId: user?._id,
          courseId: course._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.message === "Enrolled successfully") {
        // Handle successful enrollment, e.g., redirect the user or show a message
        console.log("Successfully enrolled in the course!");
      }
    } catch (error) {
      console.error("Error enrolling in the course:", error);
    }
  };

  return (
    <li className={styles.courseCard}>
      <div className={styles.thumbnailWrapper}>
        <img
          onClick={enrollInCourse} // TODO: REMOVE THIS AFTER TESTING
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
          <>
            {courses.length > 0 ? (
              <ul className={styles.courseGrid}>
                {courses.map((course) => {
                  return <CourseCard key={course._id} course={course} />;
                })}
              </ul>
            ) : (
              <NoCurrentCourses />
            )}
          </>
        )}
      </section>
    </Suspense>
  );
};

export default CourseGrid;
