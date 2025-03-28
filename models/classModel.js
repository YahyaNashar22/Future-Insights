import mongoose from "mongoose";
import slugify from "slugify";

const { Schema, model } = mongoose;

// TODO: Maybe add a subscription system


const classSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        thumbnail: {
            type: String,
            required: true,
        },
        demo: {
            type: String,
            required: false,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        duration: {
            type: String,
            required: true,
        },
        discount: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        teacher: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        enrolledUsers: [{
            type: Schema.Types.ObjectId,
            ref: "User",
        }],
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
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
classSchema.pre("save", function (next) {
    if (this.isModified("title")) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});

const Class = model("Class", classSchema);
export default Class;
