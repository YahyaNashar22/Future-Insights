interface IAssessment {
  _id: string;
  title: string;
  description: string;
  classId: {
    slug: string;
    title: string;
  };
  type: "assessment" | "assignment";
  scope?: string;
  slug: string;
}

export default IAssessment;
