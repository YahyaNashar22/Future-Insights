import { useEffect, useState } from "react";
import { useUserStore } from "../../store";
import styles from "./TeacherCourse.module.css";
import ICourse from "../../interfaces/ICourse";
import axios from "axios";
import Loading from "../Loading/Loading";
import { useNavigate } from "react-router-dom";

const TeacherCourseDisplay = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const { user } = useUserStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [courses, setCourses] = useState<ICourse[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await axios.post(
          `${backend}/course/get-by-teacher`,
          {
            teacherId: user?._id,
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
        setLoading(false);
      }
    };

    fetchCourses();
  }, [backend, user]);

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>My Courses</h1>
      {loading ? (
        <Loading />
      ) : courses.length > 0 ? (
        <ul className={styles.courseGrid}>
          {courses.map((course) => (
            <li
              key={course._id}
              className={styles.courseCard}
              onClick={() => navigate(`/dashboard/course-info/${course.slug}`)}
            >
              <div className={styles.thumbnailWrapper}>
                <img
                  src={`${backend}/${course.thumbnail}`}
                  alt={course.title}
                  className={styles.thumbnail}
                />
              </div>
              <div className={styles.courseInfo}>
                <h2 className={styles.courseTitle}>{course.title}</h2>
                <p className={styles.courseMeta}>
                  Price: <strong>${course.price?.toFixed(2)}</strong>
                </p>
                <p className={styles.courseMeta}>
                  Final Price: <strong>${course.finalPrice?.toFixed(2)}</strong>
                </p>
                <p className={styles.courseMeta}>
                  Duration: {course.duration || "N/A"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.noCourses}>You haven't added any courses yet!</p>
      )}
    </div>
  );
};

export default TeacherCourseDisplay;
