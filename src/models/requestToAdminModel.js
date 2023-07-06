const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId
const RequestAdminSchema = new mongoose.Schema({
    productId: {
        type: ObjectId,
        ref: "AddProducts",
        required: true,
        trim: true
    },
    description: {
        type: String,
        require: true,
        trim: true,
    },
    approvealStatus: {
        type: String,
        default: 'pending',
        enum: ["pending", "completed", "cancelled"],
        trim: true
    }

}, { timestamps: true })
module.exports = mongoose.model('requestAdmin', RequestAdminSchema)