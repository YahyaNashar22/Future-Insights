import axios, { AxiosError } from "axios";
import IAssessment from "../../interfaces/IAssessment";
import styles from "./AssessmentView.module.css";
import { useState } from "react";
import { useUserStore } from "../../store";

const AssessmentView = ({ selectedItem }: { selectedItem: IAssessment }) => {
  const backend = import.meta.env.VITE_BACKEND;
  const { user } = useUserStore();

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

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

    if (!user?._id || !selectedItem?._id) return;

    const formData = new FormData();
    formData.append("answer", file);
    formData.append("userId", user._id);
    formData.append("assessmentId", selectedItem._id);

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

  const getFileExtension = (url?: string) => {
    return url?.split(".").pop()?.toLowerCase() || "";
  };

  const renderPreview = () => {
    const backend = import.meta.env.VITE_BACKEND;

    const ext = getFileExtension(selectedItem.scope);

    if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext)) {
      return (
        <img
          src={`${backend}/${selectedItem.scope}`}
          alt="Material Preview"
          className={styles.previewImage}
        />
      );
    }

    if (ext === "pdf") {
      return (
        <iframe
          src={`${backend}/${selectedItem.scope}`}
          title="PDF Preview"
          className={styles.previewFrame}
        />
      );
    }

    // TODO: CHECK IF THIS WORKS ON HTTPS
    // if (["doc", "docx", "ppt", "pptx", "xls", "xlsx"].includes(ext)) {
    //   return (
    //     <iframe
    //       src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
    //         selectedItem.scope
    //       )}`}
    //       title="Office Preview"
    //       className={styles.previewFrame}
    //     />
    //   );
    // }

    return (
      <p className={styles.noPreview}>
        Preview not available for this file type.
      </p>
    );
  };
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>
        📝 {selectedItem.type === "assessment" ? "Assessment" : "Assignment"}
      </h2>
      <p className={styles.name}>
        <strong>{selectedItem.title}</strong>
      </p>
      <p className={styles.description}>{selectedItem.description}</p>

      <a href={selectedItem.scope} download className={styles.content}>
        Download File
      </a>
      <div className={styles.preview}>{renderPreview()}</div>

      <div className={styles.btns}>
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

       { file && <button
          type="button"
          className={styles.upload}
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload Answer"}
        </button>}
      </div>

      {/* Show selected file */}
      {file && (
        <p className={styles.uploadedFile}>Selected file: {file.name}</p>
      )}
    </div>
  );
};

export default AssessmentView;
