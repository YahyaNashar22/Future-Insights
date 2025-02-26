import express from "express";
import { upload } from "../middlewares/multer.js";
import { createCategory, deleteCategory, getAllCategories, getSingleCategory, getSingleCategoryById, updateCategory } from "../controllers/categoryControllers.js";

const categoryRouter = express.Router();

categoryRouter.post("/create", upload.single("image"), createCategory);
categoryRouter.get("/get-all", getAllCategories);
categoryRouter.get("/get/:slug", getSingleCategory);
categoryRouter.get("/get-id/:id", getSingleCategoryById);

categoryRouter.patch("/update/:id", upload.single("image"), updateCategory);
categoryRouter.delete("/delete/:id", deleteCategory);


export default categoryRouter;