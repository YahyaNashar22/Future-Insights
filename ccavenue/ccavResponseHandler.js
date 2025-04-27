import { decrypt } from './Crypto.js';

export const ccavResponseHandler = (req, res) => {
    console.log("Received CCAvenue response:", req.body);
    const encryptedResponse = req.body.encResp;

    try {
        console.log('Encrypted Response:', encryptedResponse);

        const decrypted = decrypt(encryptedResponse);
        console.log("Decrypted Response:", decrypted);

        const params = Object.fromEntries(decrypted.split('&').map(pair => pair.split('=')));
        console.log("Decrypted params:", params); 

        const orderStatus = params.order_status;
        console.log("Order Status:", orderStatus);
        
        // Optional: Save to DB

        // Redirect to your React frontend with result
        const redirectUrl = `http://localhost:5173/payment-status?status=${orderStatus}`;
        res.redirect(redirectUrl);
    } catch (err) {
        console.error("Decryption error:", err);
        res.status(500).send("Something went wrong.");
    }
};
