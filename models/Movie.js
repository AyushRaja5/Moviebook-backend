import mongoose, { model } from 'mongoose'

const MovieSchema = new mongoose.Schema({
    title : {
        type : String,
        require : true,
    },
    description : {
        type : String,
        require : true
    },
    releaseDate : {
        type : Date,
        require : true,
    },
    posterUrl : {
        type : String,
        require : true
    },
    featured : {
        type : Boolean
    },
    bookings : [{
        type : mongoose.Types.ObjectId,
        ref : "BookingModelSchema"
    }],
    stars: [{
        type : String,
        require : true
    }],
    admin : {
        type : mongoose.Types.ObjectId,
        ref : 'AdminSchemaModel',
        require : true
    }
})

export default model('MovieSchemaModel', MovieSchema)