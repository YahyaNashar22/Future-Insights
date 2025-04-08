import { useNavigate, useParams } from "react-router-dom";
import styles from "./CourseDisplay.module.css";
import { useEffect, useState } from "react";
import ICourse from "../../interfaces/ICourse";
import axios, { AxiosError } from "axios";
import Loading from "../../components/Loading/Loading";
import IVideo from "../../interfaces/IVideo";
import icon from "../../assets/icons/course_title.png";
import videoIc from "../../assets/icons/video.png";
import { useUserStore } from "../../store";
import ICertification from "../../interfaces/ICertification";

const CourseDisplay = () => {
  const { slug } = useParams();
  const backend = import.meta.env.VITE_BACKEND;
  const { user } = useUserStore();
  const navigate = useNavigate();

  const [course, setCourse] = useState<ICourse | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<IVideo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [certificationLoader, setCertificationLoader] =
    useState<boolean>(false);
  const [certification, setCertification] = useState<ICertification | null>(
    null
  );

  const [unlockedVideos, setUnlockedVideos] = useState<number[]>([0]); // First video unlocked by default
  const [, setVideoProgress] = useState<Record<number, number>>({});
  const [courseCompleted, setCourseCompleted] = useState<boolean>(false);

  // Handles video selection
  const handleSelectVideo = (video: IVideo, index: number) => {
    if (unlockedVideos.includes(index)) {
      setSelectedVideo(video);
    }
  };

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
  }, [backend, slug, navigate, user]);

  // Handle video progress tracking
  const handleTimeUpdate = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    const videoElement = event.currentTarget;
    setVideoProgress((prevProgress) => ({
      ...prevProgress,
      [selectedVideo?.url || ""]: videoElement.currentTime,
    }));
  };

  // Unlock next video when current one ends
  const handleVideoEnd = async () => {
    const currentIndex = course?.content.findIndex(
      (video) => video.url === selectedVideo?.url
    );
    if (
      currentIndex !== undefined &&
      currentIndex + 1 < (course?.content?.length || 0)
    ) {
      try {
        await axios.post(
          `${backend}/user/unlock-video`,
          {
            courseId: course?._id,
            userId: user?._id,
            videoIndex: currentIndex + 1, // the index of the next video to unlock
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Update the state to reflect the new unlocked video
        setUnlockedVideos((prev) => [...prev, currentIndex + 1]);
      } catch (error) {
        console.error("Failed to unlock video:", error);
      }
    }
  };

  // Unlock certificate if all content are completed
  useEffect(() => {
    if (course && unlockedVideos.length === course.content.length) {
      setCourseCompleted(true);
    }
  }, [course, unlockedVideos]);

  useEffect(() => {
    if (course && user?._id) {
      const fetchUnlockedVideos = async () => {
        try {
          const res = await axios.get(`${backend}/user/get-unlocked-videos`, {
            params: { userId: user?._id, courseId: course?._id },
          });
          setUnlockedVideos(res.data.unlockedVideos);
        } catch (error) {
          console.error("Failed to fetch unlocked videos:", error);
        }
      };
      fetchUnlockedVideos();
    }
  }, [course, user, backend]);

  const removeFileExtension = (filename: string | undefined) => {
    return filename?.split(".").slice(0, -1).join(".") || filename;
  };

  const createCertification = async () => {
    try {
      setCertificationLoader(true);
      const res = await axios.post(
        `${backend}/certification/create`,
        {
          userId: user?._id,
          courseId: course?._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.payload) navigate(`/certification/${res.data.payload.slug}`);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        alert(error.response?.data.message);
      }
    } finally {
      setCertificationLoader(false);
    }
  };

  useEffect(() => {
    if (!user?._id || !course?._id || !courseCompleted) return;
    const getCertification = async () => {
      try {
        const res = await axios.post(
          `${backend}/certification/get-course-certification`,
          {
            userId: user?._id,
            courseId: course?._id,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setCertification(res.data.payload);
      } catch (error) {
        console.log(error);
      }
    };
    getCertification();
  }, [backend, user, course, courseCompleted, navigate, certification]);

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
          {courseCompleted && !certification && (
            <button
              disabled={certificationLoader}
              className={styles.certificationBtn}
              onClick={createCertification}
            >
              Get Certification
            </button>
          )}
          {courseCompleted && certification && (
            <p
              onClick={() => navigate(`/certification/${certification.slug}`)}
              className={styles.certificationBtn}
            >
              Certification Acquired
            </p>
          )}
          {/* Course Information and right panel Container  */}
          <div className={styles.lower}>
            {/* Course Information */}
            <div className={styles.course}>
              <h2 className={styles.videoTitle}>
                {removeFileExtension(selectedVideo?.title)}
              </h2>

              <div className={styles.videoContainer}>
                <video
                  key={selectedVideo?.url} // Force re-render when the video changes
                  className={styles.videoPlayer}
                  controls
                  poster={course?.thumbnail}
                  controlsList="nodownload"
                  disablePictureInPicture
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={handleVideoEnd}
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
                      onClick={() => handleSelectVideo(c, index)}
                      style={{
                        cursor: unlockedVideos.includes(index)
                          ? "pointer"
                          : "not-allowed",
                        opacity: unlockedVideos.includes(index) ? 1 : 0.5,
                      }}
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
                      {removeFileExtension(c.title)}
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
