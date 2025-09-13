import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth-routes/index.js';
import mediaRoutes from './routes/instructor-routes/media-routes.js';
import instructorCourseRoutes from './routes/instructor-routes/course-routes.js';
import studentViewCourseRoutes from './routes/student-routes/course-routes.js';
import studentViewOrderRoutes from './routes/student-routes/order-routes.js';
import studentCoursesRoutes from './routes/student-routes/student-courses-routes.js';
import studentCourseProgressRoutes from './routes/student-routes/course-progress-routes.js';
import studentRoutes from './routes/student-routes/index.js';
import teacherRoutes from './routes/teacher-routes/index.js';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ['GET', 'POST', 'DELETE', 'PUT'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
);

app.use(express.json());

// Database connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
        console.log(`Connected to Db: ${MONGO_URI}`);
    })
   .catch((err) => {
        console.log("Mongodb connection failed !!!", err);
    });

// Routes configuration
app.use('/auth', authRoutes);
app.use('/media', mediaRoutes);
app.use('/instructor/course', instructorCourseRoutes);
app.use('/student/course', studentViewCourseRoutes);
app.use('/student/order', studentViewOrderRoutes);
app.use('/student/courses-bought', studentCoursesRoutes);
app.use('/student/course-progress', studentCourseProgressRoutes);
app.use('/students', studentRoutes);
app.use('/teachers', teacherRoutes);

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong',
    });
});

