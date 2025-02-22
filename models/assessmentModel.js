import mongoose from "mongoose";
import slugify from "slugify";

const { Schema, model } = mongoose;


const assessmentSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        class: {
            type: Schema.Types.ObjectId,
            ref: "Class",
            required: true,
        },
        type: {
            type: String,
            enum: ["assignment", "assessment"],
            default: "assessment",
            required: true,
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

// Middleware to generate slug before saving
assessmentSchema.pre("save", function (next) {
    if (this.isModified("title")) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});

const Assessment = model("Assessment", assessmentSchema);
export default Assessment;
