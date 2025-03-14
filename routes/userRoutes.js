import express from "express";
import { getUserById, signin, signup, teacherSignup } from "../controllers/userControllers.js";

const userRouter = new express.Router();


userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.post("/teacher-signup", teacherSignup);
userRouter.get("/get-user", getUserById);


export default userRouter;