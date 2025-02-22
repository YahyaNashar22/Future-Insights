import mongoose from "mongoose";

const { Schema, model } = mongoose;


const certificateSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        class: {
            type: Schema.Types.ObjectId,
            ref: "Class",
            required: false,
        },
        course: {
            type: Schema.Types.ObjectId,
            ref: "Course",
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


// Middleware to generate slug as "Certificate-<ObjectId>" before saving
certificateSchema.pre("save", function (next) {
    if (!this.slug) {
        this.slug = `Certificate-${this._id.toString()}`;
    }
    next();
});



const Certificate = model("Certificate", certificateSchema);
export default Certificate;
