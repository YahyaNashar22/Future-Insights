import express from "express";
import { enrollCourse, getUnlockedVideos, getUserById, signin, signup, teacherSignup, unlockVideo } from "../controllers/userControllers.js";

const userRouter = new express.Router();


userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.post("/teacher-signup", teacherSignup);
userRouter.get("/get-user", getUserById);

userRouter.post("/unlock-video", unlockVideo);
userRouter.get("/get-unlocked-videos", getUnlockedVideos);
userRouter.post("/enroll-course", enrollCourse);

export default userRouter;