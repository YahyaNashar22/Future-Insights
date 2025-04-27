import { encrypt } from './Crypto.js';

export const ccavRequestHandler = (req, res) => {
    const data = {
        ...req.body,
        merchant_id: process.env.MERCHANT_ID,
        redirect_url: req.body.redirect_url || process.env.REDIRECT_URL,
        cancel_url: req.body.cancel_url || process.env.CANCEL_URL,
        language: req.body.language || 'EN'
    };

    console.log("response handler data: ", data);

    const mandatoryFields = [
        'merchant_id', 'order_id', 'currency', 'amount',
        'redirect_url', 'cancel_url', 'language'
    ];

    // Validate all mandatory fields
    for (const field of mandatoryFields) {
        if (!data[field]) {
            return res.status(400).send(`Missing mandatory field: ${field}`);
        }
    }

    const merchantData = mandatoryFields
        .map(key => `${key}=${encodeURIComponent(data[key])}`)
        .join('&');

    const encryptedData = encrypt(merchantData);

    console.log("Encrypted Data:", encryptedData);
    console.log("Access Code:", process.env.ACCESS_CODE);
    console.log("Redirecting to:", process.env.CCAVENUE_URL);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(`
        <html>
        <head><title>CCAvenue Redirect</title></head>
        <body>
            <form id="redirectForm" method="post" action="${process.env.CCAVENUE_URL}">
                <input type="hidden" name="encRequest" value="${encryptedData}">
                <input type="hidden" name="access_code" value="${process.env.ACCESS_CODE}">
            </form>
            <script>document.getElementById('redirectForm').submit();</script>
        </body>
        </html>
    `);
    res.end();
};
