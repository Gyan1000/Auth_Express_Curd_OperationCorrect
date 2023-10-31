import userModel from "../models/user_model.js";
import bcrypt from "bcrypt";
import CustomError from "../utilities/handlingError.js";
import sendMessage from "../utilities/mail.js";
import crypto from "crypto";
import cloudinary from "cloudinary";
import fs from "fs/promises"


//REGISTER USER

// export const registerUser=async(req,res,next)=>{
//     const {name,email,password}=req.body;
   
//     // TO CREATE COLLECTION IN DB 
//     try{
//        const registeredUser=await userModel.findOne({email})
//         if(registeredUser)
//           return next(new CustomError('Email Id already Exist',504))
//          //  const newUser= await userModel.create({...req.body,profile_image:{
//          //    public_id: email,
//          //    secure_url: 'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg'
//          //   }});

//            const newUser= await userModel.create({name,email,password,avatar:{
//             public_id: email,
//             secure_url: 'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg'
//            }});
//          if(!newUser)
//          {
//             return next(new CustomError("user registration falied",400))
//          }
//         if (req.file) {
//          // console.log("............. ",req.file)
//          try {
//            const result = await cloudinary.v2.uploader.upload(req.file.path, {
//              folder: 'AUTH_Express_Assignment', // Save files in a folder named lms
//              width: 250,
//              height: 250,
//              gravity: 'faces', // This option tells cloudinary to center the image around detected faces (if any) after cropping or resizing the original image
//              crop: 'fill',
//            });
          
//            // If success
//            if (result) {
          
//              // Set the public_id and secure_url in DB
//              newUser.profile_image.public_id = result.public_id;
//              newUser.profile_image.secure_url = result.secure_url;
     
//              // After successful upload remove the file from local storage
//             //  fs.rm(`uploads/${req.file.filename}`);

//            }

//            await newUser.save(); 
//            newUser.password=undefined;
//            res.status(200).send({msg:"user registered successfully",success:true,data:user});

//          } catch (error) {
//            return next(new CustomError(error.message, 400));
//          }
//        }
       
      
//     }
//     catch(error)
//     {
      
//          return next(new CustomError(error.message,501))
//     }  
    
    
// }

export const registerUser=async (req, res, next) => {
   // Destructuring the necessary data from req object
   const { name, email, password } = req.body;
 
   // Check if the data is there or not, if not throw error message
   // if (!fullName || !email || !password) {
   //   return next(new CustomError('All fields are required', 400));
   // }
 
   // Check if the user exists with the provided email
   const userExists = await userModel.findOne({ email });
 
   // If user exists send the reponse
   if (userExists) {
     return next(new CustomError('Email already exists', 409));
   }
 
   // Create new user with the given necessary data and save to DB
   const user = await userModel.create({
     name,
     email,
     password,
     avatar: {
       public_id: email,
       secure_url:
         'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg',
     },
   });
 
   // If user not created send message response
   if (!user) {
     return next(
       new CustomError('User registration failed, please try again later', 400)
     );
   }
 
   // Run only if user sends a file
   if (req.file) {
     try {
       const result = await cloudinary.v2.uploader.upload(req.file.path, {
         folder: 'AUTH_Express_Assignment', // Save files in a folder named lms
         width: 250,
         height: 250,
         gravity: 'faces', // This option tells cloudinary to center the image around detected faces (if any) after cropping or resizing the original image
         crop: 'fill',
       });
 
       // If success
       if (result) {
         // Set the public_id and secure_url in DB
         user.avatar.public_id = result.public_id;
         user.avatar.secure_url = result.secure_url;
 
         // After successful upload remove the file from local storage
         fs.rm(`uploads/${req.file.filename}`);
       }
     } catch (error) {
       return next(
         new CustomError(error.message,400)
       );
     }
   }
 
   // Save the user object
   await user.save();
 
   // Generating a JWT token
   const token = await user.generateJWTToken();
 
   // Setting the password to undefined so it does not get sent in the response
   user.password = undefined;
 
   // Setting the token in the cookie with name token along with cookieOptions
   res.cookie('token', token, cookieOptions);
 
   // If all good send the response to the frontend
   res.status(201).json({
     success: true,
     message: 'User registered successfully',
     user,
   });
 }
