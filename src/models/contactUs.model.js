import mongoose from "mongoose";

const contactUsSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        maxLength: 50,
    },
    lastName: {
        type: String,
        maxLength: 50,
    },
    email: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
},
    {
        timestamps: true
    })

export const Contactus = mongoose.model("Contactus", contactUsSchema)