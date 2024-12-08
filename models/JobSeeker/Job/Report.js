const mongoose = require("mongoose")

const reportSchema =  new mongoose.Schema({
    title:{type:String},
    description:{type:String},
    numberOfPeopleToHire:{type:String},
    jobUrl:{type:String},
    jobLocation:{type:String},
    reside:{type:String},
    province:{type:String},
    jobType:{type:String},
    area:{type:String},
    username:{type:String},
    jobId:{ref:"Job", type:mongoose.SchemaTypes.ObjectId, required: true},
    userId: { type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true },
   reportMessage:{type:String, required:true},
   status:{type:String, default:"Status is pending. We'll review your report and get back to you"},

}, {timeStamps:true})
const model = mongoose.model("Report", reportSchema)
module.exports = model