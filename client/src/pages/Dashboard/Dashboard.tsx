import { useState } from "react";
import AddCourseForm from "../../components/AddCourseForm/AddCourseForm";
import TeacherCourseDisplay from "../../components/TeacherCourseDisplay/TeacherCourseDisplay";
import styles from "./Dashboard.module.css"; // Make sure your styles are correct
import TeacherClassDisplay from "../../components/TeacherClassDisplay/TeacherClassDisplay";

enum DashboardSections {
  MyCourses = "myCourses",
  AddCourse = "addCourse",
  MyClasses = "myClasses",
}

const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState<DashboardSections>(
    DashboardSections.MyCourses
  );

  const handleSidebarClick = (component: DashboardSections) => {
    setActiveComponent(component);
  };

  return (
    <main className={styles.wrapper}>
      {/* Sidebar */}
      <ul className={styles.sidebar}>
        <li>
          <button
            onClick={() => handleSidebarClick(DashboardSections.MyCourses)}
            className={styles.sidebarButton}
          >
            My Courses
          </button>
        </li>
        <li>
          <button
            onClick={() => handleSidebarClick(DashboardSections.AddCourse)}
            className={styles.sidebarButton}
          >
            Add Course
          </button>
        </li>

        <li>
          <button
            onClick={() => handleSidebarClick(DashboardSections.MyClasses)}
            className={styles.sidebarButton}
          >
            My Classes
          </button>
        </li>
      </ul>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {activeComponent === "addCourse" && <AddCourseForm />}
        {activeComponent === "myCourses" && <TeacherCourseDisplay />}
        {activeComponent === "myClasses" && <TeacherClassDisplay />}
      </div>
    </main>
  );
};

export default Dashboard;
