const mongoose = require("mongoose")

const employerSchema =  new mongoose.Schema({
   username:{type:String, required:true},
    email:{type:String, required:true,unique:true, lowercase:true},
    phoneNumber:{type:Number, required:true},
    password:{type:String, required:true},
    companyName:{type:String, required:true},
    numberOfEmployees:{type:String, required:true},
    aboutYourCompany:{type:String, required:true},
    verified:{type:Boolean, default:false}
}, {timeStamps:true})
const model = mongoose.model("Employer", employerSchema)
module.exports = model