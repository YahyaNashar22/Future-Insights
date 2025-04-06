import styles from "./ModulePanel.module.css";

import logo from "../../assets/icons/logo.png";
import IClass from "../../interfaces/IClass";
import { useEffect, useState } from "react";
import IModule from "../../interfaces/IModule";
import axios from "axios";
import Loading from "../Loading/Loading";
import ModuleAccordion from "../ModuleAccordion/ModuleAccordion";

const ModulePanel = ({
  isOpen,
  togglePanel,
  cls,
}: {
  isOpen: boolean;
  cls: IClass | null;
  togglePanel: () => void;
}) => {
  const backend = import.meta.env.VITE_BACKEND;

  const [classModules, setClassModules] = useState<IModule[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openModuleIndex, setOpenModuleIndex] = useState<number | null>(null);

  const toggleModule = (index: number | null) => {
    setOpenModuleIndex((prev) => (prev === index ? null : index));
  };

  useEffect(() => {
    const fetchClassModules = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${backend}/module/${cls?._id}`);
        setClassModules(res.data.payload);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchClassModules();
  }, [backend, cls]);
  return (
    <div
      className={`${styles.wrapper} ${isOpen ? styles.open : styles.closed}`}
    >
      <button className={styles.toggleBtn} onClick={togglePanel}>
        {isOpen ? "Close" : "Open"}
      </button>
      <>
        {loading ? (
          <Loading />
        ) : (
          <>
            {isOpen && (
              <div className={styles.sidePanelContent}>
                <img
                  src={logo}
                  className={styles.logo}
                  width={100}
                  alt="future insights"
                  loading="lazy"
                />
                <ol className={styles.modulesList}>
                  {classModules.map((module, index) => {
                    return (
                      <ModuleAccordion
                      module={module}
                      index={index}
                      openModuleIndex={openModuleIndex}
                      toggleModule={toggleModule}
                      />
                    );
                  })}
                </ol>
              </div>
            )}
          </>
        )}
      </>
    </div>
  );
};

export default ModulePanel;
