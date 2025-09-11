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

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST', 'DELETE', 'PUT'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

app.use(express.json());

// Database connection
mongoose
    .connect(MONGO_URI)
    .then(() => console.log('mongodb is connected'))
    .catch((e) => console.log(e));

// Routes configuration
app.use('/auth', authRoutes);
app.use('/media', mediaRoutes);
app.use('/instructor/course', instructorCourseRoutes);
app.use('/student/course', studentViewCourseRoutes);
app.use('/student/order', studentViewOrderRoutes);
app.use('/student/courses-bought', studentCoursesRoutes);
app.use('/student/course-progress', studentCourseProgressRoutes);

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong',
    });
});

app.listen(PORT, () => {
    console.log(`Server is now running on port ${PORT}`);
});