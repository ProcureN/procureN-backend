const mongoose = require("mongoose")
const costumerEnquiryFormSchema = new mongoose.Schema({ 
    ProductName:  { 
        type: String,
        require: true,
        trim: true,
    },
    OtherProduct:{
        type:String,
        trim: true,
    },
    // OtherProduct:{
    //     type:Number,
    //     trim: true,
    // },
    Name:  { 
        type: String,
        require: true,
        trim: true,
    },
    Contact:{
        type: String,
        require: true,
        trim: true,
    },
    AlternativeNumber:{
        type: String,
        trim: true,
    },
    Email:{
        type: String,
        require: true,
       // unique: true,
        trim: true
    },
    State:{
        type:String,
        require:true,
        trim: true,
    },
    BillingAddress:{
        type:String,
        require:true,
        trim: true,
    },
    ShippingPincode:{
        type:Number,
        require:true,
        trim: true,
    }
},{timestamps:true})

module.exports = mongoose.model('costumerEnquiryForm', costumerEnquiryFormSchema)