import { FC, useState } from "react";
import ICourse from "../../interfaces/ICourse";
import styles from "./CourseCard.module.css";
import { useUserStore } from "../../store";
import { Link } from "react-router-dom";
import IClass from "../../interfaces/IClass";
import { parseBullets } from "../../utils/ParseList";

const CourseCard: FC<{
  course: ICourse | IClass;
  isCourse: boolean;
  fetchCourses: () => void;
  fetchClasses: () => void;
}> = ({ course, isCourse }) => {
  const { user } = useUserStore();
  const backend = import.meta.env.VITE_BACKEND;

  const [demoModal, setDemoModal] = useState<boolean>(false);

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
        <p className={styles.courseDescription}>
          {parseBullets(course.description)}
        </p>
        <div className={styles.courseFooter}>
          {course.finalPrice > 0 && (
            <span className={styles.coursePrice}>
              AED{course.finalPrice?.toFixed(2)}
            </span>
          )}
          {course.demo && (
            <span className={styles.demo} onClick={() => setDemoModal(true)}>
              Demo
            </span>
          )}

          {!user && (
            <Link
              to={
                isCourse
                  ? `/show-case/course/${course.slug}`
                  : `/show-case/class/${course.slug}`
              }
              className={styles.viewCourse}
            >
              View More
            </Link>
          )}
          {/* user signed in and not enrolled */}
          {user &&
            !course.enrolledUsers.includes(user._id) &&
            user._id !== course.teacher._id && (
              <Link
                to={
                  isCourse
                    ? `/show-case/course/${course.slug}`
                    : `/show-case/class/${course.slug}`
                }
                className={styles.viewCourse}
              >
                View More
              </Link>
            )}
          {/* user signed in and enrolled */}
          {user &&
            (course.enrolledUsers.includes(user._id) ||
              user._id === course.teacher._id) && (
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
              >
                Cancel
              </button>

              {user &&
                (course.enrolledUsers.includes(user._id) ||
                  user._id === course.teacher._id) && (
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

              {!user ||
                (!course.enrolledUsers.includes(user._id) &&
                  user._id !== course.teacher._id && (
                    <Link
                      to={
                        isCourse
                          ? `/show-case/course/${course.slug}`
                          : `/show-case/class/${course.slug}`
                      }
                      className={styles.viewCourse}
                    >
                      View More
                    </Link>
                  ))}
            </div>
          </div>
        </div>
      )}
    </li>
  );
};

export default CourseCard;
