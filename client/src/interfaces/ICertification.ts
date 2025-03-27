interface ICertification {
  _id: string;
  userId: string;
  courseId?: string;
  classId?: string;
  slug: string;
}

export default ICertification;
