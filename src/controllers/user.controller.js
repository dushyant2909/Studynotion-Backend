import { User } from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";

import validator from "validator"
import otpGenerator from "otp-generator"
import jwt from "jsonwebtoken"
import { OTP } from "../models/otp.model";

// Method to generate access and refresh token
const generateAccessAndRefreshToken = async (userId) => {
    try {
        // S-1 Find a user from given userId
        const user = await User.findOne(userId);

        if (!user)
            throw new ApiError(401, "User not found")

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
    const { email } = req.body;

    if (!email)
        throw new ApiError(400, "Email is required for otp")

    if (!validator.isEmail(email))
        throw new ApiError(400, "Invalid email format")

    // Check if user already registered
    const user = await User.findOne(email);

    if (user)
        throw new ApiError(401, "User already registered")

    // Generate otp
    const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false
    })

    // Store otp
    const otpStoreResponse = await OTP.create({
        email,
        otp
    })

    if (!otpStoreResponse)
        throw new ApiError(500, "Error in storing otp to Database")

    // Return response successfully
    new ApiResponse(201, otp, "OTP Generated successfully")
})

const signup = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword, accountType, otp } = req.body
    //otp will be provided by user for validation in req.body

    if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
        throw new ApiError(403, "All fields are required")
    }

    if (!validator.isEmail(email))
        throw new ApiError(400, "Invalid email format")

    if (password !== confirmPassword)
        throw new ApiError(400, "Password and confirm password do not match")

    const user = await User.findOne(email);
})


export { generateAccessAndRefreshToken, sendOTP, signup }