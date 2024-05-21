import { Course } from "../models/course.model.js";
import { Tags } from "../models/tags.model.js";
import { User } from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinaryFileUplod.js";

const createCourse = asyncHandler(async (req, res) => {
    try {
        // Get all required fields from request body
        const {
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            tag, // Tag is an object id
            status,
            language,
            level
        } = req.body;

        // Get thumbnail image from request files
        const thumbnail = req.file;
        // console.log("Thumbnail::", thumbnail);

        // validation
        if (
            !courseName ||
            !courseDescription ||
            !whatYouWillLearn ||
            !price ||
            !thumbnail ||
            !language ||
            !level ||
            !thumbnail
        ) {
            return res.status(400).json({
                success: false,
                message: "All Fields are required",
            });
        }

        if (!status || status === undefined) {
            status = "Draft";
        }

        const userId = req.user?._id
        // Check if user is an instructor and get details
        const instructorDetails = await User.findById(userId, {
            accountType: "Instructor",
        });

        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "Instructor Details Not Found",
            });
        }

        // Check if the given tag is valid or not
        const tagDetails = await Tags.findById({ _id: tag })

        if (!tagDetails)
            return res.status(400).json({
                success: "false",
                message: "Tag details not found"
            })

        // Upload image to cloudinary
        const thumbnailImage = await uploadOnCloudinary(thumbnail.path)

        if (!thumbnailImage) {
            return res.status(401).json({
                success: "false",
                message: "Failed to upload thumbnail to cloudinary",
            })
        }
        // console.log("Thumbnail Image::", thumbnailImage)

        // Create an entry in DB
        const course = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn,
            price,
            thumbnail: thumbnailImage.secure_url,
            tag,
            status,
            language,
            level
        })

        return res.status(200).json(
            new ApiResponse(200, course, "Course created in DB")
        )
    } catch (error) {
        console.log("Error in create course controller::", error);;
        return res.status(500).json({
            success: "false",
            message: "Something went wrong in Contact us controller",
            error: error.message
        })
    }
})

export { createCourse }