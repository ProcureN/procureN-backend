const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId
const AddProductsSchema = new mongoose.Schema({
    productName: {
        type: String,
        require: true,
        trim: true,
    },
    costumerID: {
        type: ObjectId,
        required: true,
        ref: "costumer",
        trim: true
    },
    category: {
        type: String,
        require: true,
        trim: true
    },
    subCategory: {
        type: String,
        require: true,
        trim: true
    },
    manufacturerName: {
        type: String,
        require: true,
        trim: true
    },
    priceBeforeDiscount: {
        type: Number,
        require: true,
        trime: true
    },
    price: {
        type: Number,
        require: true,
        trime: true
    },
    withGST: {
        type: Number,
        require: true,
        trim: true
    },
    description: {
        type: String,
        require: true,
        trim: true
    },
    shippingCharges: {
        type: Number,
        require: true,
        trim: true
    },
    sizeUnit: {
        type: String,
        require: true,
        trim: true
    },
    productQuantity: {
        type: String,
        require: true,
        trim: true
    },
    availability: {
        type: String,
        require: true,
        trim: true
    },
    selectImage1: {
        require: true,
        type: String,
        require: true
    },
    selectImage2: {
        type: String,

    }, deletedAt: {
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
        enum:["processing","shipped","inTransit","delivered"],
        default:"processing"
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
module.exports = mongoose.model('AddProducts', AddProductsSchema)