import mongoose from "mongoose";

const { Schema, model } = mongoose;


const moduleSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        index: {
            type: Number,
            required: false,
            default: 0
        },
        classId: {
            type: Schema.Types.ObjectId,
            ref: "Class",
        },
        courseId: {
            type: Schema.Types.ObjectId,
            ref: "Course",
        },
        visible: {
            type: Boolean,
            default: true
        },
        cohortVisible: [{
            type: Schema.Types.ObjectId,
            ref: "Cohort",
        }],
    },
    {
        timestamps: true
    }
);

// Custom validation to ensure at least one of classId or courseId is provided
moduleSchema.pre("validate", function (next) {
    if (!this.classId && !this.courseId) {
        return next(
            new Error("Module must be associated with either a classId or a courseId.")
        );
    }
    next();
});

const Module = model("Module", moduleSchema);
export default Module;
