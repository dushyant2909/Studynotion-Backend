import mongoose from 'mongoose';
import otpTemplate from '../../emailTemplates/otpTemplate.js';
import { emailSenderUtility } from '../utils/resendEmailSetup.js';

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true
        },
        otp: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            expires: 10 * 60,
        }
    }
);

// Schema ke baad model ke pehle use kareing pre or post
async function mailSender(email, otp) {
    try {
        // const mailResponse = await mailSender(email, "OTP Verification email from studyNotion", otpTemplate(otp));
        const mailResponse = await emailSenderUtility(email, "OTP verification email", otpTemplate(otp))
        console.log("Mail response::", mailResponse);
    }
    catch (error) {
        console.error("Error while sending verification email: ", error);
        throw error;
    }
};

otpSchema.pre("save", async function (next) {
    await mailSender(this.email, this.otp);
    next();
})

export const OTP = mongoose.model("OTP", otpSchema);