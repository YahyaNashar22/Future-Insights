import express from "express";
import { createLiveLink, deleteLiveLink, getLinksByModuleId } from "../controllers/liveLinkController.js";


const liveLinkRouter = new express.Router();


liveLinkRouter.post("/create", createLiveLink);
liveLinkRouter.post("/get-module-link", getLinksByModuleId);
liveLinkRouter.delete("/delete/:moduleId", deleteLiveLink);



export default liveLinkRouter;