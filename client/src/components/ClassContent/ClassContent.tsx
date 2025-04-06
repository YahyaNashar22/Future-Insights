/* eslint-disable @typescript-eslint/no-explicit-any */
import IAssessment from "../../interfaces/IAssessment";
import IClass from "../../interfaces/IClass";
import ILiveLink from "../../interfaces/ILiveLink";
import IMaterial from "../../interfaces/IMaterial";
import IRecording from "../../interfaces/IRecording";
import DefaultClassView from "../DefaultClassView/DefaultClassView";
import LiveLinkView from "../LiveLinkView/LiveLinkView";
import styles from "./ClassContent.module.css";

const ClassContent = ({
  selectedItem,
  cls,
}: {
  selectedItem: ILiveLink | IRecording | IMaterial | IAssessment | null;
  cls: IClass | null;
}) => {
  const backend = import.meta.env.VITE_BACKEND;

  // IN CASE NTG IS YET SELECTED --> SHOW CLASS INFO
  if (!selectedItem) {
    return (
      <div className={styles.wrapper}>
        <DefaultClassView cls={cls} />
      </div>
    );
  }

  const isLiveLink = (item: any): item is ILiveLink =>
    item._id && item.name && item.startsAt && item.link;
  const isRecording = (item: any): item is IRecording =>
    item._id && item.name && item.link && !item.startsAt;
  const isMaterial = (item: any): item is IMaterial =>
    item._id && item.name && item.content;
  const isAssessment = (item: any): item is IAssessment =>
    item._id && item.title && item.description;

  return (
    <div className={styles.wrapper}>
      {isLiveLink(selectedItem) && <LiveLinkView selectedItem={selectedItem} />}

      {isRecording(selectedItem) && (
        <>
          <h2>🎥 Recording</h2>
          <p>{selectedItem.name}</p>
          <video
            width="100%"
            controls
            src={`${backend}/${selectedItem.link}`}
          />
        </>
      )}

      {isMaterial(selectedItem) && (
        <>
          <h2>📘 Material</h2>
          <p>{selectedItem.name}</p>
          <a href={selectedItem.content} download>
            Download File
          </a>
        </>
      )}

      {isAssessment(selectedItem) && (
        <>
          <h2>📝 Assessment</h2>
          <p>
            <strong>{selectedItem.title}</strong>
          </p>
          <p>{selectedItem.description}</p>
        </>
      )}
    </div>
  );
};

export default ClassContent;
