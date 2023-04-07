const express = require('express')
const router = express.Router()

const { register, updateCostumer, login, deleteCostumers, getDetails,getAllDetails ,Individualprofiles} = require("../controller/CostumerController")
const { EnquiryForm, getEnquiries,IndividualCostumerEnquiry,deleteCostumerEnquiry } = require("../controller/CostumerEnquiryController")
const { addProdcts, updateProduct, DeleteProduct, getProducts, getManufactureProducts,getproductnames } = require("../controller/AddProductsController")
const { authentication, authorization, authorization1,authorization2 } = require("../middleware/auth")
 const {requestAdmin}=require("../controller/requestAdminController")
const {otpVerification,resendOtp} =require("../controller/otpController")
const {contactform,getcontactform,deleteContactForm}=require("../controller/contactUsController")

router.get("/test-me", function (req, res) {
  res.send("this is successfully created");
});
//=============================costumer==================================
router.post("/register", register)
router.put("/UpdateCostumer/:customerID", authentication, authorization, updateCostumer)
router.delete("/deletecostumer/:customerID", authentication, authorization, deleteCostumers)
router.post("/login", login)
router.get("/getroles", authentication, getDetails)  // by admin
router.get("/getAllDetails/:limits/:page",getAllDetails) // by admin
router.get("/Individualprofiles/:customerID", authentication, authorization, Individualprofiles)
//============================enquiry form ============================
router.post("/costumer/enquiryForm", authentication, authorization, EnquiryForm)
router.get("/getenquiries", getEnquiries)  // by admin
router.get("/IndividualcustomerEnquiry/:customerID",authentication, authorization,IndividualCostumerEnquiry)
router.delete("/deleteCostumerEnquiry/:customerEnquiryId",authentication, authorization2,deleteCostumerEnquiry)  // by admin
//router.put("/updateCostumersEnquiry",updateCostumersEnquiry)
//=======================Add products===========================
router.post("/addProducts", authentication, addProdcts)
router.put("/updateProducts/:productID", authentication, authorization1, updateProduct)
router.delete("/products/:productID", authentication, authorization1, DeleteProduct)
router.get("/getproducts",authentication, getProducts)  // by admin
router.get("/getproducts/:customerID",authentication, getManufactureProducts) 
router.get("/getproductnames",getproductnames)
//=============================otp verification===================================
router.post("/otp",otpVerification)
router.post("/resendOtp",resendOtp)

//=============================requestAdmin=======================================
router.post("/admin",requestAdmin) // by admin

//======================contactform================================
router.post("/contactform",contactform)
router.get("/getcontactform",getcontactform)//by admin
router.delete("/deleteContactForm/",deleteContactForm) // by admin

module.exports = router  