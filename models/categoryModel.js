import mongoose from "mongoose";
import slugify from "slugify";

const { Schema, model } = mongoose;


const categorySchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        arabicTitle: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            required: false,
        },
        arabicDescription: {
            type: String,
            required: false,
        },
        image: {
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

// Middleware to generate slug before saving
categorySchema.pre("save", function (next) {
    if (this.isModified("title")) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});

const Category = model("Category", categorySchema);
export default Category;
