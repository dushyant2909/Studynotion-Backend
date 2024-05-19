import { Router } from "express";
import { isAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import { createTag, showAllTags } from "../controllers/tags.controller.js";

const tagRoutes = Router()

tagRoutes.use(verifyJWT, isAdmin);

tagRoutes.route("/create-tag").post(createTag);
tagRoutes.route("/show-all-tags").post(showAllTags)

export default tagRoutes