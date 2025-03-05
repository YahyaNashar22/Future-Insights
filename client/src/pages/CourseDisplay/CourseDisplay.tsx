import { useParams } from "react-router-dom";
import styles from "./CourseDisplay.module.css";
import { useEffect, useState } from "react";
import ICourse from "../../interfaces/ICourse";
import axios from "axios";
import Loading from "../../components/Loading/Loading";
import IVideo from "../../interfaces/IVideo";
import icon from "../../assets/icons/course_title.png";
import videoIc from "../../assets/icons/video.png";

const CourseDisplay = () => {
  const { slug } = useParams();
  const backend = import.meta.env.VITE_BACKEND;

  const [course, setCourse] = useState<ICourse | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<IVideo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSelectVideo = (video: IVideo) => {
    setSelectedVideo(video);
  };

  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${backend}/course/get-course/${slug}`);

        setCourse(res.data.payload);

        // Set the first video as the default selected one
        if (res.data.payload?.content?.length > 0) {
          setSelectedVideo(res.data.payload.content[0]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [backend, slug]);
  return (
    <main className={styles.wrapper}>
      {isLoading ? (
        <Loading />
      ) : (
        <div className={styles.courseContainer}>
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
              <h2 className={styles.videoTitle}>{selectedVideo?.title}</h2>

              <div className={styles.videoContainer}>
                <video
                  key={selectedVideo?.url} // Force re-render when the video changes
                  className={styles.videoPlayer}
                  controls
                  poster={course?.thumbnail}
                  controlsList="nodownload"
                  disablePictureInPicture
                >
                  {selectedVideo?.url && (
                    <source
                      src={`${backend}/${selectedVideo.url}`}
                      type="video/mp4"
                    />
                  )}
                  Your browser does not support the video tag.
                </video>
              </div>

              <div className={styles.courseDescriptionContainer}>
                <p className={styles.descriptionTitle}>Description</p>
                <p className={styles.courseDescription}>
                  {course?.description}
                </p>
              </div>
            </div>

            {/* Right Panel */}
            <div className={styles.playlist}>
              <p className={styles.playlistTitle}>Course Content</p>
              <ul className={styles.playlistList}>
                {course?.content.map((c, index) => {
                  return (
                    <li
                      key={index}
                      className={styles.playlistElement}
                      onClick={() => handleSelectVideo(c)}
                    >
                      <span className={styles.playlistIc}>
                        <img
                          className={styles.videoLeading}
                          src={videoIc}
                          alt="video leading"
                          loading="lazy"
                          width={16}
                          height={16}
                        />
                      </span>
                      {c.title}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default CourseDisplay;
