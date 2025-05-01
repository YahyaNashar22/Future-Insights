import IClass from "./IClass";
import ICourse from "./ICourse";

interface ITransaction {
  _id: string;
  userId: string;
  courseId?: ICourse;
  classId?: IClass;
  amount: string;
  referenceLink: string;
  createdAt: string;
}

export default ITransaction;
