interface IClass {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  demo?: string;
  price: number;
  duration: string;
  discount: number;
  teacher: string;
  enrolledUsers: string[];
  category: string;
  slug: string;
}

export default IClass;
