const AddProductsModel = require("../models/AddProductModel")
const validator = require("../validation/validations")
const aws = require("../aws/aws")
const addProdcts = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
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
        // if (SelectImage1) {
        //     if (!SelectImage1) return res.status(400).send({ status: false, message: "SelectImage1 is required" });
        //     if (validator.isValid(SelectImage1)) return res.status(400).send({ status: false, message: "SelectImage1 should not be an empty string" });
        if (files && files.length > 0) {
            let productImgUrl = await aws.uploadFile(files[0])
            data.SelectImage1 = productImgUrl
        }
        // }
        //SelectImage2
        // if (SelectImage2) {
        //     if (!SelectImage2) return res.status(400).send({ status: false, message: "SelectImage2 is required" });
        // if (validator.isValid(SelectImage2)) return res.status(400).send({ status: false, message: "SelectImage2 should not be an empty string" });
        if (files && files.length > 0) {
            let productImgUrl1 = await aws.uploadFile(files[1])
            data.SelectImage2 = productImgUrl1
        }

        // }
        let saveData = await AddProductsModel.create(data)
        res.status(201).send({ status: true, data: saveData })
    } catch (error) {
        return res.send({ status: false, message: error.message })
    }
}
//==================================product update======================================
const updateProduct = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    try {
        const productID = req.params.productID
        const data = req.body
        let files = req.files
        if (validator.isValidBody(data)) {
            return res.status(400).send({ status: false, message: "Enter details to create Product" });
        }

        let { ProductName, Category, SubCategory, Manufacturer, priceBeforeDiscount, Price, WithGST, Description, ShippingCharges, SizeUnit, ProductQuantity, Availability, SelectImage1, SelectImage2 } = data
        if (SelectImage1 || SelectImage2) {
            if (!validator.isValidFiles(files)) {
                return res.status(400).send({ status: false, message: "productImage is required" })
            }
        }
        if (ProductName) {
            if (!ProductName) return res.status(400).send({ status: false, message: "ProductName is required" });
            if (validator.isValid(ProductName)) return res.status(400).send({ status: false, message: "name should not be an empty string" });
        }

        if (Category) {
            if (!Category) return res.status(400).send({ status: false, message: "Category is required" });
            if (validator.isValid(Category)) return res.status(400).send({ status: false, message: "Category should not be an empty string" });
        }

        if (SubCategory) {
            if (!SubCategory) return res.status(400).send({ status: false, message: "SubCategory is required" });
            if (validator.isValid(SubCategory)) return res.status(400).send({ status: false, message: "SubCategory should not be an empty string" });
        }

        if (Manufacturer) {
            if (!Manufacturer) return res.status(400).send({ status: false, message: "Manufacturer is required" });
            if (validator.isValid(Manufacturer)) return res.status(400).send({ status: false, message: "Manufacturer should not be an empty string" });
        }

        if (priceBeforeDiscount) {
            if (!validator.isValid1(priceBeforeDiscount)) {
                return res.status(400).send({ status: false, message: "price is required" })
            }
            if (!validator.isValidPrice(priceBeforeDiscount)) {
                return res.status(400).send({ status: false, message: "Enter a Valid priceBeforeDiscount" })
            }
        }
        //Price
        if (Price) {
            if (!validator.isValid1(Price)) {
                return res.status(400).send({ status: false, message: "price is required" })
            }
            if (!validator.isValidPrice(Price)) {
                return res.status(400).send({ status: false, message: "Enter a Valid Price" })
            }
        }
        //WithGST
        if (WithGST) {
            if (!validator.isValid1(WithGST)) {
                return res.status(400).send({ status: false, message: "WithGST is required" })
            }
            if (!validator.isValidPrice(WithGST)) {
                return res.status(400).send({ status: false, message: "Enter a Valid WithGST" })
            }
        }

        if (Description) {
            if (!Description) return res.status(400).send({ status: false, message: "Description is required" });
            if (validator.isValid(Description)) return res.status(400).send({ status: false, message: "Description should not be an empty string" });
        }

        if (ShippingCharges) {
            if (!validator.isValid1(ShippingCharges)) {
                return res.status(400).send({ status: false, message: "ShippingCharges is required" })
            }
            if (!validator.isValidPrice(ShippingCharges)) {
                return res.status(400).send({ status: false, message: "Enter a Valid ShippingCharges" })
            }
        }

        if (SizeUnit) {
            if (!SizeUnit) return res.status(400).send({ status: false, message: "SizeUnit is required" });
            if (validator.isValid(SizeUnit)) return res.status(400).send({ status: false, message: "SizeUnit should not be an empty string" });
        }

        if (ProductQuantity) {
            if (!ProductQuantity) return res.status(400).send({ status: false, message: "ProductQuantity is required" });
            if (validator.isValid(ProductQuantity)) return res.status(400).send({ status: false, message: "ProductQuantity should not be an empty string" });
        }
        if (Availability) {
            if (!Availability) return res.status(400).send({ status: false, message: "Availability is required" });
            if (validator.isValid(Availability)) return res.status(400).send({ status: false, message: "Availability should not be an empty string" });
        }

        if (SelectImage1) {
            if (!SelectImage1) return res.status(400).send({ status: false, message: "SelectImage1 is required" });
            if (validator.isValid(SelectImage1)) return res.status(400).send({ status: false, message: "SelectImage1 should not be an empty string" });
        }
        //SelectImage2
        if (SelectImage2) {
            if (!SelectImage2) return res.status(400).send({ status: false, message: "SelectImage2 is required" });
            if (validator.isValid(SelectImage2)) return res.status(400).send({ status: false, message: "SelectImage2 should not be an empty string" });
        }
        let productData = await AddProductsModel.findOneAndUpdate({ _id: productID }, data, { new: true })
        if (!productData) { return res.status(404).send({ satus: false, message: "no user found to update" }) }
        return res.status(200).send({ satus: true, message: "success", data: productData })
    } catch (error) {
        return res.send({ status: false, message: error.message })
    }

}

//=======================product delete================================================

const DeleteProduct = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    try {
        let productID = req.params.productID
        if (!validator.isValidObjectId(productID)) { res.status(400).send({ status: false, message: "Please provide valid Product Id" }) }
        let getId = await AddProductsModel.findOne({ _id: productID });
        if (!getId) { return res.status(404).send({ status: false, message: "Product Not Found for the request id" }) }
        if (getId.isDeleted == true) { return res.status(404).send({ status: false, message: "Product is already deleted not found" }) }

        await AddProductsModel.updateOne({ _id: productID }, { isDeleted: true, deletedAt: Date.now() })
        return res.status(200).send({ status: true, message: "Product is deleted" })
    } catch (error) {
        return res.send({ status: false, message: error.message })
    }
}

//======================get products=======================================================
const getProducts = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    try {
        let filter = { isDeleted: false }
        let data = await AddProductsModel.find(filter)
        res.status(200).send({ status: true, data: data })
    } catch (error) {
        return res.send({ status: false, message: error.message })
    }

}
module.exports = { addProdcts, updateProduct, DeleteProduct, getProducts }