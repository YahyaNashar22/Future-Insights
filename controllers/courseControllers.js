import Course from "../models/courseModel.js";
import removeFile from "../utils/removeFile.js";


export const createCourse = async (req, res) => {
    try {
        const {
            title,
            description,
            price,
            discount,
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

        // ! BELOW CODE IS DEPRECATED BUT LEFT IN CASE OF EMERGENCY :P
        // Handle file uploads (videos)
        // const content = req.files?.videos
        //     ? req.files.videos.map(file => ({
        //         title: file.originalname,
        //         url: file.filename,
        //     }))
        //     : [];

        // const videoTitles = req.body.videoTitles;
        // const videoTitleArray = Array.isArray(videoTitles) ? videoTitles : [videoTitles];

        // const content = req.files?.videos?.map((file, i) => ({
        //     title: videoTitleArray[i] || file.originalname,
        //     url: file.filename,
        // })) || [];

        // Create course instance
        const newCourse = new Course({
            title,
            description,
            thumbnail,
            demo,
            duration,
            price,
            discount,
            // Array of video objects
            // content,
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

        const course = await Course.findOne({ slug }).populate(["teacher", "category", "enrolledUsers"]);

        res.status(200).json({
            message: "fetched successfully",
            payload: course
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" })
    }
}

export const deleteCourse = async (req, res) => {
    try {
        const id = req.params.id;


        const course = await Course.findById(id);

        // if (course.enrolledUsers.length > 0) {
        //     return res.status(400).json({
        //         message: "Cannot delete a course with active students!"
        //     })
        // }

        if (course && course.thumbnail) {
            removeFile(course?.thumbnail);
        }

        if (course && course.content.length > 0) {
            course.content.forEach(vid => {
                removeFile(vid.url)
            });
        }

        await Course.findByIdAndDelete(id);

        res.status(200).json(
            {
                message: "Course deleted successfully",
            }
        )
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" })
    }
}


export const getCoursesByTeacher = async (req, res) => {
    try {
        const { teacherId } = req.body;

        const courses = await Course.find({ teacher: teacherId }).sort({ createdAt: -1 });

        return res.status(200).json({ payload: courses })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" })
    }
}


export const updateCourse = async (req, res) => {
    try {
        const slug = req.params.slug;

        const course = await Course.findOne({ slug });

        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        const { title, description, duration, price, discount } = req.body;



        // Build videos array by pairing files and their titles
        const content = [];

        req.files.forEach((file) => {
            const match = file.fieldname.match(/videos\[(\d+)\]\.file/);
            if (match) {
                const index = match[1];
                const titleKey = `videos[${index}].title`;
                const videoTitle = req.body[titleKey];

                if (videoTitle) {
                    content.push({
                        title: videoTitle,
                        url: `uploads/videos/${file.filename}`,
                    });
                }
            }
        });

        // Look for thumbnail file
        const thumbnailFile = req.files.find(f => f.fieldname === "thumbnail");
        if (thumbnailFile) {
            course.thumbnail = thumbnailFile.filename;
        }


        // Update fields
        course.title = title ?? course.title;
        course.description = description ?? course.description;
        course.duration = duration ?? course.duration;
        course.price = price ?? course.price;
        course.discount = discount ?? course.discount;

        course.content = [...course.content, ...content];

        await course.save();

        return res.json({ success: true, payload: course });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" })
    }
}