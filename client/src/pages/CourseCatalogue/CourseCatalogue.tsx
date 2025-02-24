import { useEffect, useState } from "react";
import axios from "axios";

import styles from "./CourseCatalogue.module.css";

import CourseCatalogueHero from "../../components/CourseCatalogueHero/CourseCatalogueHero";
import ICategory from "../../interfaces/ICategory";
import CourseCategories from "../../components/CourseCategories/CourseCategories";
import Loading from "../../components/Loading/Loading";

const CourseCatalogue = () => {
  const backend = import.meta.env.VITE_BACKEND;

  const [categories, setCategories] = useState<ICategory[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backend}/category/get-all`);

        setCategories(response.data.payload);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [backend]);

  return (
    <main className={styles.wrapper}>
      <CourseCatalogueHero />

      {loading ? <Loading /> : <CourseCategories categories={categories} />}
    </main>
  );
};

export default CourseCatalogue;
