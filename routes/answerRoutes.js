import express from "express";
import { upload } from "../middlewares/multer.js";
import { getAllAssessmentAnswers, uploadAnswer } from "../controllers/answerControllers.js";

const answerRouter = express.Router();

answerRouter.post("/upload-answer", upload.single("answer"), uploadAnswer);
answerRouter.get("/assessment/:assessmentId", getAllAssessmentAnswers);


export default answerRouter;