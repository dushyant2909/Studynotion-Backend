import { Resend } from "resend";

const resend = new Resend("re_DxxwZjnf_HgxJJZ4ZE6cUZfzpW85s3Sh2")


export async function sendVerificationEmail(email, title, body) {
    try {
        await resend.emails.send({
            from: "StudyNotion <onboarding@resend.dev>",
            to: email,
            subject: title,
            html: body,
        });
        return { success: true, message: "Email sent successfully." };
    } catch (emailError) {
        console.error("Error sending verification email:", emailError);
        return { success: false, message: "Failed to send verification email." };
    }
}
