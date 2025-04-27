import { decrypt } from './Crypto.js';

export const ccavResponseHandler = (req, res) => {
    console.log("Received CCAvenue response:", req.body);
    const encryptedResponse = req.body.encResp;
    const courseId = req.body.course_id;

    console.log('courseId: ', courseId)


    try {
        console.log('Encrypted Response:', encryptedResponse);

        const decrypted = decrypt(encryptedResponse);
        console.log("Decrypted Response:", decrypted);

        const params = Object.fromEntries(decrypted.split('&').map(pair => pair.split('=')));
        console.log("Decrypted params:", params);

        const orderStatus = params.order_status;
        console.log("Order Status:", orderStatus);

        if (orderStatus === "Failure") {
            const redirectUrl = `${process.env.CLIENT_URL}`;
            // Redirect to your React frontend with result
            res.redirect(redirectUrl);
        } else {
            console.log('courseId: ', courseId)
        }




    } catch (err) {
        console.error("Decryption error:", err);
        res.status(500).send("Something went wrong.");
    }
};
