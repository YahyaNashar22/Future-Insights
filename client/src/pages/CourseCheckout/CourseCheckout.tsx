import styles from "./CourseCheckout.module.css";

import axios, { AxiosError } from "axios";
import { useUserStore } from "../../store";
import { useEffect, useState } from "react";
import ICourse from "../../interfaces/ICourse";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../../components/Loading/Loading";

const CourseCheckout = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const { user } = useUserStore();
  const { slug } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState<ICourse | null>(null);
  const [loading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${backend}/course/get-course/${slug}`);
        setCourse(res.data.payload);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [backend, slug]);

  const enrollInCourse = async () => {
    try {
      const response = await axios.post(
        `${backend}/user/enroll-course`,
        {
          userId: user?._id,
          courseId: course?._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.message === "Enrolled successfully") {
        setSuccess(true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
    } catch (error) {
      console.error("Error enrolling in the course:", error);
      if (error instanceof AxiosError) {
        setError(error.response?.data.message || "Something went wrong.");
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <main className={styles.wrapper}>
      {error && <div className={styles.error}>{error}</div>}
      {success && (
        <div className={styles.success}>
          Enrollment successful! Redirecting...
        </div>
      )}

      {course && (
        <div className={styles.card}>
          <img
            src={`${backend}/${course.thumbnail}`}
            alt={course.title}
            className={styles.image}
          />
          <div className={styles.details}>
            <h2 className={styles.title}>{course.title}</h2>
            <p className={styles.description}>{course.description}</p>
            <p className={styles.duration}>Duration: {course.duration}</p>
            <p className={styles.teacher}>
              Instructor: {course.teacher.fullname}
            </p>

            {course.price !== course.finalPrice ? (
              <div className={styles.priceSection}>
                <span className={styles.originalPrice}>${course.price}</span>
                <span className={styles.finalPrice}>${course.finalPrice}</span>
              </div>
            ) : (
              <div className={styles.priceSection}>
                <span className={styles.finalPrice}>${course.finalPrice}</span>
              </div>
            )}

            <button className={styles.enrollBtn} onClick={enrollInCourse}>
              Confirm & Enroll
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default CourseCheckout;
