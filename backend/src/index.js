import express from 'express';
import authRoutes from './routes/auth.route.js';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import MessageRAoutes from './routes/message.route.js';
import cors from "cors"
import path from "path";
import { app , server } from "./lib/socket.js";
dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

app.use(express.json({ limit: '10mb' }));//middleware to parse json data
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser()); // allow to use the cookie parser
app.use(
    cors({
    origin:"http://localhost:5173",
    credentials:true,
}))


app.use("/api/auth",authRoutes);
app.use("/api/message",MessageRAoutes);



// app.listen(PORT,()=>{
//     console.log('Server is running on port :'+PORT);
//     connectDB();
// })

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
  }
  
  server.listen(PORT, () => {
    console.log("server is running on PORT:" + PORT);
    connectDB();
  });












