const mongoose = require("mongoose")
const feedbackSchema = new mongoose.Schema({
name :{
    type:String,
    require:true,
    trim:true
},
email:{
    type:String,
    require:true,
    trim:true
},
subject:{
    type:String,
    trim:true,
},
message:{
    type:String,
    trim:true,
}
}, { timestamps: true })
module.exports = mongoose.model('feedback', feedbackSchema)