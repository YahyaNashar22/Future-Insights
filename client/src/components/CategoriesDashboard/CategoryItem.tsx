import ICategory from "../../interfaces/ICategory";
import styles from "./CategoriesDashboard.module.css";

const CategoryItem = ({
  category,
  onDelete,
  onEdit,
}: {
  category: ICategory;
  onDelete: () => void;
  onEdit: () => void;
}) => {
  const backend = import.meta.env.VITE_BACKEND;
  return (
    <div className={styles.item}>
      <img src={`${backend}/${category.image}`} alt={category.title} />
      <h3>{category.title}</h3>
      <p>{category.description}</p>
      <div className={styles.actions}>
        <button onClick={onEdit}>Edit</button>
        <button onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
};

export default CategoryItem;
