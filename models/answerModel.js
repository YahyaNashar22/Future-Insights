import mongoose from "mongoose";

const { Schema, model } = mongoose;


const answerSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        assessmentId: {
            type: Schema.Types.ObjectId,
            ref: "Assessment",
            required: true,
        },
        answer: {
            type: String,
            required: true,
        },
        grade: {
            type: String,
            required: false,
            default: "Not Graded Yet"
        },
    },
    {
        timestamps: true
    }
);

const Answer = model("Answer", answerSchema);
export default Answer;
