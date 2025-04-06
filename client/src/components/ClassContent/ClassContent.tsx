/* eslint-disable @typescript-eslint/no-explicit-any */
import IAssessment from "../../interfaces/IAssessment";
import IClass from "../../interfaces/IClass";
import ILiveLink from "../../interfaces/ILiveLink";
import IMaterial from "../../interfaces/IMaterial";
import IRecording from "../../interfaces/IRecording";
import AssessmentView from "../AssessmentView/AssessmentView";
import DefaultClassView from "../DefaultClassView/DefaultClassView";
import LiveLinkView from "../LiveLinkView/LiveLinkView";
import MaterialView from "../MaterialView/MaterialView";
import RecordingView from "../RecordingView/RecordingView";
import styles from "./ClassContent.module.css";

const ClassContent = ({
  selectedItem,
  cls,
}: {
  selectedItem: ILiveLink | IRecording | IMaterial | IAssessment | null;
  cls: IClass | null;
}) => {
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
        <RecordingView selectedItem={selectedItem} />
      )}

      {isMaterial(selectedItem) && <MaterialView selectedItem={selectedItem} />}

      {isAssessment(selectedItem) && (
        <AssessmentView selectedItem={selectedItem} />
      )}
    </div>
  );
};

export default ClassContent;
