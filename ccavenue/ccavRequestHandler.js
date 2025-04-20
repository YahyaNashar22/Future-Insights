import { encrypt } from './Crypto.js';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ccavRequestHandler = (req, res) => {
    const data = req.body;
    const merchantData = Object.keys(data)
        .map(key => `${key}=${data[key]}`)
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
            <form id="redirectForm" method="post" name="redirect" action="${process.env.CCAVENUE_URL}">
                <input type="hidden" name="encRequest" value="${encryptedData}">
                <input type="hidden" name="access_code" value="${process.env.ACCESS_CODE}">
            </form>
            <script>document.redirectForm.submit();</script>
        </body>
        </html>
    `);
    res.end();
};
