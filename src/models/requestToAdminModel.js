const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId
const RequestAdminSchema = new mongoose.Schema({
    ProductId: {
        type: ObjectId,
        ref: "AddProducts",
         required: true, 
         trim:true
    },
    Description: {
        type: String,
        require: true
    },
    ApprovealStatus: {
        type: String,
        default: 'pending',
        enum: ["pending", "completed", "cancelled"]
    }

}, { timestamps: true })
module.exports = mongoose.model('requestAdmin', RequestAdminSchema)