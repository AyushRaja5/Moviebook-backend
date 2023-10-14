import mongoose, { model } from "mongoose";

const bookingSchema = new mongoose.Schema({
    movieTitle : {
        type : String,
        require: true
    },
    movie : {
        type: mongoose.Types.ObjectId,
        ref : 'MovieSchemaModel',
        require : true
    },
    user : {
        type : mongoose.Types.ObjectId,
        ref : "UserSchemaModel",
        require : true
    },
    date : {
        type : Date,
        require : true
    },
    seat : [],
})

export default model('BookingModelSchema', bookingSchema)