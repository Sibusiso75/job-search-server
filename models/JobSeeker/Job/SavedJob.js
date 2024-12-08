const mongoose =require("mongoose")

const savejobSchema = new mongoose.Schema({
  title:{type:String, required:true},
  description:{type:String, required:true},
  numberOfPeopleToHire:{type:String, required:true},
  jobUrl:{type:String},
  jobLocation:{type:String},
  reside:{type:String},
  province:{type:String},
  jobType:{type:String},
  area:{type:String},
  username:{type:String},

  jobId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Job', required: true },
  userId: { type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true },
}, {timestamps:true})
module.exports = mongoose.model("SavedJob",savejobSchema)