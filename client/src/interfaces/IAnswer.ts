interface IAnswer {
  _id: string;
  userId: string;
  assessmentId: string;
  answer: string | File;
  grade: string;
}

export default IAnswer;
