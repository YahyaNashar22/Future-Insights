import mongoose from "mongoose";

const { Schema, model } = mongoose;


const recordingSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            default: "Recorded Session Link"
        },
        link: {
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

const Recording = model("Recording", recordingSchema);
export default Recording;
