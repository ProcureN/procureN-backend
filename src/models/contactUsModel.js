const mongoose = require("mongoose")
const contactSchema = new mongoose.Schema({
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
},
phone:{
    type:String,
   // require:true,
    trim:true
},
isDeleted:{
    type:Boolean,
    default:false
}
}, { timestamps: true })
module.exports = mongoose.model('contactUs', contactSchema)