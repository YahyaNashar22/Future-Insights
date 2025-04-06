import express from "express";
import { createMaterial, getMaterialByModuleId } from "../controllers/materialControllers.js";
import { upload } from "../middlewares/multer.js";


const materialRouter = new express.Router();


materialRouter.post("/create", upload.single("content"), createMaterial);
materialRouter.post("/get-module-materials", getMaterialByModuleId);



export default materialRouter;