import mongoose from "mongoose";

const { Schema, model } = mongoose;


const liveLinkSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            default: "Live Session Link"
        },
        startsAt: {
            type: Date,
            required: true
        },
        endsAt: {
            type: Date,
            required: true
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

const LiveLink = model("LiveLink", liveLinkSchema);
export default LiveLink;
