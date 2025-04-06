import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import cookieParser from "cookie-parser";


//importing routes
import userRoutes from './routes/userRoutes.js'
// import restaurantRoutes from './routes/restaurantRoutes.js';
// import bookingRoutes from './routes/bookingRoutes.js';

//importing dbConnection
import {dbConnection} from './config/dbConnection.js'

//importing middleware
import {errorMiddleware} from './middleware/error.js'


const app = express();


app.use(
    cors({
    // origin: [process.env.FRONTEND_URL],
    methods: ["GET","POST","DELETE","PUT"],
    credentials: true,

    })
);


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended : true}));


//using routes
app.use('/api/v1/user',userRoutes);
// app.use('/api/v1/restaurant', restaurantRoutes);
// app.use('/api/v1/booking', bookingRoutes);

//dbconnection
dbConnection();


//middlewares
app.use(errorMiddleware);


export default app;