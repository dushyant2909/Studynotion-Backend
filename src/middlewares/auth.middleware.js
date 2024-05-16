import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js";

// Take user details from access token and find user
// Set user to request

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // Token ka access lena h
        // Request ke paas cookies ka access h

        const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!accessToken) {
            return res.status(401).json({
                status: "false",
                message: "Unauthorised user"
            })
        }

        // If token present then check using jwt
        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user)
            return new ApiError(401, "Invalid access token")

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in verifyJWT::", error);
        throw new ApiError(401, error?.message || "Invalid access token");
    }
})

// Authorization middleware
export const isStudent = asyncHandler(async (req, res, next) => {
    try {
        if (req.user.accountType !== "Student") {
            return new ApiError(401, "This protected route is only available to students")
        }
        next();
    } catch (error) {
        console.log("Error in matching student role: ", error?.message);
        throw new ApiError(500, error?.message || "Error in matching Student role");
    }
})

export const isInstructor = asyncHandler(async (req, res, next) => {
    try {
        if (req.user.accountType !== "Instructor") {
            return new ApiError(401, "This protected route is only available to instructor")
        }
        next();
    } catch (error) {
        console.log("Error in matching instructor role:: ", error?.message);
        throw new ApiError(500, error?.message || "Error in matching Instructor role");
    }
})

export const isAdmin = asyncHandler(async (req, res, next) => {
    try {
        if (req.user.accountType !== "Admin") {
            return new ApiError(401, "This protected route is only available to admin")
        }
        next();
    } catch (error) {
        console.log("Error in matching Admin role: ", error?.message);
        throw new ApiError(500, error?.message || "Error in matching Admin role");
    }
})