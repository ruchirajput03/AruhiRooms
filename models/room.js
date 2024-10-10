const mongoose=require("mongoose");
const roomSchema=new mongoose.Schema({

  name:{
        type:String,
        required:true
    },
    maxCount :{
        type:Number,
        required:true
    },
    phoneNumber:{
        type:Number,
        required:true
    },
    imageUrls:[],
    currentBooking:[],
    type:{
       type:String,
       required:true
    },
    description:{
        type:String,
        required:true
    },
    rentPerDay:{
        type:Number,
        required:true
    }},{
    timestamps:{ currentTime: () => Math.floor(Date.now() / 1000) }
});
const roomModel=mongoose.model('rooms',roomSchema)
module.exports=roomModel;