interface ICourse {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  demo?: string;
  price: number;
  duration: string;
  discount: number;
  content: [{
    title: string;
    url: string;
  }];
  teacher: string;
  enrolledUsers: string[];
  category: string;
  slug: string;
}

export default ICourse;
