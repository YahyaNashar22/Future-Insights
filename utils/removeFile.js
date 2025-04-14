import fs from 'fs';
import path from 'path';

function removeFile(file) {
    const filePath = path.join("uploads", file);

    try {
        fs.unlinkSync(filePath);
        console.log(`File deleted: ${filePath}`);
    } catch (error) {
        if (error.code === "ENOENT") {
            console.warn(`File not found, skipping delete: ${filePath}`);
        } else {
            console.error(`Error deleting file: ${filePath}`, error);
        }
    }
}

export default removeFile;