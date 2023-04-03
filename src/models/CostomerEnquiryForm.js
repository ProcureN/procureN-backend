const mongoose = require("mongoose")
const costumerEnquiryFormSchema = new mongoose.Schema({
    productName: {
        type: String,
        require: true,
        trim: true,
    },
    otherProduct: {
        type: String,
        trim: true,
    },
    // OtherProduct:{
    //     type:Number,
    //     trim: true,
    // },
    name: {
        type: String,
        require: true,
        trim: true,
    },
    contact: {
        type: String,
        require: true,
        trim: true,
    },
    alternativeNumber: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        require: true,
        // unique: true,
        trim: true
    },
    state: {
        type: String,
        require: true,
        trim: true,
    },
    billingAddress: {
        type: String,
        require: true,
        trim: true,
    },
    shippingPincode: {
        type: Number,
        require: true,
        trim: true,
    },
    deletedAt: {
        type: Date
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model('costumerEnquiryForm', costumerEnquiryFormSchema)