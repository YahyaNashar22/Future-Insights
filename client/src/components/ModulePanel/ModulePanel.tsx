import styles from "./ModulePanel.module.css";

import IClass from "../../interfaces/IClass";
import { useEffect, useRef, useState } from "react";
import IModule from "../../interfaces/IModule";
import axios, { AxiosError } from "axios";
import Loading from "../Loading/Loading";
import ModuleAccordion from "../ModuleAccordion/ModuleAccordion";
import ILiveLink from "../../interfaces/ILiveLink";
import IRecording from "../../interfaces/IRecording";
import IMaterial from "../../interfaces/IMaterial";
import IAssessment from "../../interfaces/IAssessment";
import ICourse from "../../interfaces/ICourse";
import { useUserStore } from "../../store";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../langStore";

const ModulePanel = ({
  isOpen,
  togglePanel,
  cls,
  setSelectedItem,
  selectedItem,
}: {
  isOpen: boolean;
  cls: IClass | ICourse | null;
  selectedItem: ILiveLink | IRecording | IMaterial | IAssessment | null;
  togglePanel: () => void;
  setSelectedItem: (
    item: ILiveLink | IRecording | IMaterial | IAssessment | null
  ) => void;
}) => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const isArabic = language === "ar";

  const backend = import.meta.env.VITE_BACKEND;
  const { user } = useUserStore();

  const [classModules, setClassModules] = useState<IModule[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [openModuleIndex, setOpenModuleIndex] = useState<number | null>(null);

  const hasFetchedModules = useRef(false);

  const toggleModule = (index: number | null) => {
    setOpenModuleIndex((prev) => (prev === index ? null : index));
  };

  useEffect(() => {
    if (cls && !hasFetchedModules.current) {
      const fetchClassModules = async () => {
        try {
          setLoading(true);

          const params: { [key: string]: string } = {};
          if (cls.type === "class") {
            params.classId = cls._id;
          } else if (cls.type === "course") {
            params.courseId = cls._id;
          }
          params.userId = user!._id!;

          const res = await axios.get(`${backend}/module`, {
            params,
          });
          setClassModules(res.data.payload);
          hasFetchedModules.current = true; // Mark that modules have been fetched
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };

      fetchClassModules();
    }
  }, [backend, cls]);

  const createCertificate = async () => {
    try {
      setSubmitting(true);
      const data: { [key: string]: string | undefined } = {};
      if (cls?.type === "class") {
        data.classId = cls._id;
      } else if (cls?.type === "course") {
        data.courseId = cls._id;
      }
      data.userId = user?._id;
      const res = await axios.post(`${backend}/certification/create`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.data.payload) alert("Certificate Acquired!");
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        alert(error.response?.data.message);
      }
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <span
        className={`${styles.toggleBtn} ${isOpen && styles.toggleBtnOpen} ${
          isArabic ? styles.arabicToggle : ""
        }`}
        onClick={togglePanel}
      >
        {isOpen ? "<" : ">"}
      </span>
      <div
        className={`${styles.wrapper} ${isOpen ? styles.open : styles.closed}`}
      >
        <>
          {loading ? (
            <Loading />
          ) : (
            <>
              {isOpen && (
                <div className={styles.sidePanelContent}>
                  {/* class title  */}
                  <h1 className={styles.title}>
                    {isArabic ? cls?.arabicTitle : cls?.title}
                  </h1>

                  {/* modules list  */}
                  <ol className={styles.modulesList}>
                    {classModules.map((module, index) => {
                      return (
                        <ModuleAccordion
                          key={module._id}
                          module={module}
                          index={index}
                          openModuleIndex={openModuleIndex}
                          toggleModule={toggleModule}
                          setSelectedItem={setSelectedItem}
                          selectedItem={selectedItem}
                        />
                      );
                    })}
                  </ol>
                  {cls?.showCertificate && (
                    <button
                      className={styles.getCertificate}
                      onClick={createCertificate}
                      disabled={submitting}
                    >
                      {t("get-certificate")}
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </>
      </div>
    </>
  );
};

export default ModulePanel;
