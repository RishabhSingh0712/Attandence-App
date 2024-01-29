import express from 'express';
import connectDB from './databse/db.js';
import userRoutes from './routes/userRoutes.js'
import 'dotenv/config.js'

const app = express();
const PORT = process.env.PORT || 6000;

//middleware
app.use(express.json())

// define routes 
app.use('/api/user', userRoutes)

//database call
connectDB()

app.listen(PORT,()=>{
    console.log(`Server on listing localhost:${PORT}`);
})


