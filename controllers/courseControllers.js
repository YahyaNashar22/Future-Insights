import Course from "../models/courseModel.js";


export const createCourse = async (req, res) => {
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
        const existingCourse = await Course.findOne({ title });
        if (existingCourse) {
            return res.status(400).json({ message: "A course with this title already exists" });
        }

        // Handle file uploads (thumbnail)
        const thumbnail = req.files?.thumbnail ? req.files.thumbnail[0].filename : null;

        // Handle file uploads (demo)
        const demo = req.files?.demo ? req.files.demo[0].filename : null;

        // Handle file uploads (videos)
        const content = req.files?.videos
            ? req.files.videos.map(file => ({
                title: file.originalname,
                url: file.filename,
            }))
            : [];

        // Create course instance
        const newCourse = new Course({
            title,
            description,
            thumbnail,
            demo,
            duration,
            price,
            content, // Array of video objects
            teacher,
            category,
        });

        await newCourse.save();
        res.status(201).json({ message: "Course created successfully", payload: newCourse });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" })
    }
}


export const getCoursesByCategory = async (req, res) => {
    try {
        const { categoryId } = req.body;

        const courses = await Course.find({ category: categoryId });

        res.status(200).json({
            message: "fetched successfully",
            payload: courses
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" })
    }
}


export const getCourseBySlug = async (req, res) => {
    try {
        const slug = req.params.slug;

        const course = await Course.findOne({ slug });

        res.status(200).json({
            message: "fetched successfully",
            payload: course
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" })
    }
}