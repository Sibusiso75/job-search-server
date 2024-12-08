const mongoose = require("mongoose")

const userSchema =  new mongoose.Schema({
   username:{type:String, required:true},
    email:{type:String, required:true,unique:true, lowercase:true},
    password:{type:String, required:true},
    dateOfBirth:{type:String, required:true},
    gender:{type:String, required:true},
    postalCode:{type:Number, required:true},
    aboutMe:{type:String, required:true},
    province:{type:String, required:true},
    country:{type:String, required:true},
    town:{type:String, required:true},


            highestGradePassed:{type:String},
        schoolName:{type:String},
        yearObtainedOne:{type:String},
        institutionName:{type:String},
        courseName:{type:String},
        yearObtainedTwo:{type:String},
        jobTitle:{type:String},
        companyName:{type:String},
        yearsOfExperience:{type:Number},
        startDate:{type:String},
        endDate:{type:String},
        
        
    isAdmin:{type:Boolean, default:true},
    verified:{type:Boolean, default:false}
    
}, {timestamps:true})
const model = mongoose.model("User", userSchema)
module.exports = model