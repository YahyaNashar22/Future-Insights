import Category from "../models/categoryModel.js";
import removeFile from "../utils/removeFile.js";

export const createCategory = async (req, res) => {
    try {
        const { title, description, arabicTitle, arabicDescription } = req.body;
        const image = req.file?.filename;

        const category = new Category({
            title, description, image, arabicTitle, arabicDescription
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

export const updateCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const {
            title, description, arabicTitle, arabicDescription
        } = req.body;

        const image = req.file?.filename;

        const prevCategory = await Category.findById(id);

        if (prevCategory && prevCategory.image && image) {
            removeFile(prevCategory.image);
        }

        const category = await Category.findByIdAndUpdate(
            id,
            {
                $set: {
                    title,
                    description,
                    arabicTitle,
                    arabicDescription,
                    image: image ? image : prevCategory.image
                }
            },
            {
                new: true
            }
        );

        return res.status(200).json({
            message: "categories updated!",
            payload: category
        })
    } catch (error) {
        res.status(500).json({ message: "something went wrong" })
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const id = req.params.id;

        const category = await Category.findByIdAndDelete(id);


        return res.status(200).json({
            message: "category deleted!",
            payload: category
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

export const getSingleCategoryById = async (req, res) => {
    try {
        const id = req.params.id;

        const category = await Category.findById(id);


        return res.status(200).json({
            message: "category found!",
            payload: category
        })
    } catch (error) {
        res.status(500).json({ message: "something went wrong" })
    }
}