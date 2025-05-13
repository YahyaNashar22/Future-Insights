import express from "express";
import { createModule, deleteModule, getModulesByClassId } from "../controllers/moduleControllers.js";

const moduleRouter = new express.Router();


moduleRouter.post("/create", createModule);
moduleRouter.get("/", getModulesByClassId);
moduleRouter.delete("/:id", deleteModule);



export default moduleRouter;