import { useEffect, useState } from "react";
import axios from "axios";

import styles from "./CourseCatalogue.module.css";

import CourseCatalogueHero from "../../components/CourseCatalogueHero/CourseCatalogueHero";
import ICategory from "../../interfaces/ICategory";
import CourseCategories from "../../components/CourseCategories/CourseCategories";
import Loading from "../../components/Loading/Loading";
import CategoryCard from "../../components/CategoryCard/CategoryCard";

const CourseCatalogue = () => {
  const backend = import.meta.env.VITE_BACKEND;

  const [categories, setCategories] = useState<ICategory[] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${backend}/category/get-all`);

        setCategories(response.data.payload);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [backend]);

  return (
    <main className={styles.wrapper}>
      <CourseCatalogueHero />

      {isLoading ? (
        <Loading />
      ) : (
        <CourseCategories
          categories={categories}
          setSelectedCategory={setSelectedCategory}
        />
      )}

      <CategoryCard selectedCategory={selectedCategory} showButton={true} />
    </main>
  );
};

export default CourseCatalogue;
