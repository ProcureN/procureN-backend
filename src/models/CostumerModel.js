const mongoose = require("mongoose")
const costumerSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        require: true,
        trim: true
    },
  
    selectRole: {
        type: String,
        enum: ["Retailer", "manufacturer"],
        require: true,
        trim: true,
    },
    company: {
        type: String,
        require: true,
        trim: true,
    },
    jobTitle: {
        type: String,
        require: true,
        trim: true,
    },
    phone: {
        type: String,
        require: true,
        trim: true,
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
    deletedAt: {
        type: Date
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })
module.exports = mongoose.model('costumer', costumerSchema)