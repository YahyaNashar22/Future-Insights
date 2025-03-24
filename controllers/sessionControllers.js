import Session from "../models/sessionModel.js";

export const createSession = async (req, res) => {
    try {
        const { link, classId, recording } = req.body;

        const newSession = new Session({
            link, classId, recording
        });

        await newSession.save();

        return res.status(201).json({
            message: "Session created successfully",
            payload: newSession
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


export const getSessionsByClassId = async (req, res) => {
    try {
        const classId = req.params.classId;

        const sessions = await Session.find({ classId });

        return res.status(200).json({
            message: "fetched successfully",
            payload: sessions
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}