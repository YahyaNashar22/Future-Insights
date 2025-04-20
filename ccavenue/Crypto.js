import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const workingKey = process.env.WORKING_KEY; // 32-char key
const algorithm = 'aes-256-cbc'; // ← Use 256-bit encryption
const iv = Buffer.alloc(16, 0); // 16-byte IV filled with zeros

export function encrypt(plainText) {
    const cipher = crypto.createCipheriv(algorithm, workingKey, iv);
    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

export function decrypt(encText) {
    const decipher = crypto.createDecipheriv(algorithm, workingKey, iv);
    let decrypted = decipher.update(encText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
