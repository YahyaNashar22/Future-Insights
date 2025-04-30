import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { createToken, verifyToken } from "../utils/token.js";
import Course from "../models/courseModel.js";
import Class from "../models/classModel.js";
import generateOTP from "../utils/generateOTP.js";
import transporter from "../utils/nodemailerTransporter.js";
import sendVerificationEmailHelper from "../utils/sendVerificationHelper.js";


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

        // create a token for email verification
        const verificationToken = jwt.sign({ id: user._id }, process.env.SECRET_TOKEN, {
            expiresIn: "1d",
        });

        const verificationLink = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

        //  Send verification email
        await sendVerificationEmailHelper(user, verificationLink);


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

        // Check if account is not verified and older than 3 days
        const accountAgeInMs = Date.now() - new Date(user.createdAt).getTime();
        const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;

        if (!user.verified && accountAgeInMs > threeDaysInMs) {
            return res.status(403).json({
                message: "Account verify your account before you continue",
            });
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
        return res.status(500).json({ message: "Something went wrong, please try again later" });
    }
}



export const resetPassword = async (req, res) => {
    try {

        const { email, password, otp } = req.body;

        const user = await User.findOne({ email });

        if (!user || !user.passwordResetOTP || !user.passwordResetExpires) {
            return res.status(403).json({ message: "OTP not found or expired" });
        }

        if (user.passwordResetExpires < new Date()) {
            return res.status(403).json({ message: "OTP has expired" });
        }

        if (user.passwordResetOTP !== otp) {
            return res.status(403).json({ message: "Invalid OTP" });
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
        return res.status(500).json({ message: "Something went wrong, please try again later" });
    }
}


export const sendVerification = async (req, res) => {
    try {
        const { email } = req.body;

        // 1. Find the user
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // 2. Generate verification token
        const token = jwt.sign({ id: user._id }, process.env.SECRET_TOKEN, {
            expiresIn: "1d", // Link valid for 1 day
        });

        // 3. Create verification link
        const verificationLink = `${process.env.CLIENT_URL}/verify-email/${token}`;


        // 4. Email content
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Verify your email",
            html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px; margin: auto; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #333;">Verify Your Email</h2>
            <p style="font-size: 16px; color: #555;">
              Hello ${user.fullname},<br><br>
              Please click the button below to verify your email:
            </p>
            <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #252161; color: white; text-decoration: none; border-radius: 5px;">
              Verify Email
            </a>
            <p style="font-size: 14px; color: #777;">If you didn't request this, you can ignore this email.</p>
            <p style="font-size: 14px; color: #777;">Regards,<br>Future Insights</p>
          </div>
        `,
        };

        const info = await transporter.sendMail(mailOptions);

        // 5. Send email
        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: "Verification email sent" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong, please try again later" });
    }
}



export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        // 1. Verify the token
        const decoded = jwt.verify(token, process.env.SECRET_TOKEN);

        // 2. Find the user by ID
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: "Invalid verification link" });
        }

        // 3. Check if already verified
        if (user.verified) {
            return res.status(400).json({ message: "Account verified successfully" });
        }

        // 4. Update user to verified
        user.verified = true;
        await user.save();

        return res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        console.error("Email verification error:", error);
        return res.status(400).json({ message: "Invalid or expired verification link" });
    }
};


export const instructorRegisterRequestEmail = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;


        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: "rami@futureinsights.ae",
            subject: "New Instructor Application Request",
            html: `
              <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #2c3e50;">Instructor Application Received</h2>
                <p style="font-size: 16px; color: #555;">
                  A new request has been submitted to become an instructor. Below are the details:
                </p>
                <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px; font-weight: bold; color: #333;">Name:</td>
                    <td style="padding: 8px; color: #555;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; font-weight: bold; color: #333;">Email:</td>
                    <td style="padding: 8px; color: #555;">${email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; font-weight: bold; color: #333;">Phone:</td>
                    <td style="padding: 8px; color: #555;">${phone}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; font-weight: bold; color: #333;">Message:</td>
                    <td style="padding: 8px; color: #555; white-space: pre-line;">${message}</td>
                  </tr>
                </table>
                <p style="font-size: 14px; color: #777; margin-top: 30px;">
                  Please review the application and follow up as necessary.
                </p>
                <p style="font-size: 14px; color: #777;">Regards,<br>Future Insights</p>
              </div>
            `,
        };
        const info = await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: "Email sent!", info });

    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Couldn't send email, please try again later" });
    }
}


export const updateProfile = async (req, res) => {
    const { userId, fullname, currentPassword, newPassword } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found." });

        // If changing password, verify current password
        if (newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ success: false, message: "Incorrect current password." });
            }
            user.password = await bcrypt.hash(newPassword, 10);
        }

        user.fullname = fullname;
        await user.save();

        res.json({ success: true, updatedUser: user });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Couldn't update profile, please try again later" });
    }
}



export const reserveCoachingSession = async (req, res) => {
    try {
        const { name, email, phone, date } = req.body;


        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: "rami@futureinsights.ae",
            subject: "New Coaching Session Request",
            html: `
              <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #2c3e50;">Coaching Session Request</h2>
                <p style="font-size: 16px; color: #555;">
                  A new request has been submitted for a coaching session. Below are the details:
                </p>
                <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px; font-weight: bold; color: #333;">Name:</td>
                    <td style="padding: 8px; color: #555;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; font-weight: bold; color: #333;">Email:</td>
                    <td style="padding: 8px; color: #555;">${email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; font-weight: bold; color: #333;">Phone:</td>
                    <td style="padding: 8px; color: #555;">${phone}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; font-weight: bold; color: #333;">Date:</td>
                    <td style="padding: 8px; color: #555; white-space: pre-line;">
                     ${new Date(date).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            })}
                    </td>
                  </tr>
                </table>
                <p style="font-size: 14px; color: #777; margin-top: 30px;">
                  Please review the request and follow up as necessary.
                </p>
                <p style="font-size: 14px; color: #777;">Regards,<br>Future Insights</p>
              </div>
            `,
        };
        const info = await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: "Email sent!", info });

    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Couldn't send email, please try again later" });
    }
}


export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();

        return res.status(200).json({
            payload: users
        })
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Couldn't send email, please try again later" });
    }
}


export const changeRole = async (req, res) => {
    try {
        const id = req.params.id;
        const { superId, role } = req.body;

        const isSuper = await User.findById(superId);
        if (!isSuper) return res.status(404).json({ message: "only super admins are allowed!" });

        const user = await User.findByIdAndUpdate(id, {
            $set: { role }
        }, { new: true });

        return res.status(200).json({
            payload: user
        })
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Couldn't send email, please try again later" });
    }
}