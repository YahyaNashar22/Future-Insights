import { useEffect, useState } from "react";
import IModule from "../../interfaces/IModule";
import styles from "./ModuleAccordion.module.css";
import ILiveLink from "../../interfaces/ILiveLink";
import axios from "axios";
import IRecording from "../../interfaces/IRecording";
import IMaterial from "../../interfaces/IMaterial";
import IAssessment from "../../interfaces/IAssessment";

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
  const [recordings, setRecordings] = useState<IRecording[]>([]);
  const [materials, setMaterials] = useState<IMaterial[]>([]);
  const [assessments, setAssessments] = useState<IAssessment[]>([]);
  const [assignments, setAssignments] = useState<IAssessment[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setSelectedItemId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    // fetch live link section
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

    // fetch recordings section
    const fetchRecordings = async () => {
      try {
        setLoading(true);
        const res = await axios.post(
          `${backend}/recording/get-module-recordings`,
          {
            moduleId: module._id,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setRecordings(res.data.payload);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    // fetch materials section
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        const res = await axios.post(
          `${backend}/material/get-module-materials`,
          {
            moduleId: module._id,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setMaterials(res.data.payload);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    // fetch assessments section
    const fetchAssessments = async () => {
      try {
        const res = await axios.get(
          `${backend}/assessment/${module._id}/assessments`
        );
        setAssessments(res.data.payload);
      } catch (error) {
        console.log(error);
      }
    };

    // fetch assignments section
    const fetchAssignments = async () => {
      try {
        const res = await axios.get(
          `${backend}/assessment/${module._id}/assignments`
        );
        setAssignments(res.data.payload);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAssessments();
    fetchAssignments();

    fetchLiveLink();
    fetchRecordings();
    fetchMaterials();
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
              <>
                {
                  // live link section

                  liveLink && (
                    <li
                      className={`${styles.accordionContentItem} ${
                        selectedItemId === liveLink._id ? styles.selected : ""
                      }`}
                      onClick={() => handleSelect(liveLink._id)}
                    >
                      {liveLink.name}
                    </li>
                  )
                }
                {
                  // recordings section
                  recordings.length > 0 &&
                    recordings.map((recording) => {
                      return (
                        <li
                          key={recording._id}
                          className={`${styles.accordionContentItem} ${
                            selectedItemId === recording._id
                              ? styles.selected
                              : ""
                          }`}
                          onClick={() => handleSelect(recording._id)}
                        >
                          {recording.name}
                        </li>
                      );
                    })
                }

                {
                  // materials section
                  materials.length > 0 &&
                    materials.map((material) => {
                      return (
                        <li
                          key={material._id}
                          className={`${styles.accordionContentItem} ${
                            selectedItemId === material._id
                              ? styles.selected
                              : ""
                          }`}
                          onClick={() => handleSelect(material._id)}
                        >
                          {material.name}
                        </li>
                      );
                    })
                }

                {
                  // assessments section
                  assessments.length > 0 &&
                    assessments.map((assessment) => {
                      return (
                        <li
                          key={assessment._id}
                          className={`${styles.accordionContentItem} ${
                            selectedItemId === assessment._id
                              ? styles.selected
                              : ""
                          }`}
                          onClick={() => handleSelect(assessment._id)}
                        >
                          {assessment.title}
                        </li>
                      );
                    })
                }

                {
                  // assignments section
                  assignments.length > 0 &&
                    assignments.map((assignment) => {
                      return (
                        <li
                          key={assignment._id}
                          className={`${styles.accordionContentItem} ${
                            selectedItemId === assignment._id
                              ? styles.selected
                              : ""
                          }`}
                          onClick={() => handleSelect(assignment._id)}
                        >
                          {assignment.title}
                        </li>
                      );
                    })
                }
              </>
            )}
          </ul>
        </div>
      )}
    </li>
  );
};

export default ModuleAccordion;
