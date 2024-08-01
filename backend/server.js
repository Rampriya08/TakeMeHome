import express from 'express'
import ConnectToMongoDB from "./db/ConnectToMongoDB.js";
import authRoutes from './routes/auth.route.js';
import paymentRoutes from './routes/Payment.route.js';
import getPaymentRoutes from './routes/getPayment.js';
import BookingRoutes from './routes/Booking.js';
import UserRoutes from './routes/UserUpdate.js';
import busTicketsRoute from './routes/BusTicket.js';

import cors from 'cors';

import http from 'http';
import dotenv from 'dotenv';
dotenv.config();

const app=express();
app.use(express.json());

const server =http.createServer(app);

app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
  }));
app.get('/',(req,res) =>{
    res.send("<h1>Hello World Icebear</h1>")
})
app.use("/api/auth",authRoutes);
app.use('/api/Tickets', busTicketsRoute);
app.use('/api/updatePayment',paymentRoutes)
app.use('/api/payment',getPaymentRoutes)
app.use('/api/bookings',BookingRoutes)
app.use('/api/user',UserRoutes)




  

server.listen(8000,()=>{
    ConnectToMongoDB();
    console.log("Server Started at Port 8000")
})


