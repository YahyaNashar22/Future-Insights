import ICategory from "./ICategory";
import IUser from "./IUser";

interface ICourse {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  demo?: string;
  price: number;
  finalPrice: number;
  duration: string;
  discount: number;
  content: {
    title: string;
    url: string;
  }[];
  teacher: IUser;
  enrolledUsers: ({ _id: string; fullname: string; email: string } | string)[];
  category: ICategory;
  type: string;
  slug: string;
}

export default ICourse;
