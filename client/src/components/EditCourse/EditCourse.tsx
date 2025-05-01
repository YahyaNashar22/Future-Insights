import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
// import { useUserStore } from "../../store";
import ICourse from "../../interfaces/ICourse";
import styles from "./EditCourse.module.css";

const EditCourse = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  //   const { user } = useUserStore();
  const backend = import.meta.env.VITE_BACKEND;

  const [course, setCourse] = useState<ICourse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [showModuleForm, setShowModuleForm] = useState<boolean>(false);
  const [moduleName, setModuleName] = useState<string>("");

  // const [newVideoTitle, setNewVideoTitle] = useState<string>("");
  // const [newVideoFile, setNewVideoFile] = useState<File | null>(null);
  // const [newVideos, setNewVideos] = useState<
  //   { title: string; file: File | null }[]
  // >([]);

  // Fetch course data for editing
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
  }, [slug, backend, navigate]);

  // Handle form submit
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Get course info values
    const form = event.target as HTMLFormElement;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;
    const description = (
      form.elements.namedItem("description") as HTMLTextAreaElement
    ).value;
    const duration = (form.elements.namedItem("duration") as HTMLInputElement)
      .value;
    const price = (form.elements.namedItem("price") as HTMLInputElement).value;
    const discount = (form.elements.namedItem("discount") as HTMLInputElement)
      .value;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("duration", duration);
    formData.append("price", price);
    formData.append("discount", discount);

    const thumbnailInput = form.elements.namedItem(
      "thumbnail"
    ) as HTMLInputElement;
    const thumbnailFile = thumbnailInput?.files?.[0];

    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }

    const demoInput = form.elements.namedItem("demo") as HTMLInputElement;
    const demoFile = demoInput?.files?.[0];

    if (demoFile) {
      formData.append("demo", demoFile);
    }

    // Add video files
    // newVideos.forEach((video, index) => {
    //   formData.append(`videos[${index}].title`, video.title);
    //   // Only append the video file if it's not null
    //   if (video.file) {
    //     formData.append(`videos[${index}].file`, video.file);
    //   }
    // });
    // TODO: ADD CHANGE DEMO
    try {
      setLoading(true);
      const res = await axios.put(
        `${backend}/course/update-course/${slug}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        navigate(`/dashboard`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files ? event.target.files[0] : null;
  //   if (file) {
  //     setNewVideoFile(file);
  //   }
  // };

  // Handle video URL add
  // const handleAddNewVideo = () => {
  //   if (newVideoTitle && newVideoFile) {
  //     setNewVideos([
  //       ...newVideos,
  //       { title: newVideoTitle, file: newVideoFile },
  //     ]);
  //     setNewVideoTitle(""); // Reset the title field
  //     setNewVideoFile(null); // Reset the file field
  //   } else {
  //     alert("Please provide both title and a video file.");
  //   }
  // };

  // Remove video
  // const handleRemoveVideo = (index: number) => {
  //   if (course) {
  //     const updatedContent = course.content.filter((_, i) => i !== index);
  //     setCourse({ ...course, content: updatedContent });
  //   }
  // };

  const handleModuleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${backend}/module/create`, {
        name: moduleName,
        courseId: course?._id,
      });

      if (res.status === 201) {
        alert("Module created successfully!");
        setShowModuleForm(false);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to create module.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.wrapper}>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className={styles.formContainer}>
          <h1 className={styles.title}>Edit Course</h1>
          <form onSubmit={handleSubmit}>
            <label className={styles.labelForm}>
              Title:
              <input
                className={styles.inputForm}
                type="text"
                name="title"
                defaultValue={course?.title || ""}
                required
              />
            </label>

            <label className={styles.labelForm}>
              Description:
              <textarea
                className={styles.textarea}
                name="description"
                defaultValue={course?.description || ""}
                required
              />
            </label>

            <label className={styles.labelForm}>
              Duration:
              <input
                className={styles.inputForm}
                type="text"
                name="duration"
                defaultValue={course?.duration || ""}
                required
              />
            </label>

            <label className={styles.labelForm}>
              Price:
              <input
                className={styles.inputForm}
                type="number"
                name="price"
                defaultValue={course?.price || "0"}
                required
              />
            </label>

            <label className={styles.labelForm}>
              Discount:
              <input
                className={styles.inputForm}
                type="number"
                name="discount"
                defaultValue={course?.discount || "0"}
                min="0"
                max="100"
                step="0.01"
                required
              />
            </label>

            {/* Thumbnail  */}
            <label className={styles.labelForm} htmlFor="thumbnail">
              Course Thumbnail
            </label>
            <input
              className={styles.inputForm}
              type="file"
              name="thumbnail"
              accept="image/*"
            />

            {/* Demo  */}
            <label className={styles.labelForm} htmlFor="demo">
              Course Demo
            </label>
            <input className={styles.inputForm} type="file" name="demo" />

            {/* Add New Video */}
            {/* <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Add New Video</h2>
              <div>
                <label className={styles.labelForm} htmlFor="newVideoTitle">
                  Video Title
                </label>
                <input
                  className={styles.inputForm}
                  type="text"
                  id="newVideoTitle"
                  name="newVideoTitle"
                  value={newVideoTitle}
                  onChange={(e) => setNewVideoTitle(e.target.value)}
                />
              </div>
              <div>
                <label className={styles.labelForm} htmlFor="newVideoFile">
                  Video File
                </label>
                <input
                  className={styles.inputForm}
                  type="file"
                  id="newVideoFile"
                  name="newVideoFile"
                  accept="video/*"
                  onChange={handleFileChange}
                />
              </div>
              <button
                className={styles.editFormBtn}
                type="button"
                onClick={handleAddNewVideo}
              >
                Add Video
              </button>
            </div> */}

            {/* Display added videos */}
            {/* {newVideos.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Added Videos</h2>
                <ul>
                  {newVideos.map((video, index) => (
                    <li key={index}>{video.title}</li>
                  ))}
                </ul>
              </div>
            )} */}

            {/* <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Course Content</h2>
              <ul className={styles.editFormVideosList}>
                {course?.content.map((item, index) => (
                  <li key={index} className={styles.editFormVideoItem}>
                    <span>{item.title}</span>
                    <button
                      className={styles.editFormBtn}
                      type="button"
                      onClick={() => handleRemoveVideo(index)}
                    >
                      Remove Video
                    </button>
                  </li>
                ))}
              </ul>
            </div> */}

            <button
              type="button"
              className={styles.addModuleButton}
              onClick={() => setShowModuleForm(true)}
            >
              Add Module
            </button>

            <button className={styles.editFormBtn} type="submit">
              Update Course
            </button>
          </form>
        </div>
      )}

      {showModuleForm && (
        <div className={styles.moduleFormContainer}>
          <h2>Add New Module</h2>
          <form onSubmit={handleModuleSubmit}>
            <label>
              Module Name:
              <input
                type="text"
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
                required
              />
            </label>
            <button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Module"}
            </button>
            <button type="button">Cancel</button>
          </form>
        </div>
      )}
    </main>
  );
};

export default EditCourse;
