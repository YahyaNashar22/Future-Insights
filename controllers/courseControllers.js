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
        res.status(201).json({ message: "Course created successfully", course: newCourse });

    } catch (error) {
        res.status(500).json({ message: "something went wrong" })
    }
}