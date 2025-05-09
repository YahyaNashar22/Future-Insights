import styles from "./MyCourses.module.css";

import { Suspense, useEffect, useState } from "react";
import ICourse from "../../interfaces/ICourse";
import axios from "axios";
import Loading from "../../components/Loading/Loading";
import CourseCard from "../../components/CourseCard/CourseCard";
import NoCurrentCourses from "../../components/NoCurrentCourses/NoCurrentCourses";
import { useUserStore } from "../../store";
import ICertification from "../../interfaces/ICertification";
import { Link } from "react-router-dom";
import EditProfile from "../../components/EditProfile/EditProfile";
import { useTranslation } from "react-i18next";

const MyCourses = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const { user } = useUserStore();

  const { t } = useTranslation();

  const [courses, setCourses] = useState<ICourse[]>([]);
  const [classes, setClasses] = useState<ICourse[]>([]);
  const [certifications, setCertifications] = useState<ICertification[]>([]);
  const [activeTab, setActiveTab] = useState<
    "courses" | "classes" | "certifications" | "edit profile"
  >("classes");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchClasses = async () => {
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${backend}/user/get-enrolled-classes`,
        {
          userId: user?._id,
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
        `${backend}/user/get-enrolled-courses`,
        {
          userId: user?._id,
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

  const fetchCertifications = async () => {
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${backend}/certification/get-user-certifications`,
        {
          userId: user?._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setCertifications(res.data.payload);
      console.log(res.data.payload);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchClasses();
    fetchCertifications();
  }, [backend]);

  return (
    <Suspense fallback={<Loading />}>
      <section className={styles.wrapper}>
        {isLoading ? (
          <Loading />
        ) : (
          <div className={styles.coursesAndClasses}>
            {/* navbar filters  */}
            <div className={styles.navbar}>
              <button
                className={`${styles.navButton} ${
                  activeTab === "classes" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("classes")}
              >
                {t("classes")}
              </button>
              <button
                className={`${styles.navButton} ${
                  activeTab === "courses" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("courses")}
              >
                {t("courses")}
              </button>

              <button
                className={`${styles.navButton} ${
                  activeTab === "certifications" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("certifications")}
              >
                {t("certifications")}
              </button>

              <button
                className={`${styles.navButton} ${
                  activeTab === "edit profile" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("edit profile")}
              >
                {t("edit-profile")}
              </button>
            </div>

            <div className={styles.container}>
              {activeTab === "courses" && (
                <>
                  <h2 className={styles.containerTitle}>{t('courses')}</h2>
                  {courses.length > 0 ? (
                    <ul className={styles.courseGrid}>
                      {courses.map((course) => (
                        <CourseCard
                          key={course._id}
                          course={course}
                          isCourse={true}
                          fetchCourses={fetchCourses}
                          fetchClasses={fetchClasses}
                        />
                      ))}
                    </ul>
                  ) : (
                    <NoCurrentCourses course={true} />
                  )}
                </>
              )}

              {activeTab === "classes" && (
                <>
                  <h2 className={styles.containerTitle}>{t('classes')}</h2>
                  {classes.length > 0 ? (
                    <ul className={styles.courseGrid}>
                      {classes.map((cls) => (
                        <CourseCard
                          key={cls._id}
                          course={cls}
                          isCourse={false}
                          fetchCourses={fetchCourses}
                          fetchClasses={fetchClasses}
                        />
                      ))}
                    </ul>
                  ) : (
                    <NoCurrentCourses course={false} />
                  )}
                </>
              )}

              {activeTab === "certifications" && (
                <>
                  <h2 className={styles.containerTitle}>{t('certifications')}</h2>
                  {certifications.length > 0 ? (
                    <ul className={styles.courseGrid}>
                      {certifications.map((certification) => (
                        <li
                          key={certification._id}
                          className={styles.certificationCard}
                        >
                          <Link
                            to={`/certification/${certification.slug}`}
                            className={styles.certificationLink}
                          >
                            <h3 className={styles.certificationTitle}>
                              {certification.courseId?.title ||
                                certification.classId?.title ||
                                "Untitled Course"}
                            </h3>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <NoCurrentCourses course={false} />
                  )}
                </>
              )}

              {activeTab === "edit profile" && <EditProfile />}
            </div>
          </div>
        )}
      </section>
    </Suspense>
  );
};

export default MyCourses;
