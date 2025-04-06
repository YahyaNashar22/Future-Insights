import Recording from "../models/recordingModel.js";


export const createRecording = async (req, res) => {
    try {
        const { name, link, moduleId } = req.body;

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

