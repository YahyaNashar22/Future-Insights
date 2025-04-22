import IMaterial from "../../interfaces/IMaterial";
import styles from "./MaterialView.module.css";

const MaterialView = ({ selectedItem }: { selectedItem: IMaterial }) => {
  const getFileExtension = (url: string) => {
    return url.split(".").pop()?.toLowerCase() || "";
  };

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

    // if (["doc", "docx", "ppt", "pptx", "xls", "xlsx"].includes(ext)) {
    //   return (
    //     <iframe
    //       src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
    //         selectedItem.content
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
      <h2 className={styles.title}>📘 Material</h2>
      <p className={styles.name}>{selectedItem.name}</p>
      <a href={selectedItem.content} download className={styles.content}>
        Download File
      </a>
      <div className={styles.preview}>{renderPreview()}</div>
    </div>
  );
};

export default MaterialView;
