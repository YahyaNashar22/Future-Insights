import mongoose from "mongoose";
import slugify from "slugify";

const { Schema, model } = mongoose;


const userSchema = new Schema(
    {
        fullname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        verified: {
            type: Boolean,
            required: true,
            default: false,
        },
        role: {
            type: String,
            required: true,
            enum: ["admin", "teacher", "student"],
            default: "student"
        },
        wishlist: [
            {
                item: {
                    type: Schema.Types.ObjectId,
                    required: true,
                    refPath: "wishlist.itemType", // Dynamic reference
                },
                itemType: {
                    type: String,
                    required: true,
                    enum: ["Class", "Course"], // Must match one of these models
                }
            }
        ],

        unlockedVideos: [
            {
                courseId: {
                    type: Schema.Types.ObjectId,
                    ref: "Course", // Reference to the Course model
                    required: true
                },
                videos: [
                    {
                        type: Number, // The index of the unlocked video
                        required: true
                    }
                ]
            }
        ],

        slug: {
            type: String,
            unique: true,
        },
    },
    {
        timestamps: true
    }
);

// Middleware to generate slug before saving
userSchema.pre("save", function (next) {
    if (this.isModified("fullname")) {
        this.slug = slugify(this.fullname + this._id, { lower: true, strict: true });
    }
    next();
});

const User = model("User", userSchema);
export default User;



// ? Example usage for wishlist:
// ?-----------------------------

//  await User.findByIdAndUpdate(userId, {
//     $push: {
//         wishlist: { item: courseId, itemType: "Course" }
//     }
// });


// await User.findByIdAndUpdate(userId, {
//     $push: {
//         wishlist: { item: classId, itemType: "Class" }
//     }
// });


// const user = await User.findById(userId).populate("wishlist.item");
// console.log(user.wishlist);
