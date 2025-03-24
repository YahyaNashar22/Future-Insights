// * For simplicity, we will refer to both assessment or assignment as assessment

import Assessment from "../models/assessmentModel.js";

export const createAssessment = async (req, res) => {
    try {
        const {
            title,
            description,
            classId,
            type,
        } = req.body;

        const assessment = new Assessment({
            title,
            description,
            classId,
            type,
        });

        await assessment.save();

        return res.status(201).json({
            message: "assessment created successfully",
            payload: assessment
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" })
    }
}