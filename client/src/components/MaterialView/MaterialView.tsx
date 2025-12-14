import { useTranslation } from "react-i18next";
import IMaterial from "../../interfaces/IMaterial";
import styles from "./MaterialView.module.css";

const MaterialView = ({ selectedItem }: { selectedItem: IMaterial }) => {
  const { t } = useTranslation();

  const getFileExtension = (url: string) => {
    return url.split(".").pop()?.toLowerCase() || "";
  };

  const isPdf = getFileExtension(selectedItem.content) === "pdf";

  const renderPreview = () => {
    const backend = import.meta.env.VITE_BACKEND;

    const ext = getFileExtension(selectedItem.content);

    if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext)) {
      return (
        <img
          src={`${backend}/${selectedItem.content}`}
          alt="Material Preview"
          className={styles.previewImage}
        />
      );
    }

    if (ext === "pdf") {
      return (
        <iframe
          src={`${backend}/${selectedItem.content}`}
          title="PDF Preview"
          className={styles.previewFrame}
        />
      );
    }

    return <p className={styles.noPreview}>{t("preview-not-available")}</p>;
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>📘 {t("material-title")}</h2>
      <p className={styles.name}>{selectedItem.name}</p>
      {!isPdf && (
        <a
          href={`${import.meta.env.VITE_BACKEND}/${selectedItem.content}`}
          download
          className={styles.content}
        >
          {t("download")}
        </a>
      )}

      <div className={styles.preview}>{renderPreview()}</div>
    </div>
  );
};

export default MaterialView;
