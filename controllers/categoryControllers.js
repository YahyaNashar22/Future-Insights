import Category from "../models/categoryModel.js";

export const createCategory = async (req, res) => {
    try {
        const { title, description } = req.body;
        const image = req.file?.filename;

        const category = new Category({
            title, description, image
        });
        await category.save();

        return res.status(201).json({
            message: "category created successfully",
            payload: category
        });

    } catch (error) {
        res.status(500).json({ message: "something went wrong" })
    }
}

export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({});

        return res.status(200).json({
            message: "categories found!",
            payload: categories
        })
    } catch (error) {
        res.status(500).json({ message: "something went wrong" })
    }
}

export const getSingleCategory = async (req, res) => {
    try {
        const slug = req.params.slug;

        const category = await Category.findOne({ slug });


        return res.status(200).json({
            message: "category found!",
            payload: category
        })
    } catch (error) {
        res.status(500).json({ message: "something went wrong" })
    }
}