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
  const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

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

  // const onSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   const form = e.target as HTMLFormElement;
  //   const formData = new FormData(form);

  //   if (moduleId) {
  //     formData.append("moduleId", moduleId);
  //   }

  //   try {
  //     setUploading(true);
  //     setUploadProgress(0);

  //     await axios.post(`${backend}/recording/create`, formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //       onUploadProgress: (progressEvent) => {
  //         const percent = progressEvent.total
  //           ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
  //           : 0;
  //         setUploadProgress(percent);
  //       },
  //     });

  //     await fetchRecordings();
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setUploading(false);
  //     setUploadProgress(0);
  //   }
  // };

  useEffect(() => {
    if (moduleId) fetchRecordings();
  }, [backend, moduleId]);

  // const uploadFile = async (file: File) => {
  //   setUploading(true);
  //   try {
  //     const initRes = await axios.post(`${backend}/recording/init-upload`, {
  //       fileName: file.name,
  //       fileSize: file.size,
  //       chunkSize: CHUNK_SIZE,
  //     });

  //     const { uploadId } = initRes.data;

  //     const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

  //     for (let i = 0; i < totalChunks; i++) {
  //       const start = i * CHUNK_SIZE;
  //       const end = Math.min(file.size, start + CHUNK_SIZE);
  //       const chunk = file.slice(start, end);

  //       const formData = new FormData();
  //       formData.append("chunk", chunk);
  //       formData.append("uploadId", uploadId);
  //       formData.append("chunkIndex", i.toString());

  //       await axios.post(`${backend}/recording/upload-chunk`, formData, {
  //         headers: { "Content-Type": "multipart/form-data" },
  //       });

  //       setUploadProgress(Math.round(((i + 1) / totalChunks) * 100));
  //     }

  //     await axios.post(`${backend}/recording/complete-upload`, {
  //       uploadId,
  //       name,
  //       moduleId,
  //     });

  //     await fetchRecordings();
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setUploading(false);
  //     setUploadProgress(0);
  //   }
  // };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!moduleId) return;

    const form = e.currentTarget;
    const nameInput = form.elements.namedItem("name") as HTMLInputElement;
    const fileInput = form.elements.namedItem("link") as HTMLInputElement;

    const file = fileInput.files?.[0];
    const name = nameInput.value;

    if (!file) return;

    try {
      setUploading(true);
      setUploadProgress(0);

      // 1️⃣ INIT UPLOAD
      const initRes = await axios.post(`${backend}/recording/init-upload`, {
        fileName: file.name,
        fileSize: file.size,
        chunkSize: CHUNK_SIZE,
      });

      const { uploadId, uploadedChunks } = initRes.data;

      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

      // 2️⃣ UPLOAD CHUNKS
      for (let i = 0; i < totalChunks; i++) {
        if (uploadedChunks.includes(i)) continue;

        const start = i * CHUNK_SIZE;
        const end = Math.min(file.size, start + CHUNK_SIZE);
        const chunk = file.slice(start, end);

        const chunkForm = new FormData();
        chunkForm.append("chunk", chunk);
        chunkForm.append("uploadId", uploadId);
        chunkForm.append("chunkIndex", i.toString());

        await axios.post(`${backend}/recording/upload-chunk`, chunkForm);

        setUploadProgress(Math.round(((i + 1) / totalChunks) * 100));
      }

      // 3️⃣ COMPLETE UPLOAD
      await axios.post(`${backend}/recording/complete-upload`, {
        uploadId,
        name,
        moduleId,
      });

      await fetchRecordings();
      form.reset();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

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
