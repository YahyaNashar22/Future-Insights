import express from "express";
import { createClass, deleteClass, getClassBySlug, getClassesByCategory, getClassesByTeacher, showCertificate, toggleVisibility, updateClass } from "../controllers/classControllers.js";
import { upload } from "../middlewares/multer.js";


const classRouter = new express.Router();

classRouter.post("/create", upload.fields([
    { name: "thumbnail", maxCount: 1 }, // Single image for course thumbnail
    { name: "demo", maxCount: 1 },// Single image for course demo
]), createClass);

classRouter.post('/get-classes-by-category', getClassesByCategory);
classRouter.get('/get-class/:slug', getClassBySlug);
classRouter.delete('/delete/:id', deleteClass);

classRouter.post('/get-by-teacher', getClassesByTeacher);

classRouter.put("/update-class/:slug", upload.any(), updateClass)

classRouter.put("/show-class-certificate/:id", showCertificate);
classRouter.put("/toggle-visibility/:id", toggleVisibility);



export default classRouter;