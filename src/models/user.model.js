import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
// import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    accountType: {
        type: String,
        enum: ['Admin', 'Student', 'Instructor'],
        required: true
    },
    active: {
        type: Boolean,
        default: true,
    },
    approved: {
        type: Boolean,
        default: true,
    },
    additionalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
    },
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        }
    ],
    courseProgress: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CourseProgress",
        }
    ],
    image: {
        type: String,
        required: true
    },
    socials: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Social",
        },
    ],
    token: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
}, {
    timestamps: true
})

// Before saving password just hash it
userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next()
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

// Created some functions for utilities
// Compare password using bcrypt
userSchema.methods.isPasswordCorrect = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);

    } catch (error) {
        console.log("Error in comparing password::", error);
        throw error
    }
}

// Cookies-token generator
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        // Create a payload
        {
            _id: this.id,
            fullName: this.fullName,
            lastName: this.lastName,
            email: this.email,
            accountType: this.accountType
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        // Create a payload
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

// userSchema.plugin(mongooseAggregatePaginate);

export const User = mongoose.model("User", userSchema);