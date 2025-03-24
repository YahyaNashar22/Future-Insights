import express from "express";
import { createSession, getSessionsByClassId } from "../controllers/sessionControllers.js";

const sessionRouter = new express.Router();


sessionRouter.post("/create", createSession);

sessionRouter.get("/get-class-sessions/:classId", getSessionsByClassId);




export default sessionRouter;