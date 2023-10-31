import validateEmail_Formate from "email-validator";
import CustomError from "../utilities/handlingError.js";

const registerValidation=(req,res,next)=>{
    const field=["name","email","password"]
    const {name,email,password}=req.body;
    if(req.body!=null && name && email && password)
    {
       
        // validate Email Formate
      const validEmailFormate=validateEmail_Formate.validate(email)
      if(!validEmailFormate)
      {
        //   res.status(404).send("PLEASE ENTER VALID EMAIL ADDRESS")
          return next(new CustomError("PLEASE ENTER VALID EMAIL ADDRESS FORMAT",404))
      } 
      else
         next()
    }      
    else
    {
       
    //  res.status(501).send({msg:"ALL INPUT FIELDS ARE REQUIRED"})
     return next(new CustomError("ALL INPUT FIELDS ARE REQUIRED",501))
    }
}
 export default registerValidation;