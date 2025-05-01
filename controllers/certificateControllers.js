import Certification from "../models/certificateModel.js";
import Course from "../models/courseModel.js";
import User from "../models/userModel.js";

export const createCertification = async (req, res) => {
    try {
        const {
            userId,
            classId,
            courseId
        } = req.body;

        if (classId && courseId) {
            return res.status(403).json({
                message: "Cannot have a single certification for both a class and a course at the same time!"
            })
        }


        if (courseId) {
            // Fetch the course and user progress
            const course = await Course.findById(courseId);
            const user = await User.findById(userId);

            if (!course) {
                return res.status(404).json({ message: "Course not found" });
            }

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }


            // Get the user's unlocked videos for this course
            // const userProgress = user.unlockedVideos.find(entry => entry.courseId.toString() === courseId);
            // const unlockedVideos = userProgress ? userProgress.videos : [];

            // // Ensure all videos in the course are unlocked
            // if (unlockedVideos.length !== course.content.length) {
            //     return res.status(403).json({
            //         message: "You must complete all course videos before receiving a certification."
            //     });
            // }
        }

        let certification;

        if (classId) {
            const prevCert = await Certification.findOne({
                courseId,
                userId
            })

            if (prevCert) {
                return res.status(401).json({
                    message: "certification already acquired"
                })
            }

            certification = new Certification({
                userId,
                classId
            });
        }

        if (courseId) {
            const prevCert = await Certification.findOne({
                courseId,
                userId
            })

            if (prevCert) {
                return res.status(401).json({
                    message: "certification already acquired"
                })
            }

            certification = new Certification({
                userId,
                courseId
            });
        }

        await certification.save();

        return res.status(201).json({
            message: "Certification created successfully",
            payload: certification
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" })
    }
}

export const getAllCertificationsByUserId = async (req, res) => {
    try {
        const { userId } = req.body;

        const certifications = await Certification.find({ userId }).populate(["courseId", "classId"])
            .sort({ createdAt: -1 });


        return res.status(200).json({
            message: "fetched successfully",
            payload: certifications
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" })
    }
}


export const getCertificationBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const certification = await Certification.findOne({ slug }).populate({
            path: "courseId",
            populate: { path: "teacher" }
        }).populate({
            path: "classId",
            populate: { path: "teacher" }
        }).populate("userId");

        return res.status(200).json({
            message: "fetched successfully",
            payload: certification
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" })
    }
}


export const getCourseCertification = async (req, res) => {
    try {
        const { userId, courseId } = req.body;

        const certification = await Certification.findOne({
            userId,
            courseId
        });

        if (!certification) return res.status(404).json({ message: "certification not yet unlocked" })

        return res.status(200).json({ payload: certification })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" })
    }
}

export const getClassCertification = async (req, res) => {
    try {
        const { userId, classId } = req.body;

        const certification = await Certification.findOne({
            userId,
            classId
        });

        if (!certification) return res.status(404).json({ message: "certification not yet unlocked" })

        return res.status(200).json({ payload: certification })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" })
    }
}


export const certificationWebhook = async (req, res) => {
    try {
        const { email, issued_on, name, custom_id, certificate_url } = req.body;

        // Step 1: Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Step 2: Check if this certificate already exists (prevent duplicates)
        const existing = await Certification.findOne({
            userId: user._id,
            slug: `Certificate-${custom_id}`
        });

        if (existing) {
            return res.status(200).json({ message: "Certificate already recorded" });
        }

        // Step 3: Optionally find associated class or course using `custom_id`
        let classId = null;
        let courseId = null;

        if (custom_id?.startsWith("class-")) {
            const id = custom_id.replace("class-", "");
            const cls = await Class.findById(id);
            if (cls) classId = cls._id;
        }

        if (custom_id?.startsWith("course-")) {
            const id = custom_id.replace("course-", "");
            const course = await Course.findById(id);
            if (course) courseId = course._id;
        }


        // Step 4: Create certificate
        const newCert = new Certification({
            userId: user._id,
            classId,
            courseId,
            slug: `Certificate-${custom_id}`, // match custom_id from Certifier
        });

        await newCert.save();

        return res.status(201).json({ message: "Certificate recorded", payload: newCert });

    } catch (error) {
        console.log("Webhook error:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
}
