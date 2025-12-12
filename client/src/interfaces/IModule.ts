import ICohort from "./ICohort";

interface IModule {
  _id: string;
  name: string;
  classId: string;
  visible: boolean;
  cohortVisible: ICohort[];
  index?: number;
}

export default IModule;
