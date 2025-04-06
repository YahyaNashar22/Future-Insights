import express from "express";
import { createLiveLink, getLinksByModuleId } from "../controllers/liveLinkController.js";


const liveLinkRouter = new express.Router();


liveLinkRouter.post("/create", createLiveLink);
liveLinkRouter.post("/get-module-link", getLinksByModuleId);



export default liveLinkRouter;