import { FC, useState } from "react";
import ICourse from "../../interfaces/ICourse";
import styles from "./CourseCard.module.css";
import { useUserStore } from "../../store";
import { Link } from "react-router-dom";
import IClass from "../../interfaces/IClass";
import { parseBullets } from "../../utils/ParseList";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../langStore";

const CourseCard: FC<{
  course: ICourse | IClass;
  isCourse: boolean;
  fetchCourses: () => void;
  fetchClasses: () => void;
}> = ({ course, isCourse }) => {
  const { user } = useUserStore();
  const backend = import.meta.env.VITE_BACKEND;

  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const isArabic = language === "ar";

  const [demoModal, setDemoModal] = useState<boolean>(false);

  return (
    <li className={`${styles.courseCard} ${isArabic ? styles.arabic : ""}`}>
      <div className={styles.thumbnailWrapper}>
        <img
          src={`${backend}/${course.thumbnail}`}
          alt={course.title}
          loading="lazy"
          className={styles.thumbnail}
        />
      </div>
      <div className={styles.courseInfo}>
        <h2
          className={`${styles.courseTitle} ${isArabic ? styles.arabic : ""}`}
        >
          {isArabic ? course.arabicTitle : course.title}
        </h2>
        <div
          className={`${styles.courseDescription} ${
            isArabic ? styles.arabic : ""
          }`}
        >
          {parseBullets(
            isArabic ? course.arabicDescription : course.description,
            isArabic
          )}
        </div>
        <div className={styles.courseFooter}>
          {course.finalPrice > 0 && (
            <span className={styles.coursePrice}>AED{course.finalPrice}</span>
          )}
          {course.demo && (
            <span className={styles.demo} onClick={() => setDemoModal(true)}>
              {t("course-card-demo")}
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
              {t("course-card-more")}
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
                {t("course-card-more")}
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
                {isCourse
                  ? t("course-card-view-course")
                  : t("course-card-view-class")}
              </Link>
            )}
        </div>
      </div>

      {/* Modal for watching demo  */}

      {demoModal && (
        <div className={styles.purchaseModalWrapper}>
          <div className={styles.purchaseModal}>
            <h3 className={styles.modalTitle}>
              {course.title} {t("course-card-demo")}
            </h3>

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
              <h3 className={styles.noDemo}>{t("course-card-demo-no-demo")}</h3>
            )}

            <div className={styles.modalActions}>
              <button
                className={styles.cancelButton}
                onClick={() => setDemoModal(false)}
              >
                {t("course-card-cancel")}
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
                    {t("course-card-continue")}
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
                      {t("course-card-more")}
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
