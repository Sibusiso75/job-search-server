const mongoose = require("mongoose")

const tokenSchema = new mongoose.Schema({
    userId:{
        type:mongoose.SchemaTypes.ObjectId,
        required:true,
        ref:"User",
        unique:true,

    },
    
    token:{type:String, required:true},
},{timestamps:true})
module.exports = mongoose.model("token", tokenSchema)