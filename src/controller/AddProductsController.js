const AddProductsModel = require("../models/AddProductModel")
const validator=require("../validation/validations")
const addProdcts = async (req, res) => {
    try {
    let data = req.body
    let files = req.files 

    if (validator.isValidBody(data)) {
        return res.status(400).send({ status: false, message: "Enter details to create Product" });
    }
    if (!validator.isValidFiles(files)) {
        return res.status(400).send({ status: false, message: "productImage is required" })
    }
    const { ProductName, Category, SubCategory, Manufacturer, priceBeforeDiscount, Price, WithGST, Description, ShippingCharges, SizeUnit, ProductQuantity, Availability, SelectImage1, SelectImage2 } = data
    
   
    //ProductName
    if (!ProductName) return res.status(400).send({ status: false, message: "ProductName is required" });
    if (validator.isValid(ProductName)) return res.status(400).send({ status: false, message: "name should not be an empty string" });

    //Category
    if (!Category) return res.status(400).send({ status: false, message: "Category is required" });
    if (validator.isValid(Category)) return res.status(400).send({ status: false, message: "Category should not be an empty string" });

    //SubCategory
    if (!SubCategory) return res.status(400).send({ status: false, message: "SubCategory is required" });
    if (validator.isValid(SubCategory)) return res.status(400).send({ status: false, message: "SubCategory should not be an empty string" });

    //Manufacturer
    if (!Manufacturer) return res.status(400).send({ status: false, message: "Manufacturer is required" });
    if (validator.isValid(Manufacturer)) return res.status(400).send({ status: false, message: "Manufacturer should not be an empty string" });

    //priceBeforeDiscount
    if (!validator.isValid1(priceBeforeDiscount)) {
        return res.status(400).send({ status: false, message: "price is required" })
    }
    if (!validator.isValidPrice(priceBeforeDiscount)) {
        return res.status(400).send({ status: false, message: "Enter a Valid priceBeforeDiscount" })
    }
//Price
if (!validator.isValid1(Price)) {
    return res.status(400).send({ status: false, message: "price is required" })
}
if (!validator.isValidPrice(Price)) {
    return res.status(400).send({ status: false, message: "Enter a Valid Price" })
}
//WithGST
if (!validator.isValid1(WithGST)) {
    return res.status(400).send({ status: false, message: "WithGST is required" })
}
if (!validator.isValidPrice(WithGST)) {
    return res.status(400).send({ status: false, message: "Enter a Valid WithGST" })
}
//Description
if (!Description) return res.status(400).send({ status: false, message: "Description is required" });
if (validator.isValid(Description)) return res.status(400).send({ status: false, message: "Description should not be an empty string" });

//ShippingCharges
if (!validator.isValid1(ShippingCharges)) {
    return res.status(400).send({ status: false, message: "ShippingCharges is required" })
}
if (!validator.isValidPrice(ShippingCharges)) {
    return res.status(400).send({ status: false, message: "Enter a Valid ShippingCharges" })
}
//SizeUnit
if (!SizeUnit) return res.status(400).send({ status: false, message: "SizeUnit is required" });
if (validator.isValid(SizeUnit)) return res.status(400).send({ status: false, message: "SizeUnit should not be an empty string" });

//ProductQuantity
if (!ProductQuantity) return res.status(400).send({ status: false, message: "ProductQuantity is required" });
if (validator.isValid(ProductQuantity)) return res.status(400).send({ status: false, message: "ProductQuantity should not be an empty string" });

//Availability
if (!Availability) return res.status(400).send({ status: false, message: "Availability is required" });
if (validator.isValid(Availability)) return res.status(400).send({ status: false, message: "Availability should not be an empty string" });

//SelectImage1
if(SelectImage1){
if (!SelectImage1) return res.status(400).send({ status: false, message: "SelectImage1 is required" });
if (validator.isValid(SelectImage1)) return res.status(400).send({ status: false, message: "SelectImage1 should not be an empty string" });
}
//SelectImage2
if(SelectImage2){
    if (!SelectImage2) return res.status(400).send({ status: false, message: "SelectImage2 is required" });
    if (validator.isValid(SelectImage2)) return res.status(400).send({ status: false, message: "SelectImage2 should not be an empty string" });
    }
    let saveData = await AddProductsModel.create(data)
    res.status(201).send({ status: true, data: saveData })
} catch (error) {
    return res.send({ status: false, message: error.message })
}
}
module.exports = { addProdcts }