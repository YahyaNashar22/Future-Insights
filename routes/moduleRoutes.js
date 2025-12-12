import express from "express";
import { createModule, deleteModule, editModule, getModulesByClassId, toggleCohortVisibility, toggleVisibility } from "../controllers/moduleControllers.js";

const moduleRouter = new express.Router();


moduleRouter.post("/create", createModule);
moduleRouter.put("/toggle-visibility/:id", toggleVisibility);
moduleRouter.patch("/toggle-cohort-visibility/:id", toggleCohortVisibility);
moduleRouter.patch("/edit-module/:id", editModule);
moduleRouter.get("/", getModulesByClassId);
moduleRouter.delete("/:id", deleteModule);



export default moduleRouter;