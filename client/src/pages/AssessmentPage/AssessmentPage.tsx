import { useParams } from "react-router-dom";
import styles from "./AssessmentPage.module.css";
import { useEffect, useState } from "react";
import { useUserStore } from "../../store";
import IAssessment from "../../interfaces/IAssessment";
import axios from "axios";
import Loading from "../../components/Loading/Loading";

const AssessmentPage = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const { slug } = useParams();
  const { user } = useUserStore();

  const [loading, setLoading] = useState<boolean>(false);
  const [assessment, setAssessment] = useState<IAssessment | null>(null);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${backend}/assessment/get-one/${slug}`);
        setAssessment(res.data.payload);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [backend, slug]);

  const handleUpload = async () => {
    alert(user?._id);
  };

  return (
    <main className={styles.wrapper}>
      {loading ? (
        <Loading />
      ) : (
        <div className={styles.container}>
          <h1 className={styles.title}>
            <span className={styles.type}>{assessment?.type}</span> -{" "}
            {assessment?.title}
          </h1>
          <h2 className={styles.classTitle}>
            Class: {assessment?.classId.title}
          </h2>
          <p className={styles.description}>{assessment?.description}</p>
          <button
            type="button"
            className={styles.upload}
            onClick={handleUpload}
          >
            upload answer
          </button>
        </div>
      )}
    </main>
  );
};

export default AssessmentPage;
