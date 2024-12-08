const mongoose = require("mongoose")

const feedbackSchema = new mongoose.Schema({
    feedbackMessage:{type:String, required:true},
    userId: { type: mongoose.SchemaTypes.ObjectId, 
        ref: 'User', required: true },
        username:{type:String, required:true},
},{timestamps:true})
const model = mongoose.model("Feedback", feedbackSchema)
module.exports = model
