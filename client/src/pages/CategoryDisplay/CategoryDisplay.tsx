import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import styles from "./CategoryDisplay.module.css";
import ICategory from "../../interfaces/ICategory";
import Loading from "../../components/Loading/Loading";
import CategoryCard from "../../components/CategoryCard/CategoryCard";

const CategoryDisplay = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const { slug } = useParams();

  const [category, setCategory] = useState<ICategory | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${backend}/category/get/${slug}`);

        setCategory(res.data.payload);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategory();
  }, [backend, slug]);

  return (
    <main className={styles.wrapper}>
      {
        isLoading ? <Loading /> : <CategoryCard selectedCategory={category} showButton={false} />
      }
    </main>
  );
};

export default CategoryDisplay;
