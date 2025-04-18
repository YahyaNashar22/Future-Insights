import IClass from "../../interfaces/IClass";
import { parseBullets } from "../../utils/ParseList";
import styles from "./DefaultClassView.module.css";

const DefaultClassView = ({ cls }: { cls: IClass | null }) => {
  const backend = import.meta.env.VITE_BACKEND;
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.classTitle}>{cls?.title}</h1>
      {cls?.description && (
        <div className={styles.description}>
          {parseBullets(cls.description)}
        </div>
      )}

      <img
        src={`${backend}/${cls?.thumbnail}`}
        alt={cls?.title}
        className={styles.thumbnail}
      />
      <p className={styles.duration}>Duration: {cls?.duration}</p>
    </div>
  );
};

export default DefaultClassView;
