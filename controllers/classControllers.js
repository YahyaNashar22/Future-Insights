import Class from "../models/classModel.js";
import removeFile from "../utils/removeFile.js";

export const createClass = async (req, res) => {
    try {
        const {
            title,
            description,
            arabicTitle,
            arabicDescription,
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
            arabicTitle,
            arabicDescription,
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

        const fetchedClass = await Class.findOne({ slug }).populate(["teacher", "category", "enrolledUsers"]);

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

        // if (fetchedClass.enrolledUsers.length > 0) {
        //     return res.status(400).json({
        //         message: "Cannot delete a class with active students!"
        //     })
        // }

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


export const getClassesByTeacher = async (req, res) => {
    try {
        const { teacherId } = req.body;

        const classes = await Class.find({ teacher: teacherId }).sort({ createdAt: -1 });

        return res.status(200).json({ payload: classes })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" })
    }
}


export const updateClass = async (req, res) => {
    try {
        const slug = req.params.slug;

        const course = await Class.findOne({ slug });

        if (!course) {
            return res.status(404).json({ success: false, message: "Class not found" });
        }

        const { title, description, arabicTitle,
            arabicDescription,category, duration, price, discount } = req.body;


        // Look for thumbnail file
        const thumbnailFile = req.files.find(f => f.fieldname === "thumbnail");
        if (thumbnailFile) {
            course.thumbnail = thumbnailFile.filename;
        }

        // Look for demo file
        const demoFile = req.files.find(f => f.fieldname === "demo");
        if (demoFile) {
            course.demo = demoFile.filename;
        }

        console.log(demoFile);


        // Update fields
        course.title = title ?? course.title;
        course.description = description ?? course.description;
        course.arabicTitle = arabicTitle ?? course.arabicTitle;
        course.arabicDescription = arabicDescription ?? course.arabicDescription;
        course.category = category ?? course.category;
        course.duration = duration ?? course.duration;
        course.price = price !== undefined ? parseFloat(price) : course.price;
        course.discount = discount !== undefined ? parseFloat(discount) : course.discount;

        await course.save();

        return res.status(200).json({ success: true, payload: course });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" })
    }
}

export const showCertificate = async (req, res) => {
    try {
        const id = req.params.id;

        const fetchedCourse = await Class.findById(id);

        const course = await Class.findByIdAndUpdate(id, {
            $set: {
                showCertificate: !(fetchedCourse?.showCertificate)
            }
        }, {
            new: true
        });

        return res.status(200).json({
            payload: course
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" })
    }
}