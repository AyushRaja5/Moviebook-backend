import mongoose, { model } from "mongoose";

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        require :  true
    },
    email : {
        type : String,
        unique : true,
        require : true
    },
    password : {
        type : String,
        require : true
    },
    date : {
        type : Date,
        default : Date.now()
    },
    bookings : [{
        type : mongoose.Types.ObjectId,
        ref : "BookingModelSchema"
    }]
})

export default model('UserSchemaModel', UserSchema)