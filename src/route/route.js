const express = require('express')
const router = express.Router()

const { register, updateCostumer, login, deleteCostumers, getDetails } = require("../controller/CostumerController")
const { EnquiryForm, getEnquiries } = require("../controller/CostumerEnquiryController")
const { addProdcts, updateProduct, DeleteProduct, getProducts } = require("../controller/AddProductsController")
const { authentication, authorization, authorization1 } = require("../middleware/auth")
 const {requestAdmin}=require("../controller/requestAdminController")
const {otpVerification,resendOtp} =require("../controller/otpController")
const {contactform,getcontactform}=require("../controller/contactUsController")

router.get("/test-me", function (req, res) {
  res.send("this is successfully created");
});
//=============================costumer==================================
router.post("/register", register)
router.put("/UpdateCostumer/:customerID", authentication, authorization, updateCostumer)
router.delete("/deletecostumer/:customerID", authentication, authorization, deleteCostumers)
router.post("/login", login)
router.get("/getroles", authentication, getDetails)
//============================enquiry form ============================
router.post("/Costumer/EnquiryForm/:customerID", authentication, authorization, EnquiryForm)
router.get("/getenquiries", getEnquiries)
//=======================Add products===========================
router.post("/AddProducts", authentication, addProdcts)
router.put("/updateProducts/:productID", authentication, authorization1, updateProduct)
router.delete("/products/:productID", authentication, authorization1, DeleteProduct)
router.get("/getproducts", getProducts)
//=============================otp verification===================================
router.post("/otp",otpVerification)
router.post("/resendOtp",resendOtp)

//=============================requestAdmin=======================================
router.post("/admin",requestAdmin)

//======================contactform================================
router.post("/contactform",contactform)
router.get("/getcontactform",getcontactform)

module.exports = router  