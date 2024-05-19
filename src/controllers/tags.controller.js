import { Tags } from "../models/tags.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTag = asyncHandler(async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !description)
            return res.status(400).json({
                success: false,
                message: "All fileds are required",
            });

        const tagDetails = await Tags.create({
            name,
            description
        })

        return res.status(200).json(
            new ApiResponse(200, tagDetails, "Tags created successfully")
        )
    } catch (error) {
        console.log("Error in creating tags controller::", error);
        return res.status(400).json({
            success: "false",
            message: "Something went wrong while creating tag",
            error: error.message
        })
    }
})

const showAllTags = asyncHandler(async (req, res) => {
    try {
        const allTags = await Tags.find({},
            {
                name: true,
                description: true
            })

        return res.status(200).json(
            new ApiResponse(200, allTags, "All tags fetched successfully")
        )

    } catch (error) {
        console.log("Error in showing all tags controller::", error);
        return res.status(400).json({
            success: "false",
            message: "Something went wrong while showing all tags",
            error: error.message
        })
    }
})

export {
    createTag,
    showAllTags
}