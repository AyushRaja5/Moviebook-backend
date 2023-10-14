import mongoose, { model } from 'mongoose'

const adminSchema = new mongoose.Schema({
    name : {
        type : String,
        require :true
    },
    email : {
        type : String,
        require : true,
        unique : true
    },
    password :{
        type : String,
        require : true
    },
    addmovies : [{
        type : mongoose.Types.ObjectId,
        ref : "MovieSchemaModel"
    }]
})

export default model('AdminSchemaModel', adminSchema);