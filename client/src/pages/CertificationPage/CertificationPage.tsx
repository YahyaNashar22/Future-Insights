import { useNavigate, useParams } from "react-router-dom";
import styles from "./CertificationPage.module.css";
import { useEffect, useState } from "react";
import ICertification from "../../interfaces/ICertification";
import { useUserStore } from "../../store";
import axios from "axios";
import Loading from "../../components/Loading/Loading";

const CertificationPage = () => {
  const { slug } = useParams();
  const { user } = useUserStore();
  const backend = import.meta.env.VITE_BACKEND;
  const navigate = useNavigate();

  const [certification, setCertification] = useState<ICertification | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCertification = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${backend}/certification/get/${slug}`);
        if (!res.data.payload) navigate("*");
        setCertification(res.data.payload);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCertification();
  }, [backend, navigate, user, slug]);
  return (
    <main className={styles.wrapper}>
      {loading ? (
        <Loading />
      ) : (
        <div className={styles.container}>{certification?.slug}</div>
      )}
    </main>
  );
};

export default CertificationPage;
