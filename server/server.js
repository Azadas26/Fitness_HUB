import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/mongodb.js';
import path from 'path';
import { fileURLToPath } from 'url';

import UserRouter from './routes/userRoute.js';
import AdminRouter from './routes/AdminRoute.js';
import DoctorRouter from './routes/doctor.route.js'

const app = express();
const port = process.env.PORT || 4000;

// Resolve __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Allow frontend (React) to access backend with cookies
const allowedOrigins = ['http://localhost:5173'];
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// 🔥 Serve uploaded images
app.use('/uploads/doctors', express.static(path.join(__dirname, 'uploads/doctors')));

// Connect to DB
connectDB();

// Routes
app.use('/', UserRouter);
app.use('/admin', AdminRouter);
app.use('/doctor', DoctorRouter)

app.listen(port, () => console.log(`✅ Server running on port ${port}`));
