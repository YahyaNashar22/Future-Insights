import express from "express";
import { enrollClass, enrollCourse, getEnrolledClasses, getEnrolledCourses, getUnlockedVideos, getUserById, instructorRegisterRequestEmail, reserveCoachingSession, resetPassword, sendForgotPasswordOTP, sendVerification, signin, signup, teacherSignup, unlockVideo, updateProfile, verifyEmail } from "../controllers/userControllers.js";

const userRouter = new express.Router();


userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.post("/teacher-signup", teacherSignup);
userRouter.get("/get-user", getUserById);

userRouter.post("/unlock-video", unlockVideo);
userRouter.get("/get-unlocked-videos", getUnlockedVideos);
userRouter.post("/enroll-course", enrollCourse);
userRouter.post("/enroll-class", enrollClass);

userRouter.post("/get-enrolled-classes", getEnrolledClasses);
userRouter.post("/get-enrolled-courses", getEnrolledCourses);

userRouter.post("/forgot-password", sendForgotPasswordOTP);
userRouter.post("/reset-password", resetPassword);
userRouter.post("/send-verification", sendVerification);

userRouter.get("/verify-email/:token", verifyEmail);

userRouter.post("/new-instructor-request", instructorRegisterRequestEmail)

userRouter.put("/update-profile", updateProfile)

userRouter.post("/request-coaching-session", reserveCoachingSession)





export default userRouter;