import mongoose from "mongoose";

const { Schema, model } = mongoose;


const cohortSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        cohortUsers: [{
            type: Schema.Types.ObjectId,
            ref: "User",
        }],
        classId: {
            type: Schema.Types.ObjectId,
            ref: "Class",
        },
        isDefault: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    {
        timestamps: true
    }
);


const Cohort = model("Cohort", cohortSchema);
export default Cohort;
