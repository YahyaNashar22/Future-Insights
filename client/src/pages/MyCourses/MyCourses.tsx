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

const MyCourses = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const { user } = useUserStore();

  const [courses, setCourses] = useState<ICourse[]>([]);
  const [classes, setClasses] = useState<ICourse[]>([]);
  const [certifications, setCertifications] = useState<ICertification[]>([]);

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

  // TODO: MAKE A NAVIGATION PANEL TO CHOOSE WHAT TO SHOW
  // TODO: CHANGE PROFILE INFO
  // TODO: https://certifier.io/ -- CHECK HOW TO LINK IT || OR TEMPLATE
  // TODO: ADD MATERIAL LOGIC TO CLASSES MODULES

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

            <div className={styles.container}>
              <h2 className={styles.containerTitle}>Certifications</h2>
              {certifications.length > 0 ? (
                <ul className={styles.courseGrid}>
                  {certifications.map((certification) => {
                    return (
                      <li
                        key={certification._id}
                        className={styles.certificationCard}
                      >
                        <Link
                          to={`/certification/${certification.slug}`}
                          className={styles.certificationLink}
                        >
                          <h3 className={styles.certificationTitle}>
                            {certification.courseId?.title || "Untitled Course"}
                          </h3>
                        </Link>
                      </li>
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

export default MyCourses;
