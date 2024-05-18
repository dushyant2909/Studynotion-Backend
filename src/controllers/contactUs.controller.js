import contactusResponsetemplate from "../../emailTemplates/contactUsTemplate.js";
import { Contactus } from "../models/contactUs.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { emailSenderUtility } from "../utils/resendEmailSetup.js";

const contactUs = asyncHandler(async (req, res) => {
    try {
        const { countrycode, email, firstName, lastName = "", message, phoneNo } = req.body;

        //validate
        if (!firstName || !email || !phoneNo || !message) {
            return res.status(400).json({
                success: false,
                message: "All fileds are needed",
            });
        }

        const contactDetails = await Contactus.create({
            firstName,
            lastName,
            email,
            phoneNumber: `${countrycode}-${phoneNo}`,
            message
        })

        if (!contactDetails)
            return res.status(400).json({
                success: "false",
                message: "Contact details not saved to DB"
            })

        try {
            const mailResponse = await emailSenderUtility(email,
                "Contacting successfull",
                contactusResponsetemplate(contactDetails)
            )
            console.log("Email response::", mailResponse);
            // Alert to department also
            const toEmail = "dushyantd2909@gmail.com"

            const sendMailToMeResponse = await emailSenderUtility(
                toEmail,
                "You got a contact us response",
                contactusResponsetemplate(contactDetails)
            )

            console.log("Email response::", sendMailToMeResponse);
        } catch (error) {
            console.log("Error sending mail::", error);
            return res.status(400).json({
                success: "false",
                message: "Something went wrong in sendig mail",
                error: error.message
            })
        }

        return res.status(200).json(
            new ApiResponse(200, contactDetails, "Contact us details saved successfully")
        )

    } catch (error) {
        console.log("Error in contact us controller::", error);;
        return res.status(500).json({
            success: "false",
            message: "Something went wrong in Contact us controller",
            error: error.message
        })
    }
})

export { contactUs }