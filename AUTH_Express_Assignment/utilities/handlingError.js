class CustomError extends Error
{
    constructor(message,statusCode)
    {
        super(message);
        this.statusCode=statusCode;
        Error.captureStackTrace(this,this.constructor)
        console.log("customError...........");
    }
    
   
}
export default CustomError;