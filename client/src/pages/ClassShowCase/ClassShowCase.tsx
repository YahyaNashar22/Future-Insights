import { useNavigate, useParams } from "react-router-dom";
import styles from "./ClassShowCase.module.css";
import { useUserStore } from "../../store";
import { useEffect, useState } from "react";
import IClass from "../../interfaces/IClass";
import axios from "axios";
import Loading from "../../components/Loading/Loading";

const ClassShowCase = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const { slug } = useParams();
  const { user } = useUserStore();
  const navigate = useNavigate();

  const [cls, setCls] = useState<IClass | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchClass = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${backend}/class/get-class/${slug}`);

        console.log(res);

        if (!res.data.payload) navigate("*");

        setCls(res.data.payload);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchClass();
  }, [backend, slug, navigate]);

  return (
    <>{loading ? <Loading /> : <main className={styles.wrapper}></main>}</>
  );
};

export default ClassShowCase;
