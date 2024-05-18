import { Router } from "express";
import { contactUs } from "../controllers/contactUs.controller.js";

const contactUsRouter = Router();

contactUsRouter.route("/contact-us").post(contactUs);

export default contactUsRouter;