import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
    {
        sectionName: {
            type: String,
            required: true
        },
        subSection: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Subsection",
                required: true
            }
        ]
    },
    { timestamps: true }
);

export const Section = mongoose.model("Section", sectionSchema);