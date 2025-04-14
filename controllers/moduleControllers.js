import Module from "../models/moduleModel.js";

export const createModule = async (req, res) => {
    try {
        const { name, classId, courseId } = req.body;

        const newModule = new Module({ name, classId, courseId });
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
        const { classId, courseId } = req.params;

        if (!classId && !courseId) {
            return res.status(400).json({
                message: "Please provide at least a classId or a courseId",
            });
        }

        const filter = {};
        if (classId) filter.classId = classId;
        if (courseId) filter.courseId = courseId;

        const modules = await Module.find(filter);

        return res.status(200).json({
            payload: classModules
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong, please try again later" });
    }
}