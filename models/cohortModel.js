import mongoose from "mongoose";

const { Schema, model } = mongoose;


const cohortSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        cohortUsers: [{
            type: Schema.Types.ObjectId,
            ref: "User",
        }],
        classId: {
            type: Schema.Types.ObjectId,
            ref: "Class",
        },
        isDefault: {
            type: Boolean,
            required: true,
            default: false
        },
        isClosed: {
            type: Boolean,
            required: false,
            default: false
        },
        autoCloseDays: {
            type: Number,
            required: false,
            min: 1
        },
        closeAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

// Run when cohort is created or updated
cohortSchema.pre("save", function (next) {
    if (this.autoCloseDays && !this.closeAt) {
        const closeDate = new Date(this.createdAt);
        closeDate.setDate(closeDate.getDate() + this.autoCloseDays);
        this.closeAt = closeDate;
    }
    next();
});

// If autoCloseDays changes later:
cohortSchema.pre("findOneAndUpdate", function (next) {
    const update = this.getUpdate();

    if (update?.autoCloseDays) {
        update.closeAt = new Date(
            Date.now() + update.autoCloseDays * 24 * 60 * 60 * 1000
        );
    }

    next();
});

const Cohort = model("Cohort", cohortSchema);
export default Cohort;
