import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express(); 

app.use(cors({
  origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));    
app.use(express.static('public'));
app.use(cookieParser());







// Importing routes

import { uploadRouter } from './routes/upload.routes.js';
import userRouter from './routes/user.routes.js'




// Declaring routes

app.use('/api/v1/uploads', uploadRouter);
app.use("/api/v1/users" , userRouter)


export {app}