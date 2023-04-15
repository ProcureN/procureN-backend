const express = require('express')
const router = express.Router()

const { register, updateCostumer, login, deleteCostumers, getDetails, getAllDetails, Individualprofiles, countOfManufacturer, countOfRetailer } = require("../controller/CostumerController")
const { EnquiryForm, getEnquiries, IndividualCostumerEnquiry, deleteCostumerEnquiry, countData, pendingData, approvedData, updateCostumersEnquiry } = require("../controller/CostumerEnquiryController")
const { addProdcts, updateProduct, DeleteProduct, getProducts, getManufactureProducts, getproductnames, countProduct } = require("../controller/AddProductsController")
const { authentication, authorization, authorization1, authorization2 } = require("../middleware/auth")
const { requestAdmin } = require("../controller/requestAdminController")
const { otpVerification, resendOtp } = require("../controller/otpController")
const { contactform, getcontactform, deleteContactForm, countOfContactForm } = require("../controller/contactUsController")

router.get("/test-me", function (req, res) {
  res.send("this is successfully created");
});

//=============================costumer==================================
router.post("/register", register)
router.put("/UpdateCostumer/:customerID", authentication, authorization, updateCostumer)
router.delete("/deletecostumer/:customerID", authentication, authorization, deleteCostumers)
router.post("/login", login)
router.get("/getroles/:page/:limit", authentication, getDetails)  // by admin
router.get("/getAllDetails/:page/:limit", getAllDetails) // by admin
router.get("/Individualprofiles/:customerID", Individualprofiles)
router.get("/countOfManufacturer", countOfManufacturer)
router.get("/countOfRetailer", countOfRetailer)

//============================enquiry form ============================
router.post("/costumer/enquiryForm", authentication, authorization, EnquiryForm)
router.get("/getenquiries/:page/:limit", getEnquiries)  // by admin
router.get("/IndividualcustomerEnquiry/:customerID/:page/:limit", IndividualCostumerEnquiry)
router.delete("/deleteCostumerEnquiry/:customerEnquiryId", authentication, authorization2, deleteCostumerEnquiry)  // by admin
router.put("/updateCostumersEnquiry/:customerEnquiryId", authentication, authorization2, updateCostumersEnquiry)
router.get("/countData", countData)
router.get("/pendingData", pendingData)
router.get("/approvedData", approvedData)

//=======================Add products===========================
router.post("/addProducts", addProdcts)
router.put("/updateProducts/:productID", authentication, authorization1, updateProduct)
router.delete("/products/:productID", authentication, authorization1, DeleteProduct)
router.get("/getproducts/:page/:limit", authentication, getProducts)  // by admin 
router.get("/getproducts/:customerID/:page/:limit", getManufactureProducts)
router.get("/getproductnames", getproductnames)
router.get("/countProduct", countProduct)

//=============================otp verification===================================
router.post("/otp", otpVerification)
router.post("/resendOtp", resendOtp)

//=============================requestAdmin=======================================
router.post("/admin", requestAdmin) // by admin

//======================contactform================================
router.post("/contactform", contactform)
router.get("/getcontactform/:page/:limit", getcontactform)//by admin
router.delete("/deleteContactForm/", deleteContactForm) // by admin
router.get("/countOfContactForm", countOfContactForm)

module.exports = router  