interface ICategory {
  _id: string;
  slug: string;
  title: string;
  description?: string;
  arabicTitle: string;
  arabicDescription?: string;
  image?: string;
}

export default ICategory;
