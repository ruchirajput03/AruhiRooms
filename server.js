const cors=require("cors");
const express=require("express");
const app=express();
const dotenv = require("dotenv");
const dbConfig=require('./db');
const roomsRoute=require('./routes/roomRoute')
const userRoute=require('./routes/userRoutes')
const bookingRoutes=require('./routes/bookingRoutes')
dotenv.config();
// Enable CORS for multiple origins (local and production)
const allowedOrigins = [
  "https://merry-truffle-8ab43b.netlify.app", // Production domain
  "http://localhost:3000", // Development domain
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow the origin
      } else {
        callback(new Error("Not allowed by CORS")); // Reject the origin
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json())
app.use('/api/rooms',roomsRoute)
app.use('/api/users',userRoute)
app.use('/api/bookings',bookingRoutes)

app.listen(process.env.PORT,()=>console.log(`server running on port ${process.env.PORT}`));
