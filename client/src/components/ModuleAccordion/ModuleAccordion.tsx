import { useEffect, useState } from "react";
import IModule from "../../interfaces/IModule";
import styles from "./ModuleAccordion.module.css";
import ILiveLink from "../../interfaces/ILiveLink";
import axios from "axios";

const ModuleAccordion = ({
  module,
  index,
  toggleModule,
  openModuleIndex,
}: {
  module: IModule;
  index: number;
  openModuleIndex: number | null;
  toggleModule: (ind: number) => void;
}) => {
  const backend = import.meta.env.VITE_BACKEND;

  const [loading, setLoading] = useState<boolean>(false);
  const [liveLink, setLiveLink] = useState<ILiveLink | null>(null);

  useEffect(() => {
    const fetchLiveLink = async () => {
      try {
        setLoading(true);
        const res = await axios.post(
          `${backend}/live-link/get-module-link`,
          {
            moduleId: module._id,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setLiveLink(res.data.payload);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveLink();
  }, [module, backend]);
  return (
    <li key={module._id} className={styles.moduleAccordion}>
      <div
        className={styles.accordionHeader}
        onClick={() => toggleModule(index)}
      >
        <span>
          {index + 1}. {module.name}
        </span>
        <span className={styles.icon}>
          {openModuleIndex === index ? "-" : "+"}
        </span>
      </div>
      {openModuleIndex === index && (
        <div
          className={`${styles.accordionContentWrapper} ${
            openModuleIndex === index ? styles.expanded : ""
          }`}
        >
          <ul className={styles.accordionContent}>
            {loading ? (
              <p className={styles.loading}>Getting your content...</p>
            ) : (
              // live link section
              liveLink && (
                <li className={styles.accordionContentItem}>{liveLink.name}</li>
              )
            )}
          </ul>
        </div>
      )}
    </li>
  );
};

export default ModuleAccordion;
