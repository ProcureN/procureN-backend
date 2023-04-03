const AddProductModel = require("../models/AddProductModel")
const CostumerEnquiryModel = require("../models/CostomerEnquiryForm")
const CostumerModel = require("../models/CostumerModel")
const validator = require("../validation/validations")

const EnquiryForm = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    try {
        let costumerId = req.params.customerID
        let data = req.body
        const { productName, otherProduct, name, contact, alternativeNumber, email, state, billingAddress, shippingPincode } = data

        if (validator.isValidBody(data)) return res.status(400).send({ status: false, message: "Enter details to create your account" });

        let getCostumers = await CostumerModel.findOne({_id:costumerId,isDeleted:false})
        if(!getCostumers){
            return res.status(404).send({status:false,msg:"user not found or already deleted"})
        }
        //ProductName
        if (!productName) return res.status(400).send({ status: false, message: "ProductName is required" });
        if (validator.isValid(productName)) return res.status(400).send({ status: false, message: "name should not be an empty string" });

        //OtherProduct
        //  if (!OtherProduct) return res.status(400).send({ status: false, message: "OtherProduct is required" });
        if (otherProduct) {
            if (validator.isValid(otherProduct)) return res.status(400).send({ status: false, message: "OtherProduct should not be an empty string" });
        }
        //Name
        if (!name) return res.status(400).send({ status: false, message: "name is required" });
        if (validator.isValid(name)) return res.status(400).send({ status: false, message: "name should not be an empty string" });

        //Contact
        if (!contact) return res.status(400).send({ status: false, message: "Contact is required" });
        if (validator.isValid(contact)) return res.status(400).send({ status: false, message: "Contact should not be an empty string" });
        if (!validator.isValidPhone(contact.trim())) return res.status(400).send({ status: false, message: "Please Enter a valid Phone number" });

        //AlternativeNumber
        if (alternativeNumber) {
            if (validator.isValid(alternativeNumber)) return res.status(400).send({ status: false, message: "alternativeNumber should not be an empty string" });
            if (!validator.isValidPhone(alternativeNumber.trim())) return res.status(400).send({ status: false, message: "Please Enter a valid alternativeNumber" });
        }

        //Email
        if (!email) return res.status(400).send({ status: false, message: "User email-id is required" });
        //validating user email-id
        if (!validator.isValidEmail(email.trim())) return res.status(400).send({ status: false, message: "Please Enter a valid email-id" });

        //state
        if (!state) return res.status(400).send({ status: false, message: "State is required" });
        if (validator.isValid(state)) return res.status(400).send({ status: false, message: "State should not be an empty string" });

        // BillingAddress
        if (!billingAddress) return res.status(400).send({ status: false, message: "BillingAddress is required" });
        if (validator.isValid(billingAddress)) return res.status(400).send({ status: false, message: "BillingAddress should not be an empty string" });

        //ShippingPincode
        if (!shippingPincode) return res.status(400).send({ status: false, message: "BillingAddress is required" });
        if (validator.isValid(shippingPincode)) {
            return res.status(400).send({ status: false, message: "Pincode is in wrong format" })
        };
        if (!validator.isValidPincode(shippingPincode)) {
            return res.status(400).send({ status: false, message: "Please Provide valid Pincode" })
        };
        let saveData = await CostumerEnquiryModel.create(data)
        res.status(201).send({ status: true, data: saveData })
    } catch (error) {
        return res.send({ status: false, message: error.message })
    }



}
//===================================================================

const getEnquiries = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    try {
        let filter = { isDeleted: false }
        let data = await CostumerEnquiryModel.find(filter)
        res.status(200).send({ status: true, data: data })
    } catch (error) {
        return res.send({ status: false, message: error.message })
    }

}
module.exports = { EnquiryForm, getEnquiries }