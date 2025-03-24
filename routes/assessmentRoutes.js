import express from "express";
import { createAssessment } from "../controllers/assessmentControllers.js";

const assessmentRouter = express.Router();

assessmentRouter.post("/create", createAssessment);


export default assessmentRouter;