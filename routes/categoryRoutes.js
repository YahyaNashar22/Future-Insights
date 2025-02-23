import express from "express";
import { upload } from "../middlewares/multer.js";
import { createCategory, getAllCategories, getSingleCategory } from "../controllers/categoryControllers.js";

const categoryRouter = express.Router();

categoryRouter.post("/create", upload.single("image"), createCategory);
categoryRouter.get("/get-all", getAllCategories);
categoryRouter.get("/get/:id", getSingleCategory);

export default categoryRouter;