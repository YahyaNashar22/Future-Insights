import { useNavigate, useParams } from "react-router-dom";
import styles from "./ClassShowCase.module.css";
import { useUserStore } from "../../store";
import { useEffect, useState } from "react";
import IClass from "../../interfaces/IClass";
import axios, { AxiosError } from "axios";
import Loading from "../../components/Loading/Loading";
import IModule from "../../interfaces/IModule";

const ClassShowCase = () => {
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

      const response = await axios.post(`${backend}/ccavRequestHandler`, {
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
        course_id: cls?._id
      });
      console.log("Response from Backend:", response.data);

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
              <h1>{cls.title}</h1>
              <p className={styles.teacher}>
                Instructor: {cls.teacher.fullname}
              </p>
              <p className={styles.duration}>Duration: {cls.duration}</p>
              <p className={styles.category}>Category: {cls.category.title}</p>
              <div className={styles.priceBox}>
                {cls.discount > 0 && (
                  <span className={styles.originalPrice}>${cls.price}</span>
                )}
                {cls.price !== 0 && (
                  <span className={styles.finalPrice}>${cls.finalPrice}</span>
                )}
              </div>
              {modules.length !== 0 && (
                <>
                  {!isEnrolled ? (
                    <button
                      className={styles.buyBtn}
                      onClick={() => setPurchaseModal(true)}
                    >
                      Enroll Now
                    </button>
                  ) : (
                    <p className={styles.enrolledText}>
                      You are already enrolled 🎉
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
          <section className={styles.description}>
            <h2>About this class</h2>
            <p className={styles.descriptionText}>{cls.description}</p>
            {cls.demo && (
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
            )}
          </section>
          <section className={styles.description}>
            <h2>🌍 International Accreditation & Recognition</h2>
            <p className={styles.descriptionText}>
              At <span className={styles.beige}> Future Insights </span>, we
              take pride in offering high-impact training programs that are
              thoughtfully designed to meet the needs of today's dynamic
              business environment. Our courses are developed to empower
              ambitious professionals with the practical skills and strategic
              insights they need to grow and succeed in their careers. Upon
              completing the course—through full attendance and successfully
              passing the final assessment—participants will receive a
              Certificate of Achievement accredited by Future Insights. This
              certificate reflects our commitment to excellence and is
              recognized for its value in professional development across
              various industries and markets. Whether you're aiming for career
              advancement, internal promotion, or seeking new opportunities,
              this certificate serves as a mark of your dedication to continuous
              growth and learning. It's more than a credential—it's a step
              forward in your leadership journey.
            </p>
          </section>

          <section className={styles.description} style={{ direction: "rtl" }}>
            <h2 style={{ direction: "rtl" }}>🌍 الاعتماد والاعتراف الدولي</h2>
            <p className={styles.descriptionText} style={{ direction: "rtl" }}>
              تفخر <span className={styles.beige}> Future Insights </span>{" "}
              بتقديم برامج تدريبية عالية التأثير، مصممة بعناية لتلبية متطلبات
              بيئة الأعمال المتغيرة باستمرار. تهدف دوراتنا إلى تمكين المهنيين
              الطموحين بالمهارات العملية والرؤى الاستراتيجية التي تساعدهم على
              النمو وتحقيق النجاح في مسيرتهم المهنية. عند إتمام الدورة بنجاح، من
              خلال الحضور الكامل واجتياز التقييم النهائي، يحصل المشاركون على
              شهادة إنجاز معتمدة من{" "}
              <span className={styles.beige}> Future Insights </span>. تعكس هذه
              الشهادة التزامنا بالتميز، وتحظى بقيمة مهنية عالية في مختلف
              القطاعات والأسواق. سواء كنت تسعى إلى الترقية، أو تطوير مسارك داخل
              المؤسسة، أو تبحث عن فرص جديدة، فإن هذه الشهادة تمثل دليلاً على
              التزامك بالنمو المستمر والتعلم القيادي. فهي ليست مجرد شهادة، بل
              خطوة عملية نحو تطويرك التنفيذي
            </p>
          </section>
          {error && <p className={styles.error}>{error}</p>}
          {/* Modal For Purchase Form  */}
          {purchaseModal && (
            <div className={styles.purchaseModalWrapper}>
              <div className={styles.purchaseModal}>
                <h3 className={styles.modalTitle}>Confirm Enrollment</h3>
                <p className={styles.modalText}>
                  Are you sure you want to enroll in {cls?.title} for $
                  {cls?.finalPrice?.toFixed(2)}?
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
        </main>
      ) : (
        <p>Class not found.</p>
      )}
    </>
  );
};

export default ClassShowCase;
