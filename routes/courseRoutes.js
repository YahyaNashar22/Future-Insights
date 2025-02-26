import express from "express";
import { upload } from "../middlewares/multer.js";

import { createCourse } from "../controllers/courseControllers.js";

const courseRouter = new express.Router();


courseRouter.post("/create", upload.fields([
    { name: "thumbnail", maxCount: 1 }, // Single image for course thumbnail
    { name: "demo", maxCount: 1 },// Single image for course demo
    { name: "videos" } // Multiple videos for course content
]), createCourse);


export default courseRouter;