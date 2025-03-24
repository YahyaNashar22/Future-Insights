import express from "express";
import { createAssessment, getAssessmentBySlug, getAssessmentsByClassId, getAssignmentsByClassId } from "../controllers/assessmentControllers.js";

const assessmentRouter = express.Router();

assessmentRouter.post("/create", createAssessment);
assessmentRouter.get("/:classId/assessments", getAssessmentsByClassId);
assessmentRouter.get("/:classId/assignments", getAssignmentsByClassId);
assessmentRouter.get("/get-one/:slug", getAssessmentBySlug);




export default assessmentRouter;