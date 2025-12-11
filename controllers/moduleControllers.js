import mongoose from "mongoose";
import Module from "../models/moduleModel.js";
import User from "../models/userModel.js";

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
        const { classId, courseId, userId } = req.query;

        if (!classId && !courseId) {
            return res.status(400).json({
                message: "Please provide at least a classId or a courseId",
            });
        }


        const user = await User.findById(userId);


        const filter = {};
        if (classId) filter.classId = new mongoose.Types.ObjectId(classId);
        if (courseId) filter.courseId = new mongoose.Types.ObjectId(courseId);

        if (!user || user.role === 'student') {
            filter.visible = true
        }

        const classModules = await Module.aggregate([
            { $match: filter },

            // Compute sorting helper
            {
                $addFields: {
                    hasIndex: { $cond: [{ $ne: ["$index", null] }, 1, 0] }
                }
            },

            // Sorting logic
            {
                $sort: {
                    hasIndex: -1,
                    index: 1,
                    createdAt: 1
                }
            },

            // Remove helper field from response
            {
                $project: { hasIndex: 0 }
            }
        ]);


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

export const toggleVisibility = async (req, res) => {
    try {
        const id = req.params.id;

        const fetchedModule = await Module.findById(id);

        if (!fetchedModule) return res.status(404).json({ message: 'requested module not found' })

        const module = await Module.findByIdAndUpdate(id, {
            $set: {
                visible: !(fetchedModule?.visible)
            }
        }, {
            new: true
        });

        return res.status(200).json({
            payload: module
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" })
    }
}

export const toggleCohortVisibility = async (req, res) => {
    try {
        const id = req.params.id;
        const { cohortId } = req.body;

        if (!cohortId) {
            return res.status(400).json({ message: "A cohortId is required in the request body" });
        }

        const fetchedModule = await Module.findById(id);

        if (!fetchedModule) return res.status(404).json({ message: 'requested module not found' });

        let updateOperation;
        let successMessage;

        // Check if the cohortId is already in the cohortVisible array
        if (fetchedModule.cohortVisible.includes(cohortId)) {
            // If it exists, use $pull to remove it (toggle off visibility)
            updateOperation = { $pull: { cohortVisible: cohortId } };
            successMessage = "Cohort visibility toggled OFF (cohort removed)";
        } else {
            // If it doesn't exist, use $addToSet to add it (toggle on visibility)
            updateOperation = { $addToSet: { cohortVisible: cohortId } };
            successMessage = "Cohort visibility toggled ON (cohort added)";
        }

        // Perform the update atomically
        const updatedModule = await Module.findByIdAndUpdate(
            id,
            updateOperation,
            { new: true, runValidators: true }
        )
            .populate('cohortVisible', 'name');

        return res.status(200).json({
            message: successMessage,
            payload: updatedModule
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" })
    }
}



export const editModule = async (req, res) => {
    try {
        const id = req.params.id;

        const { name, index } = req.body;

        const fetchedModule = await Module.findById(id);

        console.log(fetchedModule)

        if (!fetchedModule) return res.status(404).json({ message: 'requested module not found' })

        const module = await Module.findByIdAndUpdate(id, {
            $set: {
                name, index
            }
        }, {
            new: true
        });

        return res.status(200).json({
            payload: module
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" })
    }
}