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
  teacher: string;
  enrolledUsers: ({ _id: string; fullname: string; email: string } | string)[];
  category: string;
  type: string;
  slug: string;
}

export default ICourse;
