import IModule from "../../interfaces/IModule";
import styles from "./ModuleAccordion.module.css";

const ModuleAccordion = ({
  module,
  index,
  toggleModule,
  openModuleIndex,
}: {
  module: IModule;
  index: number;
  openModuleIndex: number | null;
  toggleModule: (ind: number) => void;
}) => {
  return (
    <li key={module._id} className={styles.moduleAccordion}>
      <div
        className={styles.accordionHeader}
        onClick={() => toggleModule(index)}
      >
        <span>
          {index + 1}. {module.name}
        </span>
        <span className={styles.icon}>
          {openModuleIndex === index ? "-" : "+"}
        </span>
      </div>
      {openModuleIndex === index && (
        <div
          className={`${styles.accordionContentWrapper} ${
            openModuleIndex === index ? styles.expanded : ""
          }`}
        >
          <div className={styles.accordionContent}>module.content</div>
        </div>
      )}
    </li>
  );
};

export default ModuleAccordion;
