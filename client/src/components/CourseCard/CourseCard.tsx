import { FC, useState } from "react";
import ICourse from "../../interfaces/ICourse";
import styles from "./CourseCard.module.css";
import { useUserStore } from "../../store";
import axios, { AxiosError } from "axios";
import { Link } from "react-router-dom";
import IClass from "../../interfaces/IClass";

const CourseCard: FC<{
  course: ICourse | IClass;
  isCourse: boolean;
  fetchCourses: () => void;
  fetchClasses: () => void;
}> = ({ course, isCourse, fetchCourses, fetchClasses }) => {
  const { user } = useUserStore();
  const backend = import.meta.env.VITE_BACKEND;

  const [error, setError] = useState<string | null>(null);
  const [purchaseModal, setPurchaseModal] = useState<boolean>(false);
  const [demoModal, setDemoModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const enrollInCourse = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        isCourse
          ? `${backend}/user/enroll-course`
          : `${backend}/user/enroll-class`,
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
        fetchClasses();
      }
    } catch (error) {
      console.error("Error enrolling in the class:", error);
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
          <span className={styles.demo} onClick={() => setDemoModal(true)}>
            Demo
          </span>

          {/* user not signed in */}
          {!user && (
            <Link to={`/signin`} className={styles.viewCourse}>
              {isCourse ? "View Course" : "View Class"}
            </Link>
          )}
          {/* user signed in and not enrolled */}
          {user &&
            !course.enrolledUsers.includes(user._id) &&
            user._id !== course.teacher && (
              <button
                type="button"
                onClick={() => setPurchaseModal(true)}
                className={styles.viewCourse}
              >
                Enroll
              </button>
            )}
          {/* user signed in and enrolled */}
          {user &&
            (course.enrolledUsers.includes(user._id) ||
              user._id === course.teacher) && (
              <Link
                to={
                  isCourse
                    ? `/course-catalogue/course/${course.slug}`
                    : `/course-catalogue/class/${course.slug}`
                }
                className={styles.viewCourse}
              >
                {isCourse ? "View Course" : "View Class"}
              </Link>
            )}
        </div>
      </div>

      {/* Error Message to be displayed in case of bad enrollment  */}
      {error && <p className={styles.error}>{error}</p>}

      {/* Modal For Purchase Form  */}
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

      {/* Modal for watching demo  */}

      {demoModal && (
        <div className={styles.purchaseModalWrapper}>
          <div className={styles.purchaseModal}>
            <h3 className={styles.modalTitle}>{course.title} Demo</h3>

            {course.demo ? (
              <video
                key={course._id} // Force re-render when the video changes
                className={styles.videoPlayer}
                controls
                poster={course?.thumbnail}
                controlsList="nodownload"
                disablePictureInPicture
              >
                {course.demo && (
                  <source src={`${backend}/${course.demo}`} type="video/mp4" />
                )}
                Your browser does not support the video tag.
              </video>
            ) : (
              <h3 className={styles.noDemo}>
                unfortunately, no demo is available at the moment
              </h3>
            )}

            <div className={styles.modalActions}>
              <button
                className={styles.cancelButton}
                onClick={() => setDemoModal(false)}
                disabled={loading}
              >
                Cancel
              </button>
              {user &&
                !course.enrolledUsers.includes(user._id) &&
                user._id !== course.teacher && (
                  <button
                    className={styles.confirmButton}
                    onClick={enrollInCourse}
                    disabled={loading}
                  >
                    {user &&
                      !course.enrolledUsers.includes(user._id) &&
                      loading &&
                      "Enrolling..."}
                    {user &&
                      !course.enrolledUsers.includes(user._id) &&
                      user._id !== course.teacher &&
                      !loading &&
                      "Enroll"}
                  </button>
                )}

              {user &&
                (course.enrolledUsers.includes(user._id) ||
                  user._id === course.teacher) && (
                  <Link
                    to={
                      isCourse
                        ? `/course-catalogue/course/${course.slug}`
                        : `/course-catalogue/class/${course.slug}`
                    }
                    className={styles.viewCourse}
                  >
                    Continue
                  </Link>
                )}
            </div>
          </div>
        </div>
      )}
    </li>
  );
};

export default CourseCard;
