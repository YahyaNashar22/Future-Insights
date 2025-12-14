import express from "express";

import { completeUpload, createRecording, deleteRecording, getRecordingByModuleId, initUpload, uploadChunk } from "../controllers/RecordingControllers.js";
import { upload } from "../middlewares/multer.js";


const recordingRouter = new express.Router();


recordingRouter.post("/create", upload.single("link"), createRecording);
recordingRouter.post("/get-module-recordings", getRecordingByModuleId);
recordingRouter.delete("/delete/:id", deleteRecording);

recordingRouter.post("/init-upload", initUpload);
recordingRouter.post("/upload-chunk", upload.single('chunk'), uploadChunk);
recordingRouter.post("/complete-upload", completeUpload);


export default recordingRouter;