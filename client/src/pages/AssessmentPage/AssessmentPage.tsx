import { Link, useParams } from "react-router-dom";
import styles from "./AssessmentPage.module.css";
import { useEffect, useState } from "react";
import { useUserStore } from "../../store";
import IAssessment from "../../interfaces/IAssessment";
import axios, { AxiosError } from "axios";
import Loading from "../../components/Loading/Loading";

// ! PAGE DEPRECATED

const AssessmentPage = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const { slug } = useParams();
  const { user } = useUserStore();

  const [loading, setLoading] = useState<boolean>(false);
  const [assessment, setAssessment] = useState<IAssessment | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${backend}/assessment/get-one/${slug}`);
        setAssessment(res.data.payload);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [backend, slug]);

  const handleScope = () => {
    if (!assessment?.scope) return;

    const fileUrl = `${backend}/${assessment.scope}`;

    const extension = assessment.scope.split(".").pop()?.toLowerCase();
    const previewableExtensions = ["jpg", "jpeg", "png", "gif", "pdf", "txt"];

    // Check if extension is undefined
    if (!extension) {
      console.error("File extension could not be determined.");
      return;
    }

    if (previewableExtensions.includes(extension)) {
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    } else {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = assessment.scope.split("/").pop() || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload");
      return;
    }

    if (!user?._id || !assessment?._id) return;

    const formData = new FormData();
    formData.append("answer", file);
    formData.append("userId", user._id);
    formData.append("assessmentId", assessment._id);

    try {
      setUploading(true);
      const res = await axios.post(
        `${backend}/answer/upload-answer`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Answer uploaded successfully!");
      console.log(res.data);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        alert(error.response?.data.message);
      } else alert("Error uploading answer");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className={styles.wrapper}>
      {loading ? (
        <Loading />
      ) : (
        <div className={styles.container}>
          <h1 className={styles.title}>
            <span className={styles.type}>{assessment?.type}</span> -{" "}
            {assessment?.title}
          </h1>
          <h2 className={styles.classTitle}>
            Class: {assessment?.classId.title}
          </h2>
          <p className={styles.description}>{assessment?.description}</p>
          {assessment?.scope && (
            <p className={styles.scope} onClick={handleScope}>
              View Scope
            </p>
          )}
          {/* File input */}
          <input
            type="file"
            id="file-input"
            className={styles.fileInput}
            onChange={handleFileChange}
          />

          {/* Label styled as a button */}
          <label htmlFor="file-input" className={styles.fileInputLabel}>
            Choose File
          </label>

          {/* Show selected file */}
          {file && (
            <p className={styles.uploadedFile}>Selected file: {file.name}</p>
          )}
          <div className={styles.btns}>
            <Link
              to={`/course-catalogue/class/${assessment?.classId.slug}`}
              className={styles.back}
            >
              Back to class
            </Link>

            <button
              type="button"
              className={styles.upload}
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload Answer"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default AssessmentPage;
