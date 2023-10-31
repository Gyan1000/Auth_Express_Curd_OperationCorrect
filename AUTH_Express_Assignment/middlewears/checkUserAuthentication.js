import JWT from 'jsonwebtoken';
import CustomError from "../utilities/handlingError.js"

const isUserLoggedIn=async (req,res,next)=>{
 const token=req.cookies?.token||null;
 if(!token)
 {
   return  res.status(401).send({
         message:'unauthenticate user',
         success:false  
})
 }
 
const userDetails= JWT.verify(token,process.env.SECRET)
if(userDetails){
req.userDetails={id:userDetails.id,email:userDetails.email};
next();
}
else{
  throw next(new CustomError("INVALID USER",504));
}
}



export default isUserLoggedIn;
