import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import {connectDB}  from './config/mongodb.js';
import UserRouter from '../server/routes/userRoute.js'
import AdminRouter from '../server/routes/AdminRoute.js'

const app = express();
const port = process.env.PORT || 4000;

const allowedOrgins = ['http://localhost:5173']
app.use(cors({origin:allowedOrgins,credentials:true}));

app.use(express.json({ limit: "50mb" })); 
app.use(express.urlencoded({ limit: "50mb", extended: true })); 

app.use(cookieParser())
connectDB();

app.use('/',UserRouter)
app.use('/admin',AdminRouter);

app.listen(port,()=>console.log("Server running on Port",port));