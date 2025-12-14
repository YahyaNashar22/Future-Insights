
import mongoose from "mongoose";
import dotenv from "dotenv";
import Class from "../models/classModel.js";


dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Successfully Connected To Database!");
}).catch((err) => {
    console.error(err)
    console.log("Failed To Connect To Database!");
})


const result = await Class.updateMany(
    {},
    [
        {
            $set: {
                finalPrice: {
                    $ceil: {
                        $subtract: [
                            "$price",
                            { $multiply: ["$price", { $divide: ["$discount", 100] }] }
                        ]
                    }
                }
            }
        }
    ]
);

console.log("final prices rounded:", result.modifiedCount);
process.exit(0);