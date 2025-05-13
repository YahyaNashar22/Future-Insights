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
        const { classId, courseId } = req.query;

        if (!classId && !courseId) {
            return res.status(400).json({
                message: "Please provide at least a classId or a courseId",
            });
        }

        const filter = {};
        if (classId) filter.classId = classId;
        if (courseId) filter.courseId = courseId;

        const classModules = await Module.find(filter);

        return res.status(200).json({
            payload: classModules
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong, please try again later" });
    }
}


export const deleteModule = async (req, res) => {
    const id = req.params.id;

    try {
        await Module.findByIdAndDelete(id);

        return res.status(200).json({ message: "Module deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong, please try again later" });
    }
}