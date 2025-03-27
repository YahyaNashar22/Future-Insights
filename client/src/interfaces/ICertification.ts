interface ICertification {
  _id: string;
  userId: {
    fullname: string;
  };
  courseId?: {
    title: string;
    description: string;
    teacher: {
      fullname: string;
    };
  };
  classId?: {
    title: string;
    description: string;
    teacher: {
      fullname: string;
    };
  };
  slug: string;
  createdAt: string;
}

export default ICertification;
