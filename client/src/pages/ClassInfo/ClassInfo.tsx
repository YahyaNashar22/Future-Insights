import { useNavigate, useParams } from "react-router-dom";
import styles from "./ClassInfo.module.css";
import { useUserStore } from "../../store";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../components/Loading/Loading";
import IClass from "../../interfaces/IClass";
import IModule from "../../interfaces/IModule";
import ModuleAccordion from "../../components/ModuleAccordion/ModuleAccordion";
import IAssessment from "../../interfaces/IAssessment";
import IMaterial from "../../interfaces/IMaterial";
import IRecording from "../../interfaces/IRecording";
import ILiveLink from "../../interfaces/ILiveLink";
import ClassContent from "../../components/ClassContent/ClassContent";
import EditClass from "../../components/EditClass/EditClass";
import { parseBullets } from "../../utils/ParseList";

const ClassInfo = () => {
  const { slug } = useParams();
  const { user } = useUserStore();
  const navigate = useNavigate();
  const backend = import.meta.env.VITE_BACKEND;

  const [course, setCourse] = useState<IClass | null>(null);
  const [classModules, setClassModules] = useState<IModule[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [removingUser, setRemovingUser] = useState<boolean>(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [openModuleIndex, setOpenModuleIndex] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<
    ILiveLink | IRecording | IMaterial | IAssessment | null
  >(null);

  const [studentSearch, setStudentSearch] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${backend}/class/get-class/${slug}`);

        if (!res.data.payload || res.data.payload.teacher._id !== user?._id) {
          navigate("*");
        }

        setCourse(res.data.payload);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [user, slug, backend, navigate]);

  useEffect(() => {
    if (course) {
      const fetchClassModules = async () => {
        try {
          setLoading(true);
          const res = await axios.get(`${backend}/module`, {
            params: {
              classId: course._id,
              userId: user?._id,
            },
          });
          setClassModules(res.data.payload);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };

      fetchClassModules();
    }
  }, [backend, course]);

  const toggleModule = (index: number | null) => {
    setOpenModuleIndex((prev) => (prev === index ? null : index));
  };

  // Handle video content click to show video player
  const handleContentClick = (url: string) => {
    setVideoUrl(url); // Set the selected video's URL
  };

  const removeStudentFromClass = async (userId: string) => {
    try {
      setRemovingUser(true);
      const res = await axios.patch(
        `${backend}/class/remove-student-from-class`,
        {
          userId: userId,
          classId: course?._id,
        }
      );

      if (res.status === 200) {
        // UPDATE UI IMMEDIATELY
        setCourse((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            enrolledUsers: prev.enrolledUsers.filter(
              (u) => typeof u === "string" || u._id !== userId
            ),
          };
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setRemovingUser(false);
    }
  };

  return (
    <main className={styles.wrapper}>
      {loading ? (
        <Loading />
      ) : (
        <div className={styles.courseContainer}>
          <button
            className={styles.backButton}
            onClick={() => navigate("/dashboard")}
          >
            ← Back
          </button>

          {!editMode && (
            <div className={styles.courseContainer}>
              <div className={styles.courseThumbnail}>
                <img
                  src={`${backend}/${course?.thumbnail}`}
                  alt={course?.title}
                  className={styles.thumbnailImage}
                />
              </div>
              <div className={styles.courseInfo}>
                <h1 className={styles.courseTitle}>{course?.title}</h1>
                {course?.description && (
                  <div className={styles.courseDescription}>
                    {parseBullets(course.description)}
                  </div>
                )}
                <div className={styles.courseDetails}>
                  <span className={styles.coursePrice}>
                    AED {course?.price?.toFixed(2)}
                  </span>
                  {course && course.discount > 0 && (
                    <span className={styles.courseDiscount}>
                      {course?.discount}% off
                    </span>
                  )}

                  {course && course.discount > 0 && (
                    <span className={styles.coursePrice}>
                      AED {course?.finalPrice?.toFixed(2)} ( After Discount )
                    </span>
                  )}
                  {course?.duration && (
                    <span className={styles.courseDuration}>
                      {course?.duration}
                    </span>
                  )}
                </div>
                <div className={styles.courseContent}>
                  <h2 className={styles.contentTitle}>Course Content:</h2>
                  <ol>
                    {classModules.map((module, index) => (
                      <ModuleAccordion
                        key={module._id}
                        module={module}
                        index={index}
                        openModuleIndex={openModuleIndex}
                        toggleModule={toggleModule}
                        setSelectedItem={setSelectedItem}
                        selectedItem={selectedItem}
                      />
                    ))}
                  </ol>
                </div>

                <ClassContent selectedItem={selectedItem} cls={course} />
                {/* Add any additional information such as demo or other fields here */}
                {course?.demo && (
                  <div className={styles.courseDemo}>
                    <button
                      className={styles.contentItem}
                      onClick={() => handleContentClick(course.demo!)} // Click to play the video
                    >
                      View Demo
                    </button>
                  </div>
                )}
                <h2 className={styles.enrolledTitle}>Enrolled Students</h2>
                <input
                  type="text"
                  placeholder="Search by email..."
                  className={styles.searchInput}
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                />

                <ul className={styles.enrolledList}>
                  {course && course.enrolledUsers.length > 0 ? (
                    [...course.enrolledUsers]
                      .filter((student) => {
                        if (typeof student === "string") return false;
                        if (!studentSearch.trim()) return true;
                        return student.email
                          ?.toLowerCase()
                          .includes(studentSearch.toLowerCase().trim());
                      })
                      .sort((a, b) => {
                        const emailA =
                          typeof a === "string"
                            ? ""
                            : a.email?.toLowerCase() ?? "";
                        const emailB =
                          typeof b === "string"
                            ? ""
                            : b.email?.toLowerCase() ?? "";
                        return emailA.localeCompare(emailB);
                      })
                      .map((student, index) => (
                        <li key={index} className={styles.enrolledStudent}>
                          <span className={styles.studentEmail}>
                            {typeof student !== "string" && student.email}
                          </span>
                          {!removingUser && (
                            <span
                              className={styles.removeUserBtn}
                              onClick={() => {
                                if (removingUser) return;
                                if (typeof student !== "string")
                                  removeStudentFromClass(student._id);
                              }}
                            >
                              X
                            </span>
                          )}
                        </li>
                      ))
                  ) : (
                    <p>No students enrolled yet.</p>
                  )}
                </ul>

                {/* Display the video player if a video URL is selected */}
                {videoUrl && (
                  <div className={styles.videoPlayer}>
                    <video
                      controls
                      width="100%"
                      height="auto"
                      src={`${backend}/${videoUrl}`}
                      className={styles.video}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
              </div>
            </div>
          )}

          {editMode && <EditClass />}
          {!editMode && (
            <button
              className={styles.editButton}
              onClick={() => setEditMode(true)}
            >
              ✏️ Edit Class
            </button>
          )}
          {editMode && (
            <button
              className={styles.editButton}
              onClick={() => setEditMode(false)}
            >
              ✏️ Cancel
            </button>
          )}
        </div>
      )}
    </main>
  );
};

export default ClassInfo;
