const mongoose = require("mongoose")
const costumerSchema = new mongoose.Schema({
    Name: {
        type: String,
        require: true,
        trim: true,
    },
    Email: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    Password: {
        type: String,
        require: true,
        trim: true
    },
  
    SelectRole: {
        type: String,
        enum: ["Retailer", "manufacturer"],
        require: true,
        trim: true,
    },
    Company: {
        type: String,
        require: true,
        trim: true,
    },
    JobTitle: {
        type: String,
        require: true,
        trim: true,
    },
    phone: {
        type: String,
        require: true,
        trim: true,
    },
    State: {
        type: String,
        require: true,
        trim: true,
    },
    city: {
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
    }
}, { timestamps: true })
module.exports = mongoose.model('costumer', costumerSchema)