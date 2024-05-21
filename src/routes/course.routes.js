import { Router } from "express";
import { createCourse } from "../controllers/course.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const courseRoutes = Router();

courseRoutes.use(verifyJWT);


courseRoutes.route("/create-course").post(upload.single('thumbnail'), createCourse)

export default courseRoutes