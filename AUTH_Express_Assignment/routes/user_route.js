import express from "express";

import {registerUser,loginUser,authenticUserDetails, forgotpassword,reEnterPassword,logout} from "../controller/user_controller.js";


const userRouter=express.Router();

//custom middlewears
import loginValidation from "../middlewears/loginValidation.js"

import registerValidation from "../middlewears/registerValidation.js"

import isUserLoggedIn from  "../middlewears/checkUserAuthentication.js"

import upload from "../middlewears/multerMiddleware.js"


userRouter.post("/register",upload.single("avatar"),registerValidation,registerUser);
userRouter.post("/login",loginValidation,loginUser);
userRouter.post("/getUser",isUserLoggedIn,authenticUserDetails);
userRouter.post("/forgotPassword",forgotpassword);
userRouter.post("/reEnterPassword/:forgotToken",reEnterPassword);
userRouter.post("/logout",logout);

export default userRouter;