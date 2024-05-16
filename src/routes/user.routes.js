import { Router } from "express";
import { login, sendOTP, signup } from "../controllers/user.controller.js";

const userRoutes = Router()

userRoutes.route("/register").post(signup)
userRoutes.route("/sendOtp").post(sendOTP);
userRoutes.route("/login").post(login);

export default userRoutes;