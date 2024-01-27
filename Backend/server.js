import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import  Register from './model/Register.js';
import userRoutes from './routes/userRoutes.js'

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://srishabhdev07:Rishabh123@cluster1.az5qugh.mongodb.net");
mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });
  

app.post('/register',(req,res)=>{
    console.log('data received');
Register.create(req.body)
.then(Register=>res.json(Register))
.catch(err=>res.json(err))
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});