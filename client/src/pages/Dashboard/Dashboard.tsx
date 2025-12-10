import styles from "./Dashboard.module.css"; // Make sure your styles are correct

import { useState } from "react";
import { useUserStore } from "../../store";

import TeacherClassDisplay from "../../components/TeacherClassDisplay/TeacherClassDisplay";
import AddClassForm from "../../components/AddClassForm/AddClassForm";
import AddContentForm from "../../components/AddModuleForm/AddContent";
import CategoriesDashboard from "../../components/CategoriesDashboard/CategoriesDashboard";
import { DashboardSections } from "../../enums/dashboardSections";
// import AddCourseForm from "../../components/AddCourseForm/AddCourseForm";
// import TeacherCourseDisplay from "../../components/TeacherCourseDisplay/TeacherCourseDisplay";

const Dashboard = () => {
  const { user } = useUserStore();

  const [activeComponent, setActiveComponent] = useState<DashboardSections>(
    DashboardSections.MyClasses
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
        {/* <li
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
        </li> */}
        {/* <li
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
        </li> */}

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
        {user?.role === "super" && (
          <li
            className={
              activeComponent === DashboardSections.AddContent
                ? styles.active
                : undefined
            }
          >
            <button
              onClick={() => handleSidebarClick(DashboardSections.Categories)}
              className={styles.sidebarButton}
            >
              Categories
            </button>
          </li>
        )}
      </ul>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* {activeComponent === "myCourses" && <TeacherCourseDisplay />} */}
        {/* {activeComponent === "addCourse" && (
          <AddCourseForm setActiveComponent={setActiveComponent} />
        )} */}
        {activeComponent === "myClasses" && <TeacherClassDisplay />}
        {activeComponent === "addClass" && (
          <AddClassForm setActiveComponent={setActiveComponent} />
        )}
        {activeComponent === "addContent" && <AddContentForm />}
        {user?.role === "super" && activeComponent === "categories" && (
          <CategoriesDashboard />
        )}
      </div>
    </main>
  );
};

export default Dashboard;
