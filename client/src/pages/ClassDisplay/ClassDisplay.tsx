import { useEffect, useState } from "react";
import ClassContent from "../../components/ClassContent/ClassContent";
import ModulePanel from "../../components/ModulePanel/ModulePanel";
import styles from "./ClassDisplay.module.css";
import { useNavigate, useParams } from "react-router-dom";
import IClass from "../../interfaces/IClass";
import axios from "axios";
import Loading from "../../components/Loading/Loading";
import ILiveLink from "../../interfaces/ILiveLink";
import IRecording from "../../interfaces/IRecording";
import IMaterial from "../../interfaces/IMaterial";
import IAssessment from "../../interfaces/IAssessment";

const ClassDisplay = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const { slug } = useParams();
  const navigate = useNavigate();

  const [cls, setCls] = useState<IClass | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const [selectedItem, setSelectedItem] = useState<ILiveLink | IRecording | IMaterial | IAssessment | null>(null);

  const togglePanel = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const fetchClass = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${backend}/class/get-class/${slug}`);

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
    <>
      {loading ? (
        <Loading />
      ) : (
        <main className={styles.wrapper}>
          <ModulePanel
            isOpen={isOpen}
            togglePanel={togglePanel}
            cls={cls}
            setSelectedItem={setSelectedItem}
            selectedItem={selectedItem}
          />
          <ClassContent />
        </main>
      )}
    </>
  );
};

export default ClassDisplay;
