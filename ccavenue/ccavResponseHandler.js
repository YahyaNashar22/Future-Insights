import { decrypt } from './Crypto.js';

export const ccavResponseHandler = (req, res) => {
    const encryptedResponse = req.body.encResp;

    try {
        const decrypted = decrypt(encryptedResponse);
        const params = Object.fromEntries(decrypted.split('&').map(pair => pair.split('=')));

        const orderStatus = params.order_status;

        // Optional: Save to DB

        // Redirect to your React frontend with result
        const redirectUrl = `http://localhost:5173/payment-status?status=${orderStatus}`;
        res.redirect(redirectUrl);
    } catch (err) {
        console.error("Decryption error:", err);
        res.status(500).send("Something went wrong.");
    }
};
