import { useEffect, useState } from "react";
import styles from "./AddContent.module.css";
import axios from "axios";

interface Material {
  _id: string;
  name: string;
  content: File;
  moduleId: string;
}

const ModuleMaterial = ({
  handleSubmitMaterial,
  moduleId,
  submitting,
}: {
  handleSubmitMaterial: (event: React.FormEvent) => Promise<void>;
  moduleId: string | undefined;
  submitting: boolean;
}) => {
  const backend = import.meta.env.VITE_BACKEND;

  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${backend}/material/get-module-materials`, {
        moduleId,
      });
      setMaterials(res.data.payload);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this material?"
    );
    if (!confirm) return;

    try {
      await axios.delete(`${backend}/material/delete/${id}`);
      setMaterials((prev) => prev.filter((r) => r._id !== id));
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  useEffect(() => {
    if (moduleId) fetchMaterials();
  }, [backend, moduleId]);

  return (
    <div className={styles.sectionContainer}>
      <form className={styles.contentForm} onSubmit={handleSubmitMaterial}>
        <input type="text" name="name" placeholder="Name" required />
        <input type="file" name="content" required />
        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting" : "Submit Material"}
        </button>
      </form>

      <div className={styles.previousContent}>
        <h3 className={styles.previousContentHeader}>Materials</h3>
        {loading && <p>Loading...</p>}
        {materials.length === 0 && !loading && <p>No materials found.</p>}
        <ul className={styles.materialsList}>
          {materials.map((rec) => (
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

export default ModuleMaterial;
