import mongoose from "mongoose";

const { Schema, model } = mongoose;


const certificateSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        classId: {
            type: Schema.Types.ObjectId,
            ref: "Class",
            required: false,
        },
        courseId: {
            type: Schema.Types.ObjectId,
            ref: "Course",
            required: false,
        },
        url: {
            type: String,
        },
        issued_on: {
            type: String,

        },
        name: {
            type: String,

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



const Certification = model("Certification", certificateSchema);
export default Certification;