export const loginUser=async(req,res)=>{
   const {email,password}=req.body;
   try{
      const userData=await userModel.findOne({email}).select("+password");
      if(userData)
      {
         if(await bcrypt.compare(password,userData.password))
         {
            const token=userData.jwtToken();

            const cookies_option={
               maxAge:24*60*60*1000,
               httpOnly:true
            }
            res.cookie("token",token,cookies_option)

            res.status(200).send({msg:"USER LOGIN SUCCESSFULLY ,ENJOY!"});
         }
         else
         {
            // res.status(401).send({msg:"YOU HAVE ENTERED WRONG PASSWORD"});
            return next(new CustomError("YOU HAVE ENTERED WRONG PASSWORD",401))
         }
      }
      else{
      //   res.status(404).send({msg:"YOU HAVE ENTERED INVALID EMAIL ID"})
        return next(new CustomError("YOU HAVE ENTERED INVALID EMAIL ID",404))
      }
   }
   catch(error)
   {
       res.status(501).send({msg:error.message})
       return next(new CustomError(`${error.message}`,501))    
   }    
}

export const authenticUserDetails=async (req,res)=>{
   const userInfo=req.userDetails;
   console.log(userInfo)
try{
   const authenticUser=await userModel.findById(userInfo.id)
    authenticUser.password=undefined;
    res.status(201).send(
      {message:"Authentic User",
      success:true,
      data:authenticUser
    })
   }

catch(error){
//   res.status(501).send({message:`Not a Authentic user because ${error.message}`,success:false})
  return next(new CustomError(`${error.message}`,501))
}
}

export const forgotpassword=async(req,res,next)=>{
   const {email}=req.body;
   const user=await userModel.findOne({email});
   if(user)
   {
       const forgotToken=user.invokeForgotTokenPassword();
      await user.save();
       console.log("............... ",forgotToken)
       const url=`${process.env.FRONT_URL}/reEnterPassword/${forgotToken}`;

       const subject="Re-EnterPassword";
       const message=`PLEASE RE-ENTER YOUR PASSWORD, FOR THIS YOU CAN CLICK ON LINK OR PASTE THE LINK IN NEW TAB 
       <a href=${url}>RE-ENTER-PASSWORD</a>
       `
       try{
            await sendMessage(email,subject,message);

            res.status(201).send({
               success:true,
               message:`TOKEN HAS BEEN SUCCESSFULLY SEND TO ${email}`
            })
       }
       catch(error)
       {
           user.forgotTokenPassword=undefined;
           user.forgotTokenPasswordExpiry=undefined;
          await user.save();
          return next(new CustomError(error.message+' TOKEN HAS NOT BEEN SEND SUCCESSFULLY',501))
       }


   }
   else
    return next(new CustomError("Email Id does not Exist",401));

}

export const reEnterPassword=async(req,res,next)=>{
   // const forgotToken="Mr4vVZiTFCfJKh4MCnBESj38qymYqJnP";
   // const forgotToken=req.params.forgotToken;
   const {password}=req.body;
   const {forgotToken}=req.params

   //  console.log("f: ",forgotToken ,"p ",password)

   const forgotTokenPassword=crypto.createHash('sha256').update(forgotToken).digest('hex');
     try{
       const user=await userModel.findOne({forgotTokenPassword,forgotTokenPasswordExpiry:{$gt:Date.now()},})
     try{ 
         user.forgotTokenPassword=undefined;
         user.forgotTokenPasswordExpiry=undefined;
         user.password=password;
        await user.save();
      
      //   user.password=undefined;
        res.status(202).send({message:"YOUR NEW PPASSWORD HAS BEEN SUCCESSFULLY RESET",
         success:true,
         
      })
        
       }
        catch(error)
        {
          return next(new CustomError(error.message,500));
        }
      
   
   }
   catch(error)
   {
      return next(new CustomError("Token became invalid",502))
   }
   }

export const logout=async(_req,res,_next)=>{
   const cookies_option={
      maxAge:0,
      httpOnly:true
   }
   res.setCookie("token",null,cookies_option);
   res.status(200).send({message:"USER  LOGGED OUT SUCCESSFULLY",success:true});
}