interface IAssessment {
  _id: string;
  title: string;
  description: string;
  classId: {
    title: string;
  };
  type: "assessment" | "assignment";
  slug: string;
}

export default IAssessment;
