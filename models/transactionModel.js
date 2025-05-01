import mongoose from "mongoose";

const { Schema, model } = mongoose;


const transactionSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        classId: {
            type: Schema.Types.ObjectId,
            ref: "Class",
            required: false,
        },
        courseId: {
            type: Schema.Types.ObjectId,
            ref: "Course",
            required: false,
        },
        amount: {
            type: String,
            required: true,
        },
        referenceLink: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true
    }
);

const Transaction = model("Transaction", transactionSchema);
export default Transaction;
