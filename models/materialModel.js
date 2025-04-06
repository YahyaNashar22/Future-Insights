import mongoose from "mongoose";

const { Schema, model } = mongoose;


const materialSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            default: "Module Material"
        },
        content: {
            type: String,
            required: true,
        },
        moduleId: {
            type: Schema.Types.ObjectId,
            ref: "Module",
            required: true,
        },
    },
    {
        timestamps: true
    }
);

const Material = model("Material", materialSchema);
export default Material;
