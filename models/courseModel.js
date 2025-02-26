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
            required: false,
        },
        discount: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        content: [
            {
                title: { type: String, required: true },
                url: { type: String, required: true },
            }
        ],
        teacher: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: false, // TODO: Remove when you add user model
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
courseSchema.pre("save", function (next) {
    if (this.isModified("title")) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});

const Course = model("Course", courseSchema);
export default Course;
