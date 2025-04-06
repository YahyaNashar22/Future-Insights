import ILiveLink from "../../interfaces/ILiveLink";
import styles from "./LiveLinkView.module.css";
import { format } from "date-fns";

const LiveLinkView = ({ selectedItem }: { selectedItem: ILiveLink }) => {
  const start = new Date(selectedItem.startsAt);
  const end = new Date(selectedItem.endsAt);

  const hasSessionStarted = start <= new Date();
  const hasSessionEnded = end < new Date();

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Live Session Link</h2>
      <p className={styles.name}>
        <strong>{selectedItem.name}</strong>
      </p>

      {/* Date and Time Card Layout */}
      <div className={styles.dateCard}>
        <div className={styles.dateLeft}>
          <span className={styles.day}>{format(start, "dd")}</span>
          <span className={styles.monthYear}>
            {format(start, "MMM yyyy").toUpperCase()}
          </span>
        </div>
        <div className={styles.dateRight}>
          <span className={styles.timeRange}>
            {format(start, "hh:mm a")} - {format(end, "hh:mm a")}
          </span>
          <span className={styles.timezone}>Asia/Riyadh</span>
        </div>
      </div>

      <p className={styles.info}>
        {hasSessionEnded
          ? "Session Ended"
          : hasSessionStarted
          ? `Session started at ${format(start, "eeee, MMM dd, yyyy h:mm a")}`
          : `Session starts at ${format(start, "eeee, MMM dd, yyyy h:mm a")}`}
      </p>

      {hasSessionStarted && !hasSessionEnded && (
        <a href={selectedItem.link} target="_blank" rel="noopener noreferrer">
          <button className={styles.joinButton}>Join Live Session</button>
        </a>
      )}

      {!hasSessionStarted && !hasSessionEnded && (
        <p className={styles.sessionNotStarted}>Session hasn't started yet</p>
      )}
    </div>
  );
};

export default LiveLinkView;
