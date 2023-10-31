import {config} from "dotenv";
config();

import express from "express";
import morgan from "morgan";
import cors from "cors";
import dbConnection from "./config/db_connection.js";
import userRouter from "./routes/user_route.js";
import cookieParser from "cookie-parser";
import CustomError_middleware from "./middlewears/CustomError_middleware.js";
import {v2} from "cloudinary"
const  app=express();
// middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(express.urlencoded({extended:true}))

app.use(morgan('dev'));

//Connect to database
dbConnection();

// CLOUDINARY DETAILS FOR CONNECTING THE CLOUDINATY WEBSITE TO STORE IMAGE IN IT
v2.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key:process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
 });


//register user

app.use('/',userRouter);
app.use(CustomError_middleware)

export default app;
