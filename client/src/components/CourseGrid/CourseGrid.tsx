import { FC, Suspense, useEffect, useState } from "react";
import styles from "./CourseGrid.module.css";
import ICourse from "../../interfaces/ICourse";
import axios from "axios";
import Loading from "../Loading/Loading";
import NoCurrentCourses from "../NoCurrentCourses/NoCurrentCourses";
import CourseCard from "../CourseCard/CourseCard";
import { useTranslation } from "react-i18next";
import { useUserStore } from "../../store";

const CourseGrid: FC<{ categoryId?: string }> = ({ categoryId }) => {
  const backend = import.meta.env.VITE_BACKEND;

  const { t } = useTranslation();
  const { user } = useUserStore();

  const [courses, setCourses] = useState<ICourse[]>([]);
  const [classes, setClasses] = useState<ICourse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"courses" | "classes">("classes");

  const fetchClasses = async () => {
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${backend}/class/get-classes-by-category`,
        {
          categoryId,
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
            {/* navbar filters  */}
            <div className={styles.navbar}>
              {courses.length > 0 && (
                <button
                  className={`${styles.navButton} ${
                    activeTab === "courses" ? styles.active : ""
                  }`}
                  onClick={() => setActiveTab("courses")}
                >
                  {t("online-courses")}
                </button>
              )}
              {courses.length > 0 && (
                <button
                  className={`${styles.navButton} ${
                    activeTab === "classes" ? styles.active : ""
                  }`}
                  onClick={() => setActiveTab("classes")}
                >
                  {t("interactive-online-classes")}
                </button>
              )}
            </div>

            <div className={styles.container}>
              {activeTab === "courses" && (
                <>
                  <h2 className={styles.containerTitle}>
                    {t("online-courses")}
                  </h2>
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
                </>
              )}

              {activeTab === "classes" && (
                <>
                  <h2 className={styles.containerTitle}>
                    {t("interactive-online-classes")}
                  </h2>
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
                </>
              )}
            </div>
          </div>
        )}
      </section>
    </Suspense>
  );
};

export default CourseGrid;
