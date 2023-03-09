const mongoose = require("mongoose")
const AddProductsSchema = new mongoose.Schema({ 
    ProductName:  { 
        type: String,
        require: true,
        trim: true,
    },
    Category:{
        type:String,
        require:true,
        trim:true
    },
    SubCategory:{
        type:String,
        require:true,
        trim:true
    },
    Manufacturer:{
        type:String,
        require:true,
        trim:true
    },
    priceBeforeDiscount:{
        type:Number,
        require:true,
        trime:true
    },
    Price:{
        type:Number,
        require:true,
        trime:true
    },
    WithGST:{
        type:Number,
        require:true,
        trim:true
    },
    Description:{
        type:String,
        require:true,
        trim:true
    },
    ShippingCharges:{
        type:Number,
        require:true,
        trim:true
    },
    SizeUnit :{
        type:String,
        require:true,
        trim:true
    },
    ProductQuantity:{
        type:String,
        require:true,
        trim:true
    },
    Availability:{
        type:String,
        require:true,
        trim:true
    },
SelectImage1:{
    require:true,
    type:String,
    require:true
},
SelectImage2:{
    type:String,
   
}
},{timestamps:true})
module.exports = mongoose.model('AddProducts', AddProductsSchema)