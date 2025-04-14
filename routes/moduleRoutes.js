import express from "express";
import { createModule, getModulesByClassId } from "../controllers/moduleControllers.js";

const moduleRouter = new express.Router();


moduleRouter.post("/create", createModule);
moduleRouter.get("/", getModulesByClassId);


export default moduleRouter;