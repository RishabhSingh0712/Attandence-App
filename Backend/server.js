import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import { Register } from './model/Register.js';

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/AttendanceApp");

app.post('/register',(req,res)=>{
Register.create(req.body)
.then(Register=>res.json(Register))
.catch(err=>res.json(err))
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});