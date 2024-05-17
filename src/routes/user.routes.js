import { Router } from "express";
import { changePassword, getCurrentUser, login, logout, sendOTP, signup } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"

const userRoutes = Router()

userRoutes.route("/register").post(signup)
userRoutes.route("/sendOtp").post(sendOTP);
userRoutes.route("/login").post(login);

userRoutes.use(verifyJWT)
userRoutes.route("/get-current-user").get(getCurrentUser)
userRoutes.route("/logout").post(logout);
userRoutes.route("/changePassword").post(changePassword)

export default userRoutes;