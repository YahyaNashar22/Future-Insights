import Class from "../models/classModel.js";

export const createClass = async (req, res) => {
    try {
        const {
            title,
            description,
            price,
            duration,
            teacher,
            category,
        } = req.body;

        // Check if a course with the same title already exists
        const existingClass = await Class.findOne({ title });
        if (existingClass) {
            return res.status(400).json({ message: "A class with this title already exists" });
        }

        // Handle file uploads (thumbnail)
        const thumbnail = req.files?.thumbnail ? req.files.thumbnail[0].filename : null;

        // Handle file uploads (demo)
        const demo = req.files?.demo ? req.files.demo[0].filename : null;

        // Create class instance
        const newClass = new Class({
            title,
            description,
            thumbnail,
            demo,
            duration,
            price,
            teacher,
            category,
        });

        await newClass.save();
        res.status(201).json(
            {
                message: "Class created successfully",
                payload: newClass
            }
        );

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" })
    }
}


export const getClassesByCategory = async (req, res) => {
    try {
        const { categoryId } = req.body;

        const classes = await Class.find({ category: categoryId });

        res.status(200).json({
            message: "fetched successfully",
            payload: classes
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" })
    }
}


export const getClassBySlug = async (req, res) => {
    try {
        const slug = req.params.slug;

        const fetchedClass = await Class.findOne({ slug });

        res.status(200).json({
            message: "fetched successfully",
            payload: fetchedClass
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" })
    }
}


export const deleteClass = async (req, res) => {
    try {
        const id = req.params.id;


        const fetchedClass = await Class.findById(id);

        if (fetchedClass.enrolledUsers.length > 0) {
            return res.status(400).json({
                message: "Cannot delete a class with active students!"
            })
        }

        if (fetchedClass && fetchedClass.thumbnail) {
            removeFile(fetchedClass.thumbnail);
        }

        await Class.findByIdAndDelete(id);

        res.status(200).json(
            {
                message: "Class deleted successfully",
            }
        )
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" })
    }
}