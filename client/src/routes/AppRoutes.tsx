import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import Loading from "../components/Loading/Loading.tsx";
import MainLayout from "./MainLayout.tsx";
import CourseCatalogueLayout from "./CourseCatalogueLayout.tsx";
import DashboardLayout from "./DashboardLayout.tsx";

const NotFound = lazy(() => import("../pages/NotFound/NotFound.tsx"));
const Home = lazy(() => import("../pages/Home/Home.tsx"));
const CourseCatalogue = lazy(
  () => import("../pages/CourseCatalogue/CourseCatalogue.tsx")
);
const CategoryDisplay = lazy(
  () => import("../pages/CategoryDisplay/CategoryDisplay.tsx")
);
const CourseDisplay = lazy(
  () => import("../pages/CourseDisplay/CourseDisplay.tsx")
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Main Layout Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route
            path="/course-catalogue/category/:slug"
            element={<CategoryDisplay />}
          />

          <Route path="/course-catalogue/course/:slug" element={<CourseDisplay />} />
        </Route>

        {/* Course Catalogue Layout Routes */}
        <Route path="/course-catalogue" element={<CourseCatalogueLayout />}>
          <Route index element={<CourseCatalogue />} />
        </Route>

        {/* protected routes */}
        <Route path="/dashboard" element={<DashboardLayout />}></Route>

        {/* Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
