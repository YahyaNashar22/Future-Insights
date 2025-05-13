import express from "express";
import { createRecording, deleteRecording, getRecordingByModuleId } from "../controllers/RecordingControllers.js";
import { upload } from "../middlewares/multer.js";


const recordingRouter = new express.Router();


recordingRouter.post("/create", upload.single("link"), createRecording);
recordingRouter.post("/get-module-recordings", getRecordingByModuleId);
recordingRouter.delete("/delete/:id", deleteRecording);



export default recordingRouter;