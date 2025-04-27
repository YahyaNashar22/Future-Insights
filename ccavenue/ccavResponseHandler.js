import Class from '../models/classModel.js';
import User from '../models/userModel.js';
import { decrypt } from './Crypto.js';

const enrollClass = async (courseId, userId, res) => {
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

        const orderStatus = params.order_status;
        console.log("Order Status:", orderStatus);

        if (orderStatus === "Failure") {
            await enrollClass(courseId, userId, res);

            const redirectUrl = `${process.env.CLIENT_URL}`;
            // Redirect to your React frontend with result
            res.redirect(redirectUrl);
        } else {
            await enrollClass(courseId, userId, res);
        }

    } catch (err) {
        console.error("Decryption error:", err);
        res.status(500).send("Something went wrong.");
    }
};
