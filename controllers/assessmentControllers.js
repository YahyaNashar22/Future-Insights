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

        const scope = req.file ? req.file.filename : null;

        const assessment = new Assessment({
            title,
            description,
            classId,
            type,
            scope
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

export const getAssessmentsByClassId = async (req, res) => {
    try {
        const classId = req.params.classId;

        const assessments = await Assessment.find({
            classId,
            type: "assessment"
        });


        return res.status(200).json({
            message: "assessment fetched successfully",
            payload: assessments
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" })
    }
}


export const getAssignmentsByClassId = async (req, res) => {
    try {
        const classId = req.params.classId;

        const assignments = await Assessment.find({
            classId,
            type: "assignment"
        });


        return res.status(200).json({
            message: "assignments fetched successfully",
            payload: assignments
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" })
    }
}


export const getAssessmentBySlug = async (req, res) => {
    try {
        const slug = req.params.slug;

        const assessment = await Assessment.findOne({ slug }).populate("classId");

        return res.status(200).json({
            message: "fetched successfully",
            payload: assessment
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" })
    }
}