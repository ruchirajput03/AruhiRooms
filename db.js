require("dotenv").config();
const mongoose=require('mongoose')
mongoose.connect(process.env.URI)
var connection=mongoose.connection
connection.on('error',()=>{
    console.log('Mongo DB Connection failed')
})
connection.on('connected',()=>{
    console.log('Mongo DB Connection Successful')
})
module.exports=mongoose;