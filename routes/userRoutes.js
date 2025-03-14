import express from "express";
import { signin, signup, teacherSignup } from "../controllers/userControllers.js";

const userRouter = new express.Router();


userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.post("/teacher-signup", teacherSignup);


export default userRouter;