import express from 'express';
import connectDB from './databse/db.js';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';
import 'dotenv/config.js';

const app = express();
const PORT = process.env.PORT || 6000;

//middleware
app.use(express.json());

app.use(cors());

// define routes 
app.use('/api/user', userRoutes);

//database call
connectDB();

app.listen(PORT,()=>{
    console.log(`Server on listing http://127.0.0.1:${PORT}`);
})


