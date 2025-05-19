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
  handleSubmitRecording,
  moduleId,
  submitting,
}: {
  handleSubmitRecording: (event: React.FormEvent) => Promise<void>;
  moduleId: string | undefined;
  submitting: boolean;
}) => {
  const backend = import.meta.env.VITE_BACKEND;

  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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

  useEffect(() => {
    if (moduleId) fetchRecordings();
  }, [backend, moduleId]);

  return (
    <div className={styles.sectionContainer}>
      <form className={styles.contentForm} onSubmit={handleSubmitRecording}>
        <input type="text" name="name" placeholder="Name" required />
        <input type="file" name="link" required />
        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting" : "Submit Recording"}
        </button>
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
