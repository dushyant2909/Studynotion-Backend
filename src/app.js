import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();

app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Welcome to studynotion || Server running fine"
    })
})

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

// Earlier you have to use body parser for accepting json
app.use(express.json({
    limit: "16kb"
}))

// For handling data which comes from url
app.use(express.urlencoded({
    extended: true, // for using objects under objects
    limit: "16kb"
}))

// When you have to upload files to server like cloudinary then first 
// you keep in public folder locally
app.use(express.static("public")) // Here public is folder name

// Set up a cookie parser
app.use(cookieParser());

// Routes
import userRoutes from "./routes/user.routes.js";
import contactUsRouter from "./routes/contact.routes.js";
import tagRoutes from "./routes/tags.routes.js";

// Routes declaration
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/", contactUsRouter)
app.use("/api/v1/admin", tagRoutes)

export { app }