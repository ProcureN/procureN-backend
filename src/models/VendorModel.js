const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId
const VendorSchema = new mongoose.Schema({
    date: {
        type: String
    },
    time:{
        type:String
    },
    particular: {
        type: String,
        require: true,
        trim: true,
    },
    userID: {
        type: ObjectId,
        required: true,
        ref: "user",
        trim: true
    },
    vendor: {
        type: String,
        require: true,
        trim: true
    },
    quantity: {
        type: String,
       // require: true,
        trim: true
    },
    price: {
        type: String,
      //  require: true,
        trime: true
    },
    deletedAt: {
        type: Date 
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
   
    vchNo:{
        type:String
    }
   
}, { timestamps: true })
module.exports = mongoose.model('vendor', VendorSchema)