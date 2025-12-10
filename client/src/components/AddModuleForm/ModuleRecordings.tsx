import { useEffect, useState } from "react";
import styles from "./AddContent.module.css";
import axios from "axios";

interface Recording {
  _id: string;
  name: string;
  link: string;
  moduleId: string;
}

const ModuleRecordings = ({
  // handleSubmitRecording,
  moduleId,
  submitting,
}: {
  // handleSubmitRecording: (event: React.FormEvent) => Promise<void>;
  moduleId: string | undefined;
  submitting: boolean;
}) => {
  const backend = import.meta.env.VITE_BACKEND;

  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const fetchRecordings = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${backend}/recording/get-module-recordings`,
        { moduleId }
      );
      setRecordings(res.data.payload);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this recording?"
    );
    if (!confirm) return;

    try {
      await axios.delete(`${backend}/recording/delete/${id}`);
      setRecordings((prev) => prev.filter((r) => r._id !== id));
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    if (moduleId) {
      formData.append("moduleId", moduleId);
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      await axios.post(`${backend}/recording/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(percent);
        },
      });

      // Call your existing recording handler if needed
      // await handleSubmitRecording(e);

      await fetchRecordings();
    } catch (error) {
      console.log(error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  useEffect(() => {
    if (moduleId) fetchRecordings();
  }, [backend, moduleId]);

  return (
    <div className={styles.sectionContainer}>
      <form className={styles.contentForm} onSubmit={onSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          required
          disabled={uploading}
        />
        <input type="file" name="link" required disabled={uploading} />

        <button type="submit" disabled={uploading || submitting}>
          {uploading ? "Uploading..." : "Submit Recording"}
        </button>

        {/* Progress Bar */}
        {uploading && (
          <div className={styles.progressContainer}>
            <progress value={uploadProgress} max={100} />
            <span>{uploadProgress}%</span>
          </div>
        )}
      </form>

      <div className={styles.previousContent}>
        <h3 className={styles.previousContentHeader}>Recordings</h3>
        {loading && <p>Loading...</p>}
        {recordings.length === 0 && !loading && <p>No recordings found.</p>}
        <ul className={styles.materialsList}>
          {recordings.map((rec) => (
            <li key={rec._id} className={styles.materialItem}>
              <span>{rec.name}</span>
              <button
                className={styles.deleteButton}
                onClick={() => handleDelete(rec._id)}
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ModuleRecordings;
