import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const workingKey = process.env.WORKING_KEY; // 32-char working key from CCAvenue

export function encrypt(plainText) {
    const m = crypto.createHash('md5');
    m.update(workingKey);
    const key = m.digest(); // Create 16-byte key
    const iv = Buffer.from([
        0x00, 0x01, 0x02, 0x03,
        0x04, 0x05, 0x06, 0x07,
        0x08, 0x09, 0x0a, 0x0b,
        0x0c, 0x0d, 0x0e, 0x0f
    ]); // Fixed IV

    const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

export function decrypt(encText) {
    const m = crypto.createHash('md5');
    m.update(workingKey);
    const key = m.digest(); // Create 16-byte key
    const iv = Buffer.from([
        0x00, 0x01, 0x02, 0x03,
        0x04, 0x05, 0x06, 0x07,
        0x08, 0x09, 0x0a, 0x0b,
        0x0c, 0x0d, 0x0e, 0x0f
    ]); // Same fixed IV

    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    let decrypted = decipher.update(encText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
