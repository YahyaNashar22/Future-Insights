import Answer from "../models/answerModel.js";

export const uploadAnswer = async (req, res) => {
    try {
        const {
            userId,
            assessmentId
        } = req.body;

        const answer = req.file ? req.file.filename : null;

        const uploadedAnswer = new Answer({
            userId,
            assessmentId,
            answer
        });

        await uploadedAnswer.save();

        return res.status(201).json({
            message: "answer uploaded successfully",
            payload: uploadedAnswer
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" })
    }
}


export const getAllAssessmentAnswers = async (req, res) => {
    try {
        const assessmentId = req.params.assessmentId;

        const answers = await Answer.find({
            assessmentId
        });

        return res.status(200).json({
            message: "fetched successfully",
            payload: answers
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" })
    }
}