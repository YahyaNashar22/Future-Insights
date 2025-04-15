import styles from "./CourseCheckout.module.css";

import axios, { AxiosError } from "axios";
import { useUserStore } from "../../store";
import { useEffect, useState } from "react";
import ICourse from "../../interfaces/ICourse";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading/Loading";

const CourseCheckout = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const { user } = useUserStore();
  const { slug } = useParams();

  const [course, setCourse] = useState<ICourse | null>(null);
  const [loading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
        // Handle successful enrollment, e.g., redirect the user or show a message
        console.log("Successfully enrolled in the course!");
      }
    } catch (error) {
      console.error("Error enrolling in the course:", error);
      if (error instanceof AxiosError) {
        setError(error.response?.data.message);
      }
    }
  };
  return <main className={styles.wrapper}></main>;
};

export default CourseCheckout;
