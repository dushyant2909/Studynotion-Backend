import mongoose from "mongoose";

const tagsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }
},
    {
        timestamps: true
    })

export const Tags = mongoose.model("Tag", tagsSchema)