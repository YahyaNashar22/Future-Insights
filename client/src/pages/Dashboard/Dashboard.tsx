import AddCourseForm from "../../components/AddCourseForm/AddCourseForm";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  return (
    <main className={styles.wrapper}>
      <AddCourseForm />
    </main>
  );
};

export default Dashboard;
