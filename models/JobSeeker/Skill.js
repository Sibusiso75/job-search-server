const mongoose = require("mongoose")

const skillSchema =  new mongoose.Schema({
    skillName:{type:String, required:true},
    skillLevel:{type:String, required:true},
    username:{type:String, required:true},
    userId: { type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true },
}, {timeStamps:true})
const model = mongoose.model("Skill", skillSchema)
module.exports = model