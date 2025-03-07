import express from 'express';
import authRoutes from './routes/auth.route.js';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import MessageRAoutes from './routes/message.route.js';


const app = express();

dotenv.config();
app.use(express.json());//middleware to parse json data
app.use(cookieParser()); // allow to use the cookie parser
const PORT = process.env.PORT || 5001;

app.use("/api/auth",authRoutes);
app.use("/api/message",MessageRAoutes);



app.listen(PORT,()=>{
    console.log('Server is running on port :'+PORT);
    connectDB();
})
