import { useTranslation } from "react-i18next";
import IRecording from "../../interfaces/IRecording";
import styles from "./RecordingView.module.css";

const RecordingView = ({ selectedItem }: { selectedItem: IRecording }) => {
  const { t } = useTranslation();

  const backend = import.meta.env.VITE_BACKEND;

  const videoSrc = `${backend}/${selectedItem.link}`;

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>🎥 {t('recording-title')}</h2>
      <p className={styles.name}>{selectedItem.name}</p>
      <video
        className={styles.vid}
        width="100%"
        controls
        controlsList="nodownload"
        onContextMenu={(e) => e.preventDefault()}
        src={videoSrc}
      />
    </div>
  );
};

export default RecordingView;
