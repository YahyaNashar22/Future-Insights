import Class from '../models/classModel.js';
import User from '../models/userModel.js';
import { decrypt } from './Crypto.js';

const enrollClass = async (courseId, userId) => {
    try {
        // Find the course by its ID
        const cls = await Class.findById(courseId);
        if (!cls) {
            throw new Error("Class not found");
        }

        // Check if the user is already enrolled in the class
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        // Check if the user is already enrolled
        const alreadyEnrolled = cls.enrolledUsers.some(
            (user) => user.toString() === userId
        );
        if (alreadyEnrolled) {
            throw new Error("User already enrolled");
        }

        // Add the user to the course's enrolledUsers array
        cls.enrolledUsers.push(userId);
        await cls.save();

        await user.save();

        return { success: true, cls };
    } catch (error) {
        console.error(error);
        return { success: false, message: error.message };
    }
}

export const ccavResponseHandler = async (req, res) => {
    console.log("Received CCAvenue response:", req.body);
    const encryptedResponse = req.body.encResp;

    try {
        const decrypted = decrypt(encryptedResponse);

        const params = Object.fromEntries(decrypted.split('&').map(pair => pair.split('=')));

        const courseId = params.merchant_param1;
        console.log("courseId: ", courseId);

        const userId = params.merchant_param2;
        console.log("userId: ", userId);

        const courseSlug = params.merchant_param3;
        console.log("courseSlug: ", courseSlug);

        const orderStatus = params.order_status;
        console.log("Order Status:", orderStatus);

        if (orderStatus === "Failure") {
            // const redirectUrl = `${process.env.CLIENT_URL}`;
            // res.redirect(redirectUrl);
            await enrollClass(courseId, userId);
            const redirectUrl = `${process.env.CLIENT_URL}/course-catalogue/class/${courseSlug}`;
            res.redirect(redirectUrl);
        } else {
            await enrollClass(courseId, userId);
            const redirectUrl = `${process.env.CLIENT_URL}/course-catalogue/class/${courseSlug}`;
            res.redirect(redirectUrl);
        }

    } catch (err) {
        console.error("Decryption error:", err);
        res.status(500).send("Something went wrong.");
    }
};
