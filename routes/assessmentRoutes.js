import express from "express";
import { createAssessment, getAssessmentsByClassId, getAssignmentsByClassId } from "../controllers/assessmentControllers.js";

const assessmentRouter = express.Router();

assessmentRouter.post("/create", createAssessment);
assessmentRouter.get("/:classId/assessments", getAssessmentsByClassId);
assessmentRouter.get("/:classId/assignments", getAssignmentsByClassId);



export default assessmentRouter;