import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Class from '../models/classModel.js';

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Script Connected to DB');

        const result = await Class.updateMany(
            { visible: { $exists: false } },
            { $set: { visible: true } }
        );

        console.log(`${result.modifiedCount} classes updated.`);
        await mongoose.disconnect();
    } catch (err) {
        console.error('Update failed:', err);
    }
};

run();
