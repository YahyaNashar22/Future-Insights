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

const Support = lazy(() => import("../pages/Support/Support.tsx"));
const PrivacyPolicy = lazy(
  () => import("../pages/PrivacyPolicy/PrivacyPolicy.tsx")
);

const TermsOfUse = lazy(() => import("../pages/TermsOfUse/TermsOfUse.tsx"));

const RefundPolicies = lazy(
  () => import("../pages/RefundPolicies/RefundPolicies.tsx")
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

          <Route
            path="/course-catalogue/course/:slug"
            element={<CourseDisplay />}
          />
          <Route path="/support" element={<Support />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/refund-policies" element={<RefundPolicies />} />
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
