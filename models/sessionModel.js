import mongoose from "mongoose";
import slugify from "slugify";

const { Schema, model } = mongoose;


const sessionSchema = new Schema(
    {
        link: {
            type: String,
            required: true,
        },
        class: {
            type: Schema.Types.ObjectId,
            ref: "Class",
            required: true,
        },
        recording: {
            type: String,
            required: false,
        },
        slug: {
            type: String,
            unique: true,
        },
    },
    {
        timestamps: true
    }
);

// Middleware to generate slug as "Session-<ObjectId>" before saving
sessionSchema.pre("save", function (next) {
    if (!this.slug) {
        this.slug = `Session-${this._id.toString()}`;
    }
    next();
});



const Session = model("Session", sessionSchema);
export default Session;
