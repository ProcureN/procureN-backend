const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId
const otpSchema = new mongoose.Schema({
    otp :{
        type:Number,
        require: true,
        trim: true
    },
    Email: {
        type: String,
        require: true,
        //unique: true,
        trim: true
    },
}, { timestamps: true })
module.exports = mongoose.model('otp', otpSchema)