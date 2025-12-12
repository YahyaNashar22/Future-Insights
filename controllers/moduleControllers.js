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


        const baseMatchFilter = {};
        if (classId) baseMatchFilter.classId = new mongoose.Types.ObjectId(classId);
        if (courseId) baseMatchFilter.courseId = new mongoose.Types.ObjectId(courseId);

        const pipeline = [
            { $match: baseMatchFilter }
        ];

        if (!user || user.role === 'student') {

            // Find all cohorts the student is enrolled in for this specific classId
            let studentCohortIds = [];

            if (user && classId) {
                // Query cohorts collection for matching user and class
                const cohorts = await Cohort.find({
                    classId: classId,
                    cohortUsers: userId // Checks if userId is in the cohortUsers array
                }).select('_id').lean(); // Only grab the IDs efficiently

                studentCohortIds = cohorts.map(c => c._id);
            }

            if (studentCohortIds.length > 0) {
                // Student is in one or more cohorts: filter modules that are visible to any of these cohorts
                pipeline.push({
                    $match: {
                        $expr: {
                            $gt: [{ $size: { $setIntersection: ["$cohortVisible", studentCohortIds] } }, 0]
                        }
                    }
                });
            } else {
                // Student is not in any specific cohort (or viewing a course, not a class): apply default 'visible: true' filter
                pipeline.push({
                    $match: { visible: true }
                });
            }
        }

        // If user is an instructor/admin, they see everything by default

        // 2. Add sorting stages to the pipeline
        pipeline.push(
            {
                $addFields: {
                    hasIndex: { $cond: [{ $ne: ["$index", null] }, 1, 0] }
                }
            },
            {
                $sort: {
                    hasIndex: -1,
                    index: 1,
                    createdAt: 1
                }
            },
            {
                $project: { hasIndex: 0 }
            }
        );

        const classModules = await Module.aggregate(pipeline);


        // if (!user || user.role === 'student') {
        //     filter.visible = true
        // }

        // const classModules = await Module.aggregate([
        //     { $match: filter },

        //     // Compute sorting helper
        //     {
        //         $addFields: {
        //             hasIndex: { $cond: [{ $ne: ["$index", null] }, 1, 0] }
        //         }
        //     },

        //     // Sorting logic
        //     {
        //         $sort: {
        //             hasIndex: -1,
        //             index: 1,
        //             createdAt: 1
        //         }
        //     },

        //     // Remove helper field from response
        //     {
        //         $project: { hasIndex: 0 }
        //     }
        // ]);

        const populatedModules = await Module.populate(classModules, {
            path: 'cohortVisible',
            select: 'name isDefault'
        });


        return res.status(200).json({
            payload: populatedModules
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