import Module from "../models/moduleModel.js";

export const createModule = async (req, res) => {
    try {
        const { name, classId } = req.body;

        const newModule = new Module({ name, classId });
        await newModule.save();

        return res.status(201).json({
            message: "module created successfully",
            payload: newModule
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong, please try again later" });
    }
}


export const getModulesByClassId = async (req, res) => {
    try {
        const { classId } = req.params;

        const classModules = await Module.find({ classId });

        return res.status(200).json({
            payload: classModules
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong, please try again later" });
    }
}