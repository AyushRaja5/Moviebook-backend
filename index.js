// const express = require('express')
// const dotenv = require('dotenv')

import express from 'express';
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import userRouter from './routes/user-routes.js';
import AdminRouter from './routes/admin-routes.js';
import movieRouter from './routes/movie-routes.js';
import bookingRouter from './routes/booking-routes.js';
import cors from 'cors'
const app = express();
dotenv.config()
const PORT = process.env.PORT || 5000;

const dburl = process.env.MongoDBURL

// middleware routes 
app.use(express.json())
app.use(cors())
app.use('/user', userRouter)
app.use('/admin', AdminRouter)
app.use('/movie', movieRouter)
app.use('/booking', bookingRouter)

mongoose.connect(dburl)
.then(()=>console.log('Db connected Successfully'))
.catch(err => console.log(err))


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})