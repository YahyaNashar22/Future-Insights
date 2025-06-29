import { useNavigate, useParams } from "react-router-dom";
import styles from "./ClassShowCase.module.css";
import { useUserStore } from "../../store";
import { useEffect, useState } from "react";
import IClass from "../../interfaces/IClass";
import axios, { AxiosError } from "axios";
import Loading from "../../components/Loading/Loading";
import IModule from "../../interfaces/IModule";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../langStore";
import { parseBullets } from "../../utils/ParseList";

const ClassShowCase = () => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const isArabic = language === "ar";

  const backend = import.meta.env.VITE_BACKEND;
  const { slug } = useParams();
  const { user } = useUserStore();
  const navigate = useNavigate();

  const [cls, setCls] = useState<IClass | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [purchaseModal, setPurchaseModal] = useState<boolean>(false);
  const [modules, setModules] = useState<IModule[]>([]);

  useEffect(() => {
    const fetchClass = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${backend}/class/get-class/${slug}`);
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

  useEffect(() => {
    if (!cls) return;
    const fetchModules = async () => {
      try {
        const params: { [key: string]: string } = {};
        if (cls.type === "class") {
          params.classId = cls._id;
        } else if (cls.type === "course") {
          params.courseId = cls._id;
        }

        const res = await axios.get(`${backend}/module`, {
          params,
        });
        setModules(res.data.payload);
      } catch (error) {
        console.log(error);
      }
    };
    fetchModules();
  }, [backend, cls]);

  const generateOrderId = () => {
    return `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
  };

  const enrollInCourse = async () => {
    if (!user) navigate("/signin");
    try {
      setLoading(true);
      // const response = await axios.post(
      //   `${backend}/user/enroll-class`,
      //   {
      //     userId: user?._id,
      //     courseId: cls?._id,
      //   },
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );

      // if (response.data.message === "Enrolled successfully") {
      //   setPurchaseModal(false);
      //   navigate(`/course-catalogue/class/${cls?.slug}`);
      // }

      const data = {
        order_id: generateOrderId(),
        currency: "AED",
        amount: cls?.finalPrice.toFixed(2),
        billing_name: user?.fullname,
        billing_email: user?.email,
        billing_tel: "9999999999",
        billing_address: "123 Street",
        billing_city: "Dubai",
        billing_state: "Dubai",
        billing_zip: "400001",
        billing_country: "UAE",
        redirect_url: `https://futureinsights.ae/ccavResponseHandler`,
        merchant_param1: cls?._id,
        merchant_param2: user?._id,
        merchant_param3: cls?.slug,
      };

      const response = await axios.post(`${backend}/ccavRequestHandler`, data);

      // If the response contains HTML (redirect form)
      if (response.data.includes('<form id="redirectForm"')) {
        // Create a temporary div to append the response HTML to
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = response.data;

        // Find the form inside the HTML and append it to the body
        const form = tempDiv.querySelector("form");

        if (form) {
          document.body.appendChild(form);
          // Submit the form to initiate the payment
          form.submit();
        } else {
          console.error("Form not found in the response.");
        } // Submit the form to initiate the payment
      } else {
        console.error("Unexpected response format.");
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
              <h1>{isArabic ? cls.arabicTitle : cls.title}</h1>
              <p className={styles.teacher}>
                {t("class-instructor")}: {cls.teacher.fullname}
              </p>
              <p className={styles.duration}>
                {t("duration")}: {cls.duration}
              </p>
              <p className={styles.category}>
                {t("class-category")}: {cls.category.title}
              </p>
              <div className={styles.priceBox}>
                {cls.discount > 0 && (
                  <span className={styles.originalPrice}>AED {cls.price}</span>
                )}
                {cls.price !== 0 && (
                  <span className={styles.finalPrice}>
                    AED {cls.finalPrice}
                  </span>
                )}
              </div>

              {user?._id === cls.teacher._id ? (
                <button
                  onClick={() =>
                    navigate(`/course-catalogue/class/${cls?.slug}`)
                  }
                  className={styles.buyBtn}
                >
                  View
                </button>
              ) : (
                modules.length !== 0 &&
                cls.price !== 0 && (
                  <>
                    {!isEnrolled ? (
                      <button
                        className={styles.buyBtn}
                        onClick={() => setPurchaseModal(true)}
                      >
                        {t("enroll-now")}
                      </button>
                    ) : (
                      <p className={styles.enrolledText}>
                        {t("already-enrolled")} 🎉
                      </p>
                    )}
                  </>
                )
              )}
            </div>
          </div>
          <section className={styles.description}>
            <h2>{t("class-about")}</h2>
            <div className={styles.descriptionText}>
              {parseBullets(
                isArabic ? cls.arabicDescription : cls.description,
                isArabic
              )}
            </div>
            {cls.demo && (
              <div className={styles.demo}>
                <h3>{t("demo-video")}</h3>
                <video
                  controls
                  width="100%"
                  height="auto"
                  src={`${backend}/${cls.demo}`}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </section>
          <section className={styles.description}>
            <h2>🌍 {t("course-showcase-accreditation-title")}</h2>
            <p className={styles.descriptionText}>
              {t("course-showcase-accreditation-text")}
            </p>
            <p className={styles.descriptionText}>
              {t("course-showcase-accreditation-bullet-1")}
            </p>
            <p className={styles.descriptionText}>
              {t("course-showcase-accreditation-bullet-2")}
            </p>
            <p className={styles.descriptionText}>
              {t("course-showcase-accreditation-text-2")}
            </p>
          </section>

          {error && <p className={styles.error}>{error}</p>}
          {/* Modal For Purchase Form  */}
          {purchaseModal && (
            <div className={styles.purchaseModalWrapper}>
              <div className={styles.purchaseModal}>
                <h3 className={styles.modalTitle}>{t("confirm-enrollment")}</h3>
                <p className={styles.modalText}>
                  {t("enroll-confirmation")}{" "}
                  {isArabic ? cls.arabicTitle : cls?.title} AED
                  {cls?.finalPrice?.toFixed(2)}?
                </p>
                <div className={styles.modalActions}>
                  <button
                    className={styles.cancelButton}
                    onClick={() => setPurchaseModal(false)}
                    disabled={loading}
                  >
                    {t("cancel")}
                  </button>
                  <button
                    className={styles.confirmButton}
                    onClick={enrollInCourse}
                    disabled={loading}
                  >
                    {loading ? t("enrolling") : t("confirm")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      ) : (
        <p>{t("class-not-found")}</p>
      )}
    </>
  );
};

export default ClassShowCase;
