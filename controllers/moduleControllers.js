import mongoose from "mongoose";
import Module from "../models/moduleModel.js";
import User from "../models/userModel.js";
import Cohort from "../models/cohortModel.js";

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

        const user = await User.findById(userId).lean();

        if (!user) return res.status(404).json({ message: 'user not found!' })

        const baseFilter = {};
        if (classId) baseFilter.classId = classId;
        if (courseId) baseFilter.courseId = courseId;

        // Non-students: fetch all modules normally
        if (user.role !== 'student') {
            const modules = await Module.find(baseFilter)
                .sort({ index: 1, createdAt: 1 })
                .populate('cohortVisible', 'name isDefault');

            return res.status(200).json({ payload: modules });
        }

        // For students:
        if (user.role === 'student' && classId) {
            // Find cohorts of this class the student belongs to
            const cohorts = await Cohort.find({
                classId,
                cohortUsers: user._id
            }).lean();

            let filter = { ...baseFilter, visible: true };

            if (cohorts.length > 0) {
                // Student is in cohorts: only show modules where cohortVisible includes at least one of their cohorts
                const cohortIds = cohorts.map(c => c._id);
                filter = {
                    ...filter,
                    cohortVisible: {
                        $exists: true,
                        $not: { $size: 0 }, // only non-empty arrays
                        $in: cohortIds       // must include one of the student's cohorts
                    }
                };
            }

            const modules = await Module.find(filter)
                .sort({ index: 1, createdAt: 1 })
                .populate('cohortVisible', 'name isDefault');


            return res.status(200).json({ payload: modules });
        }

        // Fallback
        const modules = await Module.find(baseFilter)
            .sort({ index: 1, createdAt: 1 })
            .populate('cohortVisible', 'name isDefault');


        return res.status(200).json({ payload: modules });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong, please try again later" });
    }
};



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