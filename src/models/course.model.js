import mongoose from "mongoose";

// TODO: tags ko store karana efficiently

const courseSchema = new mongoose.Schema(
    {
        courseName: {
            type: String,
            required: true
        },
        courseDescription: {
            type: String,
            required: true
        },
        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        whatYouWillLearn: {
            type: String,
            required: true
        },
        courseContent: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Section",
                // required: true
            }
        ],
        ratingAndReviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "RatingAndReview",
            }
        ],
        price: {
            type: Number,
            required: true
        },
        thumbnail: {
            type: String,
            required: true
        },
        tag: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tags",
            required: true
        },
        studentsEnrolled: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }
        ],
        instructions: {
            type: [String]
        },
        status: {
            type: String,
            enum: ['Draft', 'Published'],
            required: true,
        },
        language: {
            type: String,
            required: true,
        },
        level: {
            type: String,
            required: true,
        },
        totalLectures: {
            type: Number,
        },
        totalDuration: {
            type: String,
        },
    },
    { timestamps: true }
);

export const Course = mongoose.model("Course", courseSchema);