import { useNavigate, useParams } from "react-router-dom";
import styles from "./CourseShowCase.module.css";
import { useUserStore } from "../../store";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../components/Loading/Loading";
import ICourse from "../../interfaces/ICourse";

const CourseShowCase = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const { slug } = useParams();
  const { user } = useUserStore();
  const navigate = useNavigate();

  const [cls, setCls] = useState<ICourse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchClass = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${backend}/course/get-course/${slug}`);
        if (!res.data.payload) return navigate("*");
        setCls(res.data.payload);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchClass();
  }, [backend, slug, navigate]);

  const handlePurchase = () => {
    navigate(`/checkout-course/${cls?.slug}`);
  };

  const isEnrolled = cls?.enrolledUsers.some((u) => {
    if (typeof u === "string") return u === user?._id;
    return u._id === user?._id;
  });

  return (
    <>
      {loading ? (
        <Loading />
      ) : cls ? (
        <main className={styles.wrapper}>
          <div className={styles.header}>
            <img
              src={`${backend}/${cls.thumbnail}`}
              alt={cls.title}
              className={styles.thumbnail}
            />
            <div className={styles.info}>
              <h1>{cls.title}</h1>
              <p className={styles.teacher}>
                Instructor: {cls.teacher.fullname}
              </p>
              <p className={styles.duration}>Duration: {cls.duration}</p>[]
              <p className={styles.category}>Category: {cls.category.title}</p>
              <div className={styles.priceBox}>
                {cls.discount > 0 && (
                  <span className={styles.originalPrice}>${cls.price}</span>
                )}
                <span className={styles.finalPrice}>${cls.finalPrice}</span>
              </div>
              {!isEnrolled ? (
                <button className={styles.buyBtn} onClick={handlePurchase}>
                  Enroll Now
                </button>
              ) : (
                <p className={styles.enrolledText}>
                  You are already enrolled 🎉
                </p>
              )}
            </div>
          </div>
          <section className={styles.description}>
            <h2>About this class</h2>
            <p className={styles.descriptionText}>{cls.description}</p>
            {cls.demo ? (
              <div className={styles.demo}>
                <h3>Demo Video</h3>
                <video
                  controls
                  width="100%"
                  height="auto"
                  src={`${backend}/${cls.demo}`}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <h3 className={styles.demoNotAvailable}>Demo not available.</h3>
            )}
          </section>
        </main>
      ) : (
        <p>Class not found.</p>
      )}
    </>
  );
};

export default CourseShowCase;
