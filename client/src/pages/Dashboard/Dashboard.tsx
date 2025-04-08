import { useState } from "react";
import AddCourseForm from "../../components/AddCourseForm/AddCourseForm";
import TeacherCourseDisplay from "../../components/TeacherCourseDisplay/TeacherCourseDisplay";
import styles from "./Dashboard.module.css"; // Make sure your styles are correct
import TeacherClassDisplay from "../../components/TeacherClassDisplay/TeacherClassDisplay";
import AddClassForm from "../../components/AddClassForm/AddClassForm";
import { DashboardSections } from "../../enums/dashboardSections";
import AddContentForm from "../../components/AddModuleForm/AddContent";

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
        <li
          className={
            activeComponent === DashboardSections.MyCourses
              ? styles.active
              : undefined
          }
        >
          <button
            onClick={() => handleSidebarClick(DashboardSections.MyCourses)}
            className={styles.sidebarButton}
          >
            My Courses
          </button>
        </li>
        <li
          className={
            activeComponent === DashboardSections.AddCourse
              ? styles.active
              : undefined
          }
        >
          <button
            onClick={() => handleSidebarClick(DashboardSections.AddCourse)}
            className={styles.sidebarButton}
          >
            Add Course
          </button>
        </li>

        <li
          className={
            activeComponent === DashboardSections.MyClasses
              ? styles.active
              : undefined
          }
        >
          <button
            onClick={() => handleSidebarClick(DashboardSections.MyClasses)}
            className={styles.sidebarButton}
          >
            My Classes
          </button>
        </li>
        <li
          className={
            activeComponent === DashboardSections.AddClass
              ? styles.active
              : undefined
          }
        >
          <button
            onClick={() => handleSidebarClick(DashboardSections.AddClass)}
            className={styles.sidebarButton}
          >
            Add Class
          </button>
        </li>

        <li
          className={
            activeComponent === DashboardSections.AddContent
              ? styles.active
              : undefined
          }
        >
          <button
            onClick={() => handleSidebarClick(DashboardSections.AddContent)}
            className={styles.sidebarButton}
          >
            Add Content
          </button>
        </li>
      </ul>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {activeComponent === "myCourses" && <TeacherCourseDisplay />}
        {activeComponent === "addCourse" && (
          <AddCourseForm setActiveComponent={setActiveComponent} />
        )}
        {activeComponent === "myClasses" && <TeacherClassDisplay />}
        {activeComponent === "addClass" && (
          <AddClassForm setActiveComponent={setActiveComponent} />
        )}
        {activeComponent === "addContent" && <AddContentForm />}
      </div>
    </main>
  );
};

export default Dashboard;
