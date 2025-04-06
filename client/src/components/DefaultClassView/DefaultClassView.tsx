import IClass from "../../interfaces/IClass";
import styles from "./DefaultClassView.module.css";

const DefaultClassView = ({ cls }: { cls: IClass | null }) => {
  const backend = import.meta.env.VITE_BACKEND;
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.classTitle}>{cls?.title}</h1>
      <p className={styles.description}>{cls?.description}</p>

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
