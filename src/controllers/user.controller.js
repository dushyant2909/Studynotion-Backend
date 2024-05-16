import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

import validator from "validator"
import otpGenerator from "otp-generator"
import { OTP } from "../models/otp.model.js";
import { Profile } from "../models/profile.model.js";

// Method to generate access and refresh token
const generateAccessAndRefreshToken = async (userId) => {
    try {
        // S-1 Find a user from given userId
        const user = await User.findOne(userId);

        if (!user)
            return res.status(401).json({
                success: false,
                message: "User not found"
            })

        // S-2 Generate tokens from the methods defined in userSchema
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // S-3 Save refresh token in DB
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        // S-4 Return tokens
        return {
            accessToken,
            refreshToken
        }
    } catch (error) {
        throw new ApiError(500, `Something went wrong while generating tokens:: ${error?.message}`)
    }
}

const sendOTP = asyncHandler(async (req, res) => {
    try {
        const { email } = req.body;

        if (!email)
            return res.status(400).json({
                success: false,
                message: "Email is required for sending OTP"
            })

        if (!validator.isEmail(email))
            return res.status(400).json({
                success: false,
                message: "Incorrect email format"
            })

        // Check if user already registered
        const user = await User.findOne({ email });

        if (user)
            return res.status(401).json({
                success: false,
                message: "User already registered, kindly login"
            })

        // Generate otp
        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        })

        // Store otp
        await OTP.create({
            email,
            otp
        })

        // Return response successfully
        return res.status(200).json(
            new ApiResponse(200, {}, "Otp Created and stored successfully")
        )

    } catch (error) {
        console.log("Error in otp controller::", error);
        return res.status(500).json({
            success: false,
            message: "Failed to store otp, please try again"
        })
    }

})

const signup = asyncHandler(async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmPassword, accountType, otp } = req.body
        //otp will be provided by user for validation in req.body

        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                success: false,
                message: "All Fields are required",
            });
        }

        if (!validator.isEmail(email))
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            })

        if (password !== confirmPassword)
            return res.status(400).json({
                success: false,
                message: "Password and confirm password do not match"
            })

        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists. Please sign in to continue.",
            });
        }

        // Find the most recent OTP for the email
        const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);

        if (response.length === 0 || otp !== response[0].otp) {
            // OTP not found for the email or invalid
            return res.status(400).json({
                success: false,
                message: "The OTP is not valid",
            });
        }

        let approved = false;
        approved = accountType === "Instructor" ? false : true;

        // Create a fake profile for user
        const profile = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        });

        const imageSeed = `${firstName} ${lastName}`.replace(/\s+/g, '%20');

        const userResponse = await User.create({
            firstName,
            lastName,
            email,
            password,
            accountType,
            approved,
            additionalDetails: profile,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${imageSeed}`,
        })

        // Remove the password field from userResponse
        delete userResponse.password;

        return res.status(200).json(
            new ApiResponse(200, userResponse, "User registered successfully")
        )

    } catch (error) {
        console.error("Error in signup controller::", error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again.",
        });
    }

})


export { generateAccessAndRefreshToken, sendOTP, signup }