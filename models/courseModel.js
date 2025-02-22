import mongoose from "mongoose";
import slugify from "slugify";

const { Schema, model } = mongoose;


const courseSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
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
        },
        duration: {
            type: Number,
            required: true,
        },
        discount: {
            type: Number,
            required: true,
        },
        content: [{
            type: String,
            required: true,
        }],
        teacher: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        enrolledUsers: [{
            type: Schema.Types.ObjectId,
            ref: "User",
        }],
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
courseSchema.pre("save", function (next) {
    if (this.isModified("title")) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});

const Course = model("Course", courseSchema);
export default Course;
