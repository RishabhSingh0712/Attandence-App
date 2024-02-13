import mongoose from "mongoose";
import 'dotenv/config.js'

const connectDB = async()=>{
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI)
        console.log("*!!Database connnected successfully!!*");
    } catch (error) {
        console.log("Database connnection Failed");
        
    }
} 
export default connectDB;