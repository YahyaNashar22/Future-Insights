import express from "express";
import { upload } from "../middlewares/multer.js";

import { createCourse, getCourseBySlug, getCoursesByCategory, unlockVideo } from "../controllers/courseControllers.js";

const courseRouter = new express.Router();


courseRouter.post("/create", upload.fields([
    { name: "thumbnail", maxCount: 1 }, // Single image for course thumbnail
    { name: "demo", maxCount: 1 },// Single image for course demo
    { name: "videos" } // Multiple videos for course content
]), createCourse);

courseRouter.post('/get-courses-by-category', getCoursesByCategory);
courseRouter.get('/get-course/:slug', getCourseBySlug);
courseRouter.post('/unlock-video', unlockVideo);



export default courseRouter;