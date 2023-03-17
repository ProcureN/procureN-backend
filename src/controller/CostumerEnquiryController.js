const AddProductModel = require("../models/AddProductModel")
const CostumerEnquiryModel = require("../models/CostomerEnquiryForm")
const validator = require("../validation/validations")

const EnquiryForm = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    try {
        let data = req.body
        const { ProductName, OtherProduct, Name, Contact, AlternativeNumber, Email, State, BillingAddress, ShippingPincode } = data

        if (validator.isValidBody(data)) return res.status(400).send({ status: false, message: "Enter details to create your account" });

        //ProductName
        if (!ProductName) return res.status(400).send({ status: false, message: "ProductName is required" });
        if (validator.isValid(ProductName)) return res.status(400).send({ status: false, message: "name should not be an empty string" });

        //OtherProduct
        //  if (!OtherProduct) return res.status(400).send({ status: false, message: "OtherProduct is required" });
        if (OtherProduct) {
            if (validator.isValid(OtherProduct)) return res.status(400).send({ status: false, message: "OtherProduct should not be an empty string" });
        }
        //Name
        if (!Name) return res.status(400).send({ status: false, message: "name is required" });
        if (validator.isValid(Name)) return res.status(400).send({ status: false, message: "name should not be an empty string" });

        //Contact
        if (!Contact) return res.status(400).send({ status: false, message: "Contact is required" });
        if (validator.isValid(Contact)) return res.status(400).send({ status: false, message: "Contact should not be an empty string" });
        if (!validator.isValidPhone(Contact.trim())) return res.status(400).send({ status: false, message: "Please Enter a valid Phone number" });

        //AlternativeNumber
        if (AlternativeNumber) {
            if (validator.isValid(AlternativeNumber)) return res.status(400).send({ status: false, message: "AlternativeNumber should not be an empty string" });
            if (!validator.isValidPhone(AlternativeNumber.trim())) return res.status(400).send({ status: false, message: "Please Enter a valid AlternativeNumber" });
        }

        //Email
        if (!Email) return res.status(400).send({ status: false, message: "User Email-id is required" });
        //validating user email-id
        if (!validator.isValidEmail(Email.trim())) return res.status(400).send({ status: false, message: "Please Enter a valid Email-id" });

        //state
        if (!State) return res.status(400).send({ status: false, message: "State is required" });
        if (validator.isValid(State)) return res.status(400).send({ status: false, message: "State should not be an empty string" });

        // BillingAddress
        if (!BillingAddress) return res.status(400).send({ status: false, message: "BillingAddress is required" });
        if (validator.isValid(BillingAddress)) return res.status(400).send({ status: false, message: "BillingAddress should not be an empty string" });

        //ShippingPincode
        if (!ShippingPincode) return res.status(400).send({ status: false, message: "BillingAddress is required" });
        if (validator.isValid(ShippingPincode)) {
            return res.status(400).send({ status: false, message: "Pincode is in wrong format" })
        };
        if (!validator.isValidPincode(ShippingPincode)) {
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
        let data = await AddProductModel.find(filter)
        res.status(200).send({ status: true, data: data })
    } catch (error) {
        return res.send({ status: false, message: error.message })
    }

}
module.exports = { EnquiryForm, getEnquiries }