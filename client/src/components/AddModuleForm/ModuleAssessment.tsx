import { useEffect, useState } from "react";
import styles from "./AddContent.module.css";
import axios from "axios";

interface Assessment {
  _id: string;
  title: string;
  moduleId: string;
}

const ModuleAssessment = ({
  handleSubmitAssessment,
  moduleId,
}: {
  handleSubmitAssessment: (event: React.FormEvent) => Promise<void>;
  moduleId: string | undefined;
}) => {
  const backend = import.meta.env.VITE_BACKEND;

  const [assessments, setAssessments] = useState<Assessment[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const res1 = await axios.get(
        `${backend}/assessment/${moduleId}/assessments`
      );

      const res2 = await axios.get(
        `${backend}/assessment/${moduleId}/assignments`
      );

      const combined = [...res1.data.payload, ...res2.data.payload];
      setAssessments(combined);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this assessment?"
    );
    if (!confirm) return;

    try {
      await axios.delete(`${backend}/assessment/delete/${id}`);
      setAssessments((prev) =>
        prev.filter((item) => item._id !== id && item._id !== id)
      );
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  useEffect(() => {
    if (moduleId) fetchAssessments();
  }, [backend, moduleId]);

  return (
    <div className={styles.sectionContainer}>
      <form className={styles.contentForm} onSubmit={handleSubmitAssessment}>
        <input type="text" name="title" placeholder="Title" required />
        <textarea name="description" placeholder="Description" required />
        <select name="type" required className={styles.formInput}>
          <option value="">Select Assessment Type</option>
          <option value="assessment">Assessment</option>
          <option value="assignment">Assignment</option>
        </select>
        <input type="file" name="scope" />
        <button type="submit">Submit Assessment</button>
      </form>

      <div className={styles.previousContent}>
        <h3 className={styles.previousContentHeader}>Assessments</h3>
        {loading && <p>Loading...</p>}
        {assessments.length === 0 && !loading && <p>No assessments found.</p>}
        <ul className={styles.materialsList}>
          {assessments.map((rec) => (
            <li key={rec._id} className={styles.materialItem}>
              <span>{rec.title}</span>
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

export default ModuleAssessment;
