import mongoose from "mongoose";
// if I save any extra query or extact field that doest not exist then Error will come because I used "strictQuery"
mongoose.set('strictQuery',false);

const dbConnection=async()=>{
      try{
        const con =await mongoose.connect(process.env.DB_URL)
        console.log(`Database Connection is established ${con.connection.host}`);
      }
      catch(error)
      {
        console.log(`Database connection is not established ${error.message}`);
        process.exit(1);
      }
    }
  export default dbConnection;