import express from "express";
import { createClass, deleteClass, getClassBySlug, getClassesByCategory } from "../controllers/classControllers.js";
import { upload } from "../middlewares/multer.js";


const classRouter = new express.Router();

classRouter.post("/create", upload.fields([
    { name: "thumbnail", maxCount: 1 }, // Single image for course thumbnail
    { name: "demo", maxCount: 1 },// Single image for course demo
]), createClass);

classRouter.post('/get-classes-by-category', getClassesByCategory);
classRouter.get('/get-class/:slug', getClassBySlug);
classRouter.delete('/delete/:id', deleteClass);


export default classRouter;