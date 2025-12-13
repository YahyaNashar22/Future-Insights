import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "../models/userModel.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Successfully Connected To Database!");
}).catch((err) => {
    console.error(err)
    console.log("Failed To Connect To Database!");
})

const result = await User.updateMany({}, [
    {
        $set: {
            email: {
                $toLower: { $trim: { input: "$email" } }
            }
        }
    }
]);

console.log("Emails normalized:", result.modifiedCount);
process.exit(0);
