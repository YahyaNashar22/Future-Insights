import Cohort from "../models/cohortModel.js";

export const createCohort = async (req, res) => {
    try {
        const { name, classId, isDefault } = req.body;

        if (isDefault) {
            await Cohort.updateMany(
                { classId },
                { $set: { isDefault: false } }
            );
        }

        const cohort = new Cohort({ name, classId, isDefault });
        await cohort.save();
        return res.status(201).json({
            message: "cohort created successfully",
            payload: cohort
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" })
    }
}

export const editCohort = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, isDefault } = req.body;

        const existing = await Cohort.findById(id);
        if (!existing) {
            return res.status(404).json({ message: "cohort not found" });
        }

        // If making this cohort the default → clear other defaults in same class
        if (isDefault === true) {
            await Cohort.updateMany(
                { classId: existing.classId, _id: { $ne: id } },
                { $set: { isDefault: false } }
            );
        }

        const cohort = await Cohort.findByIdAndUpdate(id, { $set: { name, isDefault } }, { new: true, runValidators: true });
        return res.status(200).json({
            message: "cohort updated successfully",
            payload: cohort
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" })
    }
}

export const deleteCohort = async (req, res) => {
    try {
        const id = req.params.id;

        const cohort = await Cohort.findByIdAndDelete(id);
        return res.status(200).json({
            message: "cohort deleted successfully",
            payload: cohort
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" })
    }
}


export const assignUsersToCohort = async (req, res) => {
    try {
        const id = req.params.id;
        const { usersToAdd = [], usersToRemove = [] } = req.body;

        const updateOperation = {};

        // 1. Add users using $addToSet (prevents adding duplicates)
        if (usersToAdd.length > 0) {
            updateOperation.$addToSet = { cohortUsers: { $each: usersToAdd } };
        }

        // 2. Remove users using $pull (removes all instances of the user ID)
        if (usersToRemove.length > 0) {
            updateOperation.$pull = { cohortUsers: { $in: usersToRemove } };
        }

        // If there's nothing to do, return a 400 error
        if (Object.keys(updateOperation).length === 0) {
            return res.status(400).json({ message: "No users provided to add or remove" });
        }

        const cohort = await Cohort.findByIdAndUpdate(
            id,
            updateOperation,
            { new: true, runValidators: true }
        )
            .populate('cohortUsers', 'fullname email');


        if (!cohort) {
            return res.status(404).json({ message: "Cohort not found" });
        }

        return res.status(200).json({
            message: "Users assigned/de-assigned successfully",
            payload: cohort
        });
    } catch (error) {
        console.error(error);

        if (error.name === 'CastError' && error.path === 'cohortUsers') {
            return res.status(400).json({ message: "One or more provided user IDs are invalid." });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }

        res.status(500).json({ message: "Something went wrong during user assignment" });
    }
}

export const getCohorts = async (req, res) => {
    try {
        const classId = req.params.classId;

        const cohorts = await Cohort.find({ classId: classId }).populate("cohortUsers");
        return res.status(200).json({
            message: "cohorts found successfully",
            payload: cohorts
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" })
    }
}
export const getCohortById = async (req, res) => {
    try {
        const id = req.params.id;

        const cohort = await Cohort.findById(id).populate("cohortUsers");
        return res.status(200).json({
            message: "cohort found successfully",
            payload: cohort
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" })
    }
}
