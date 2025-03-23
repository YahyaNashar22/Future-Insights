import { FC, Suspense, useEffect, useState } from "react";
import styles from "./CourseGrid.module.css";
import ICourse from "../../interfaces/ICourse";
import axios, { AxiosError } from "axios";
import Loading from "../Loading/Loading";
import { Link } from "react-router-dom";
import NoCurrentCourses from "../NoCurrentCourses/NoCurrentCourses";
import { useUserStore } from "../../store";

const CourseCard: FC<{ course: ICourse; fetchCourses: () => void }> = ({
  course,
  fetchCourses,
}) => {
  const { user } = useUserStore();
  const backend = import.meta.env.VITE_BACKEND;

  const [error, setError] = useState<string | null>(null);
  const [purchaseModal, setPurchaseModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const enrollInCourse = async () => {
    try {
      setLoading(true);
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
        setPurchaseModal(false);
        fetchCourses();
      }
    } catch (error) {
      console.error("Error enrolling in the course:", error);
      if (error instanceof AxiosError) {
        setError(error.response?.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

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
          {/* user not signed in */}
          {!user && (
            <Link to={`/signin`} className={styles.viewCourse}>
              View Course
            </Link>
          )}
          {/* user signed in and not enrolled */}
          {user && !course.enrolledUsers.includes(user._id) && (
            <button
              type="button"
              onClick={() => setPurchaseModal(true)}
              className={styles.viewCourse}
            >
              Enroll
            </button>
          )}
          {/* user signed in and enrolled */}
          {user && course.enrolledUsers.includes(user._id) && (
            <Link
              to={`/course-catalogue/course/${course.slug}`}
              className={styles.viewCourse}
            >
              View Course
            </Link>
          )}
        </div>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      {purchaseModal && (
        <div className={styles.purchaseModalWrapper}>
          <div className={styles.purchaseModal}>
            <h3 className={styles.modalTitle}>Confirm Enrollment</h3>
            <p className={styles.modalText}>
              Are you sure you want to enroll in {course.title} for $
              {course.price}?
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.cancelButton}
                onClick={() => setPurchaseModal(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className={styles.confirmButton}
                onClick={enrollInCourse}
                disabled={loading}
              >
                {loading ? "Enrolling..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </li>
  );
};

const CourseGrid: FC<{ categoryId?: string }> = ({ categoryId }) => {
  const backend = import.meta.env.VITE_BACKEND;

  const [courses, setCourses] = useState<ICourse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      console.log(res);
      setCourses(res.data.payload);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
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
                  return (
                    <CourseCard
                      key={course._id}
                      course={course}
                      fetchCourses={fetchCourses}
                    />
                  );
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
