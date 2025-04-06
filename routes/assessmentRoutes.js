import express from "express";
import { createAssessment, getAssessmentBySlug, getAssessmentsByModuleId, getAssignmentsByModuleId } from "../controllers/assessmentControllers.js";
import { upload } from "../middlewares/multer.js";

const assessmentRouter = express.Router();

assessmentRouter.post("/create", upload.single("scope"), createAssessment);
assessmentRouter.get("/:moduleId/assessments", getAssessmentsByModuleId);
assessmentRouter.get("/:moduleId/assignments", getAssignmentsByModuleId);
assessmentRouter.get("/get-one/:slug", getAssessmentBySlug);




export default assessmentRouter;