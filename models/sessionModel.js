import mongoose from "mongoose";

const { Schema, model } = mongoose;


const sessionSchema = new Schema(
    {
        link: {
            type: String,
            required: false,
        },
        classId: {
            type: Schema.Types.ObjectId,
            ref: "Class",
            required: true,
        },

        // recording will be added after class is done
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
