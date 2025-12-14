import path from "path";
import fs, { write } from "fs";

import Recording from "../models/recordingModel.js";
import removeFile from "../utils/removeFile.js";


export const createRecording = async (req, res) => {
    try {
        const { name, moduleId } = req.body;

        const link = req.file?.filename;

        const recording = new Recording({
            name, link, moduleId
        });

        await recording.save();

        return res.status(201).json({
            payload: recording
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong, please try again later" });
    }
}


export const getRecordingByModuleId = async (req, res) => {
    try {
        const { moduleId } = req.body;

        const recording = await Recording.find({ moduleId });

        return res.status(200).json({
            payload: recording
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong, please try again later" });
    }
}


export const deleteRecording = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Recording.findByIdAndDelete(id);

        deleted.link && removeFile(deleted.link)

        if (!deleted) {
            return res.status(404).json({ message: "Recording not found" });
        }

        return res.status(200).json({ message: "Recording deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

export const initUpload = async (req, res) => {
    const { fileName, fileSize, chunkSize } = req.body;

    const uploadId = `${crypto.randomUUID()}-${fileName}`;
    const uploadDir = path.join('uploads/temp', uploadId);

    fs.mkdirSync(uploadDir, { recursive: true });

    res.status(200).json({
        uploadId,
        uploadedChunks: []
    });
}

export const uploadChunk = async (req, res) => {
    try {
        const { uploadId, chunkIndex } = req.body;
        const chunk = req.file;

        const chunkPath = path.join(
            "uploads/temp",
            uploadId,
            `chunk_${chunkIndex}`
        );

        fs.renameSync(chunk.path, chunkPath);

        res.status(200).json({ success: true })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "something went wrong in upload chunk",
            error: error
        })
    }
}

export const completeUpload = async (req, res) => {
    try {
        const { uploadId, name, moduleId } = req.body;

        const tempDir = path.join("uploads/temp", uploadId);
        const finalPath = path.join("uploads", `${uploadId}`);

        const chunks = fs.readdirSync(tempDir).sort((a, b) => {
            const ai = parseInt(a.split("_")[1]);
            const bi = parseInt(b.split("_")[1]);
            return ai - bi;
        });

        const writeStream = fs.createWriteStream(finalPath);

        for (const chunk of chunks) {
            const data = fs.readFileSync(path.join(tempDir, chunk));
            writeStream.write(data);
        }

        writeStream.end();

        const recording = await Recording.create({
            name,
            link: `${uploadId}`,
            moduleId,
        });

        fs.rmSync(tempDir, { recursive: true, force: true });

        res.status(201).json({
            message: 'recorded uploaded successfully',
            payload: recording
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "problem completing upload",
            error: error
        })
    }
}