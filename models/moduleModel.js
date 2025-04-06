import mongoose from "mongoose";

const { Schema, model } = mongoose;


const moduleSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        classId: {
            type: Schema.Types.ObjectId,
            ref: "Class",
            required: true,
        },
    },
    {
        timestamps: true
    }
);

const Module = model("Module", moduleSchema);
export default Module;
