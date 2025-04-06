import express from "express";
import { createModule } from "../controllers/moduleControllers.js";

const moduleRouter = new express.Router();


moduleRouter.post("/create", createModule)


export default moduleRouter;