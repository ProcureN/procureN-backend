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
    status:{
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default:"Pending"
    },
    deliveryStatus:{
        type: String,
        enum:["Processing","Shipped","Delivered"],
        default:"Processing"
    },
   
    vchNo:{
        type:String
    }
    // category: {
    //     type: String,
    //     require: true,
    //     trim: true
    // },
    // subCategory: {
    //     type: String,
    //     require: true,
    //     trim: true
    // },
    
    // priceBeforeDiscount: {
    //     type: Number,
    //    // require: true,
    //     trime: true
    // },
    
    // withGST: {
    //     type: Number,
    //   //  require: true,
    //     trim: true
    // },
    // description: {
    //     type: String,
    //     require: true,
    //     trim: true
    // },
    // shippingCharges: {
    //     type: Number,
    //    // require: true,
    //     trim: true
    // },
    // sizeUnit: {
    //     type: String,
    //     require: true,
    //     trim: true
    // },
   
    // availability: {
    //     type: String,
    //     require: true,
    //     trim: true
    // },
    // selectImage1: {
    //     require: true,
    //     type: String,
    //     require: true
    // },
    // selectImage2: {
    //     type: String,

    // },
  


}, { timestamps: true })
module.exports = mongoose.model('vendor', VendorSchema)