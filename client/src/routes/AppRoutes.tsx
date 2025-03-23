import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import Loading from "../components/Loading/Loading.tsx";
import MainLayout from "./MainLayout.tsx";
import CourseCatalogueLayout from "./CourseCatalogueLayout.tsx";
import { useUserStore } from "../store.ts";

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

const MyCourses = lazy(() => import("../pages/MyCourses/MyCourses.tsx"));

const Signin = lazy(() => import("../pages/Signin/Signin.tsx"));

const Signup = lazy(() => import("../pages/Signup/Signup.tsx"));

const IamLearner = lazy(() => import("../pages/IamLearner/IamLearner.tsx"));

const InstructorRequest = lazy(
  () => import("../pages/InstructorRequest/InstructorRequest.tsx")
);

const CourseCheckout = lazy(
  () => import("../pages/CourseCheckout/CourseCheckout.tsx")
);

// const TeacherSignup = lazy(
//   () => import("../pages/TeacherSignup/TeacherSignup.tsx")
// );

const Dashboard = lazy(() => import("../pages/Dashboard/Dashboard.tsx"));

const AppRoutes = () => {
  const { user } = useUserStore();
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
            element={<CourseCheckout />}
          />

          <Route path="/checkout/:slug" element={<CourseDisplay />} />

          <Route path="/support" element={<Support />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/refund-policies" element={<RefundPolicies />} />
          <Route path="/my-courses" element={<MyCourses />} />

          {!user && (
            <>
              <Route path="/signin" element={<Signin />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/iam-learner" element={<IamLearner />} />
              <Route
                path="/instructor-request"
                element={<InstructorRequest />}
              />
            </>
          )}

          {/* <Route path="/teacher-signup" element={<TeacherSignup />} /> */}
        </Route>

        {/* Course Catalogue Layout Routes */}
        <Route path="/course-catalogue" element={<CourseCatalogueLayout />}>
          <Route index element={<CourseCatalogue />} />
        </Route>

        {/* protected routes */}
        {user && (user.role === "admin" || user.role === "teacher") && (
          <Route path="/dashboard" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
          </Route>
        )}

        {/* Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
