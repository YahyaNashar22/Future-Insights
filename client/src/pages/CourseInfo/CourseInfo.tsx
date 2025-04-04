import { useNavigate, useParams } from "react-router-dom";
import styles from "./CourseInfo.module.css";
import { useUserStore } from "../../store";
import { useEffect, useState } from "react";
import ICourse from "../../interfaces/ICourse";
import axios from "axios";
import Loading from "../../components/Loading/Loading";

const CourseInfo = () => {
  const { slug } = useParams();
  const { user } = useUserStore();
  const navigate = useNavigate();
  const backend = import.meta.env.VITE_BACKEND;

  const [course, setCourse] = useState<ICourse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${backend}/course/get-course/${slug}`);

        if (!res.data.payload) {
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

  // Handle video content click to show video player
  const handleContentClick = (url: string) => {
    setVideoUrl(url); // Set the selected video's URL
  };

  return (
    <main className={styles.wrapper}>
      {loading ? (
        <Loading />
      ) : (
        <div className={styles.courseContainer}>
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
              <p className={styles.courseDescription}>{course?.description}</p>
              <div className={styles.courseDetails}>
                <span className={styles.coursePrice}>${course?.price}</span>
                {course && course.discount > 0 && (
                  <span className={styles.courseDiscount}>
                    {course?.discount}% off
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
                <ul>
                  {course?.content.map((item, index) => (
                    <li key={index}>
                      <button
                        className={styles.contentItem}
                        onClick={() => handleContentClick(item.url)} // Click to play the video
                      >
                        {item.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
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
              <ul className={styles.enrolledList}>
                {course && course?.enrolledUsers.length > 0 ? (
                  course.enrolledUsers.map((student) => (
                    <li key={student.email} className={styles.enrolledStudent}>
                      <span className={styles.studentEmail}>
                        {student.email}
                      </span>
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
        </div>
      )}
    </main>
  );
};

export default CourseInfo;
