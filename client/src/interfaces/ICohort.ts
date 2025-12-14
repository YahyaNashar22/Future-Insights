import IUser from "./IUser";

interface ICohort {
  _id: string;
  name: string;
  classId: string;
  isDefault: boolean;
  cohortUsers: IUser[];
  autoCloseDays?: number;
}

export default ICohort;
