import ICategory from "./ICategory";

interface ICategoryCard {
  selectedCategory: ICategory | null;
  showButton: boolean;
}

export default ICategoryCard;
