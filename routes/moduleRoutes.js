import express from "express";
import { createModule, deleteModule, getModulesByClassId, toggleVisibility } from "../controllers/moduleControllers.js";

const moduleRouter = new express.Router();


moduleRouter.post("/create", createModule);
moduleRouter.get("/", getModulesByClassId);
moduleRouter.delete("/:id", deleteModule);
moduleRouter.put("/toggle-visibility/:id", toggleVisibility);



export default moduleRouter;