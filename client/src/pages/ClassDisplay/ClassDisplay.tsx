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
import { useUserStore } from "../../store";

const ClassDisplay = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const { slug } = useParams();
  const { user } = useUserStore();
  const navigate = useNavigate();

  const [cls, setCls] = useState<IClass | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const [selectedItem, setSelectedItem] = useState<
    ILiveLink | IRecording | IMaterial | IAssessment | null
  >(null);

  const togglePanel = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const fetchClass = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${backend}/class/get-class/${slug}`);

        console.log(res);

        if (
          !res.data.payload ||
          (!res.data.payload.enrolledUsers.some(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (u: any) => u._id === user?._id
          ) &&
            user?._id !== res.data.payload.teacher &&
            user?._id)
        )
          navigate("*");

        setCls(res.data.payload);

        if (cls && !cls?.enrolledUsers.includes(user!._id)) navigate("*");
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchClass();
  }, [backend, slug, navigate, user]);
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
          <ClassContent selectedItem={selectedItem} cls={cls} />
        </main>
      )}
    </>
  );
};

export default ClassDisplay;
