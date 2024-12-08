const mongoose = require("mongoose")

const tokenSchema = new mongoose.Schema({
    employerId:{
        type:mongoose.SchemaTypes.ObjectId,
        required:true,
        ref:"Employer",
        unique:true,

    },
    
    token:{type:String, required:true},
},{timestamps:true})
module.exports = mongoose.model("empToken", tokenSchema)