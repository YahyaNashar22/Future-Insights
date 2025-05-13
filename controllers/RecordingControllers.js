import Recording from "../models/recordingModel.js";


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

    if (!deleted) {
      return res.status(404).json({ message: "Recording not found" });
    }

    return res.status(200).json({ message: "Recording deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
