import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import { useUserStore } from "../store.ts";

import Loading from "../components/Loading/Loading.tsx";
import MainLayout from "./MainLayout.tsx";
import CourseCatalogueLayout from "./CourseCatalogueLayout.tsx";

import ProtectedRoute from "./ProtectedRoute.tsx";

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

const ClassDisplay = lazy(
  () => import("../pages/ClassDisplay/ClassDisplay.tsx")
);

const AssessmentPage = lazy(
  () => import("../pages/AssessmentPage/AssessmentPage.tsx")
);

const CertificationPage = lazy(
  () => import("../pages/CertificationPage/CertificationPage.tsx")
);

const CourseInfo = lazy(() => import("../pages/CourseInfo/CourseInfo.tsx"));

const TeacherCourseDisplay = lazy(
  () => import("../components/TeacherCourseDisplay/TeacherCourseDisplay.tsx")
);

const ClassInfo = lazy(() => import("../pages/ClassInfo/ClassInfo.tsx"));

const CoachingSessions = lazy(
  () => import("../pages/CoachingSessions/CoachingSessions.tsx")
);

// const CourseCheckout = lazy(
//   () => import("../pages/CourseCheckout/CourseCheckout.tsx")
// );

// const TeacherSignup = lazy(
//   () => import("../pages/TeacherSignup/TeacherSignup.tsx")
// );

const Dashboard = lazy(() => import("../pages/Dashboard/Dashboard.tsx"));

const ForgotPassword = lazy(
  () => import("../pages/ForgotPassword/ForgotPassword.tsx")
);

const VerifyEmail = lazy(() => import("../pages/VerifyEmail/VerifyEmail.tsx"));

const ClassShowCase = lazy(
  () => import("../pages/ClassShowCase/ClassShowCase.tsx")
);

const CourseShowCase = lazy(
  () => import("../pages/CourseShowCase/CourseShowCase.tsx")
);

// const PaymentPage = lazy(() => import("../pages/PaymentPage/PaymentPage.tsx"));

const PaymentFailed = lazy(
  () => import("../pages/PaymentFailed/PaymentFailed.tsx")
);

// const CheckoutClass = lazy(
//   () => import("../pages/CheckoutClass/CheckoutClass.tsx")
// );

// const CourseCheckout = lazy(
//   () => import("../pages/CourseCheckout/CourseCheckout.tsx")
// );

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

          <Route path="/coaching-session" element={<CoachingSessions />} />

          <Route path="/show-case/class/:slug" element={<ClassShowCase />} />
          <Route path="/show-case/course/:slug" element={<CourseShowCase />} />

          <Route path="/payment-failed/:slug" element={<PaymentFailed />} />

          {/* <Route path="/pay" element={<PaymentPage />} /> */}

          {/* <Route path="/checkout-class/:slug" element={<CheckoutClass />} />
          <Route path="/checkout-course/:slug" element={<CourseCheckout />} /> */}

          {/* Redirect if user is not signed in  */}
          <Route element={<ProtectedRoute userId={user?._id} />}>
            <Route
              path="/course-catalogue/course/:slug"
              element={<CourseDisplay />}
            />
            <Route
              path="/course-catalogue/class/:slug"
              element={<ClassDisplay />}
            />
            <Route path="/assessment/:slug" element={<AssessmentPage />} />
            <Route path="/assignment/:slug" element={<AssessmentPage />} />
            <Route path="/my-courses" element={<MyCourses />} />
            <Route
              path="/certification/:slug"
              element={<CertificationPage />}
            />
          </Route>

          <Route path="/support" element={<Support />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/refund-policies" element={<RefundPolicies />} />
          <Route path="/instructor-request" element={<InstructorRequest />} />

          {!user && (
            <>
              <Route path="/signin" element={<Signin />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/iam-learner" element={<IamLearner />} />
            </>
          )}

          {/* <Route path="/teacher-signup" element={<TeacherSignup />} /> */}

          {!user && (
            <Route path="/forgot-password" element={<ForgotPassword />} />
          )}
        </Route>

        {/* Course Catalogue Layout Routes */}
        <Route path="/course-catalogue" element={<CourseCatalogueLayout />}>
          <Route index element={<CourseCatalogue />} />
        </Route>

        {/* protected routes */}
        {user && (user.role === "admin" || user.role === "teacher") && (
          <Route path="/dashboard" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route
              path="/dashboard/my-courses"
              element={<TeacherCourseDisplay />}
            />
            <Route
              path="/dashboard/course-info/:slug"
              element={<CourseInfo />}
            />
            <Route path="/dashboard/class-info/:slug" element={<ClassInfo />} />
          </Route>
        )}

        {/* Not Found Route */}
        <Route path="*" element={<NotFound />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
