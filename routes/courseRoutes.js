import express from "express";
import { upload } from "../middlewares/multer.js";

import { createCourse, deleteCourse, getCourseBySlug, getCoursesByCategory, getCoursesByTeacher, updateCourse } from "../controllers/courseControllers.js";

const courseRouter = new express.Router();


courseRouter.post("/create", upload.fields([
    { name: "thumbnail", maxCount: 1 }, // Single image for course thumbnail
    { name: "demo", maxCount: 1 },// Single image for course demo
]), createCourse);

courseRouter.post('/get-courses-by-category', getCoursesByCategory);
courseRouter.get('/get-course/:slug', getCourseBySlug);
courseRouter.delete('/delete/:id', deleteCourse);
courseRouter.post('/get-by-teacher', getCoursesByTeacher);

courseRouter.put("/update-course/:slug", upload.any(), updateCourse)



export default courseRouter;