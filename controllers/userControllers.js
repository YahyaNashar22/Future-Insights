import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { createToken, verifyToken } from "../utils/token.js";
import Course from "../models/courseModel.js";
import Class from "../models/classModel.js";


export const signup = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;


        if (!fullname || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            fullname,
            email,
            password: hashedPassword,
            role: "student"
        });
        await user.save();

        // Generate JWT token
        const token = createToken(user);

        res.status(201).json({
            message: "user created successfully",
            payload: token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" })
    }
}

export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;


        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email does not exist" });
        }

        // Compare the entered password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = createToken(user);

        res.status(200).json({
            message: "Login successful",
            payload: token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" })
    }
}

export const teacherSignup = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;


        if (!fullname || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            fullname,
            email,
            password: hashedPassword,
            role: "teacher"
        });
        await user.save();

        // Generate JWT token
        const token = createToken(user);

        res.status(201).json({
            message: "user created successfully",
            payload: token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" })
    }
}


export const getUserById = async (req, res) => {
    try {

        // Get the token from the authorization header
        const token = req.headers.authorization?.split(' ')[1]; // Bearer token

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify the token
        const decoded = verifyToken(token);

        // Find the user by the decoded user ID
        const user = await User.findById(decoded.payload._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the user data (excluding sensitive information like password)
        res.status(200).json({ payload: decoded.payload });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" })
    }
}

export const unlockVideo = async (req, res) => {
    try {
        const { courseId, userId, videoIndex } = req.body;
        const course = await Course.findById(courseId);
        const user = await User.findById(userId);

        // Check if the user is enrolled in the course
        if (!course.enrolledUsers.includes(userId)) {
            return res.status(403).json({ message: "User is not enrolled in this course." });
        }

        // Find if there are any unlocked videos for the course already
        const existingRecord = user.unlockedVideos.find(
            (record) => record.courseId.toString() === courseId
        );

        // If there's no existing record, create a new one for this course
        if (!existingRecord) {
            user.unlockedVideos.push({ courseId, videos: [videoIndex] });
        } else {
            // If the record exists, update it by adding the new unlocked video
            existingRecord.videos.push(videoIndex);
        }

        await user.save();

        return res.status(200).json({ message: "Video unlocked successfully." });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" })
    }
}


export const getUnlockedVideos = async (req, res) => {
    try {
        const { userId, courseId } = req.query;

        const user = await User.findById(userId);
        const unlockedCourse = user.unlockedVideos.find(
            (record) => record.courseId.toString() === courseId
        );


        if (!unlockedCourse) {
            return res.status(200).json({ unlockedVideos: [] });
        }


        return res.status(200).json({ unlockedVideos: unlockedCourse.videos });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" })
    }
}

export const enrollCourse = async (req, res) => {
    const { userId, courseId } = req.body;

    try {
        // Find the course by its ID
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Check if the user is already enrolled in the course
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the user is already enrolled
        const alreadyEnrolled = course.enrolledUsers.some(
            (user) => user.toString() === userId
        );
        if (alreadyEnrolled) {
            return res.status(400).json({ message: "User already enrolled" });
        }

        // Add the user to the course's enrolledUsers array
        course.enrolledUsers.push(userId);
        await course.save();

        // Add the first video to the user's unlockedVideos array (for this specific course)
        const userUnlockedVideos = user.unlockedVideos.find(
            (entry) => entry.courseId.toString() === courseId
        );

        if (userUnlockedVideos) {
            // If the course already exists in unlockedVideos, just add the first video
            userUnlockedVideos.videos.push(0);
        } else {
            // If the course does not exist in unlockedVideos, create a new entry for it
            user.unlockedVideos.push({
                courseId: courseId,
                videos: [0], // Unlock the first video by default
            });
        }

        await user.save();

        return res.status(200).json({ message: "Enrolled successfully", course });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



export const enrollClass = async (req, res) => {
    const { userId, courseId } = req.body;

    try {
        // Find the course by its ID
        const cls = await Class.findById(courseId);
        if (!cls) {
            return res.status(404).json({ message: "Class not found" });
        }

        // Check if the user is already enrolled in the class
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the user is already enrolled
        const alreadyEnrolled = cls.enrolledUsers.some(
            (user) => user.toString() === userId
        );
        if (alreadyEnrolled) {
            return res.status(400).json({ message: "User already enrolled" });
        }

        // Add the user to the course's enrolledUsers array
        cls.enrolledUsers.push(userId);
        await cls.save();

        await user.save();

        return res.status(200).json({ message: "Enrolled successfully", cls });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const getEnrolledClasses = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const classes = await Class.find({
            enrolledUsers: userId
        }).populate("teacher category");

        return res.status(200).json({ message: "fetched successfully", payload: classes });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


export const getEnrolledCourses = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const courses = await Course.find({
            enrolledUsers: userId
        }).populate("teacher category");

        return res.status(200).json({ message: "fetched successfully", payload: courses });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


export const sendForgotPasswordOTP = async (req, res) => {
    try {
        const { email } = req.body;

        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

        await User.findOneAndUpdate(
            { email },
            { passwordResetOTP: otp, passwordResetExpires: expiresAt },
            { new: true, upsert: true }
        );

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Reset Your Password - OTP Verification",
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px; margin: auto; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #333;">Password Reset Request</h2>
            <p style="font-size: 16px; color: #555;">
                Hello, <br><br>
                You recently requested to reset your password. Use the OTP below to proceed with the reset:
            </p>
            <div style="background: #f8f8f8; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; color: #222; border-radius: 5px;">
                ${otp} 
            </div>
            <p style="font-size: 14px; color: #777; margin-top: 20px;">
                This OTP is valid for only 5 minutes. If you did not request a password reset, please ignore this email.
            </p>
            <p style="font-size: 14px; color: #777;">Regards, <br>Future Insights</p>
        </div>
    `,
        };

        const info = await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Email sent!", info });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}



export const resetPassword = async (req, res) => {
    try {

        const { email, password, otp } = req.body;

        const user = await User.findOne({ email });

        if (!user || !user.passwordResetOTP || !user.passwordResetExpires) {
            res.status(403).json({ message: "OTP not found or expired" });
        }

        if (user.passwordResetExpires < new Date()) {
            res.status(403).json({ message: "OTP has expired" });
        }

        if (user.passwordResetOTP !== otp) {
            res.status(403).json({ message: "Invalid OTP" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword;

        // Clear OTP fields
        user.passwordResetOTP = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        return res.status(200).json({ message: "Password reset successful!" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}