import { useNavigate, useParams } from "react-router-dom";
import styles from "./CourseDisplay.module.css";
import { useEffect, useState } from "react";
import ICourse from "../../interfaces/ICourse";
import axios from "axios";
import Loading from "../../components/Loading/Loading";
import icon from "../../assets/icons/course_title.png";
import { useUserStore } from "../../store";
import ModulePanel from "../../components/ModulePanel/ModulePanel";
import IAssessment from "../../interfaces/IAssessment";
import IMaterial from "../../interfaces/IMaterial";
import IRecording from "../../interfaces/IRecording";
import ILiveLink from "../../interfaces/ILiveLink";

const CourseDisplay = () => {
  const { slug } = useParams();
  const backend = import.meta.env.VITE_BACKEND;
  const { user } = useUserStore();
  const navigate = useNavigate();

  const [course, setCourse] = useState<ICourse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${backend}/course/get-course/${slug}`);

        if (
          !res.data.payload ||
          (!res.data.payload.enrolledUsers.some(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (u: any) => u._id === user?._id
          ) &&
            user?._id !== res.data.payload.teacher)
        )
          navigate("*");

        setCourse(res.data.payload);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [backend, slug, navigate, user]);

  const removeFileExtension = (filename: string | undefined) => {
    return filename?.split(".").slice(0, -1).join(".") || filename;
  };

  const [isOpen, setIsOpen] = useState<boolean>(true);

  const [selectedItem, setSelectedItem] = useState<
    ILiveLink | IRecording | IMaterial | IAssessment | null
  >(null);

  const togglePanel = () => {
    setIsOpen((prev) => !prev);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isRecording = (item: any): item is IRecording =>
    item?._id && item?.name && item?.link && !item?.startsAt;

  return (
    <main className={styles.wrapper}>
      {isLoading ? (
        <Loading />
      ) : (
        <div className={styles.courseContainer}>
          <ModulePanel
            isOpen={isOpen}
            togglePanel={togglePanel}
            cls={course}
            setSelectedItem={setSelectedItem}
            selectedItem={selectedItem}
          />
          <div className={styles.titleBanner}>
            {/* Course Title  */}
            <h1 className={styles.title}>
              <span>
                <img
                  className={styles.courseLeading}
                  src={icon}
                  alt="course leading"
                  loading="lazy"
                />
              </span>
              {course?.title}
            </h1>
          </div>

          {/* Course Information and right panel Container  */}
          <div className={styles.lower}>
            {/* Course Information */}
            <div className={styles.course}>
              {isRecording(selectedItem) && (
                <h2 className={styles.videoTitle}>
                  {removeFileExtension(selectedItem?.name)}
                </h2>
              )}

              <div className={styles.videoContainer}>
                {isRecording(selectedItem) && (
                  <video
                    key={selectedItem?.link} // Force re-render when the video changes
                    className={styles.videoPlayer}
                    controls
                    poster={course?.thumbnail}
                    controlsList="nodownload"
                    disablePictureInPicture
                  >
                    {selectedItem?.link && (
                      <source
                        src={`${backend}/${selectedItem.link}`}
                        type="video/mp4"
                      />
                    )}
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>

              <div className={styles.courseDescriptionContainer}>
                <p className={styles.descriptionTitle}>Description</p>
                <p className={styles.courseDescription}>
                  {course?.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default CourseDisplay;
