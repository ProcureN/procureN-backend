const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId
const costumerEnquiryFormSchema = new mongoose.Schema({
    productName: {
        type: String,
        require: true,
        trim: true,
    },
    otherProduct: {
        type: String,
        require: true,
        trim: true,
    },
    quantity: {
        type: String,
        trim: true,
        require: true,
    },
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
    city: {
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
        type: String,
        require: true,
        trim: true,
    },
    deletedAt: {
        type: Date
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending"
    },
    deliveryStatus: {
        type: String,
        enum: ["Processing", "Shipped", "InTransit", "Delivered"],
        default: "Processing"
    },
    customerID: {
        type: ObjectId,
        required: true,
        ref: "costumer",
        trim: true
    },
    date: {
        type: String
    },
    time:{
        type:String
    },
    trackingID:{
        type:String
    }

}, { timestamps: true })

module.exports = mongoose.model('costumerEnquiryForm', costumerEnquiryFormSchema)