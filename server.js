
const express=require("express");
const app=express();
const dotenv = require("dotenv");
const dbConfig=require('./db');
const roomsRoute=require('./routes/roomRoute')
const userRoute=require('./routes/userRoutes')
const bookingRoutes=require('./routes/bookingRoutes')
dotenv.config();
app.use(express.json())
app.use('/api/rooms',roomsRoute)
app.use('/api/users',userRoute)
app.use('/api/bookings',bookingRoutes)

app.listen(process.env.PORT,()=>console.log(`server running on port ${process.env.PORT}`));