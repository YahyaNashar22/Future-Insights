import { useState } from "react";
import AddCourseForm from "../../components/AddCourseForm/AddCourseForm";
import TeacherCourseDisplay from "../../components/TeacherCourseDisplay/TeacherCourseDisplay";
import styles from "./Dashboard.module.css"; // Make sure your styles are correct

const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState<
    "myCourses" | "addCourse"
  >("myCourses");

  const handleSidebarClick = (component: "myCourses" | "addCourse") => {
    setActiveComponent(component);
  };

  return (
    <main className={styles.wrapper}>
      {/* Sidebar */}
      <ul className={styles.sidebar}>
        <li>
          <button
            onClick={() => handleSidebarClick("myCourses")}
            className={styles.sidebarButton}
          >
            My Courses
          </button>
        </li>
        <li>
          <button
            onClick={() => handleSidebarClick("addCourse")}
            className={styles.sidebarButton}
          >
            Add Course
          </button>
        </li>
      </ul>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {activeComponent === "addCourse" && <AddCourseForm />}
        {activeComponent === "myCourses" && <TeacherCourseDisplay />}
      </div>
    </main>
  );
};

export default Dashboard;
