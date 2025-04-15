import ICategory from "./ICategory";
import IUser from "./IUser";

interface IClass {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  demo?: string;
  price: number;
  finalPrice: number;
  duration: string;
  discount: number;
  teacher: IUser;
  enrolledUsers: ({ _id: string; fullname: string; email: string } | string)[];
  category: ICategory;
  type: string;
  slug: string;
}

export default IClass;
