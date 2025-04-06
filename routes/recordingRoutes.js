import express from "express";
import { createRecording, getRecordingByModuleId } from "../controllers/RecordingControllers.js";


const recordingRouter = new express.Router();


recordingRouter.post("/create", createRecording);
recordingRouter.post("/get-module-recordings", getRecordingByModuleId);



export default recordingRouter;