import { Router } from "express";
import { sendOTP, signup } from "../controllers/user.controller.js";

const userRoutes = Router()

userRoutes.route("/register").post(signup)
userRoutes.route("/sendOtp").post(sendOTP);

export default userRoutes;