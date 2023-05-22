const express = require('express')
const router = express.Router()

const { register, updateCostumer, login, updatePassword, deleteCostumers, getDetails, getAllDetails, Individualprofiles, UniqueEmail,uniquePhone ,countOfManufacturerAndRetailer } = require("../controller/CostumerController")
const { EnquiryForm, getEnquiries, IndividualCostumerEnquiry, deleteCostumerEnquiry, countData,  updateCostumersEnquiry,trackEnquiry ,allData,IndividualCostumerEnquiryCounts,countOfStatusByCustomerId} = require("../controller/CostumerEnquiryController")
const { authentication, authorization, authorization1, authorization2 ,authorization3} = require("../middleware/auth")
const { requestAdmin } = require("../controller/requestAdminController")
const { otpVerification, resendOtp,forgetPassword } = require("../controller/otpController")
const { contactform, getcontactform, deleteContactForm, countOfContactForm } = require("../controller/contactUsController")
const {addProdcts, updateProduct, DeleteProduct, getProducts, getManufactureProducts,getproductnames,countProduct,pending,rejected,approved,countOfInprocessing,countOfinTransit,countOfinshipped,countOfindelivered ,productsByStatus,getCounts ,individualProductsCount,countOfStatusByCustomerIdOfProducts} = require("../controller/AddProductsController")


router.get("/test-me", function (req, res) {
  res.send("this is successfully created");

  
});
//=============================costumer==================================

router.post("/UniqueEmail",UniqueEmail)
router.post("/uniquePhone",uniquePhone)

router.post("/register", register)
router.put("/UpdateCostumer/:customerID", authentication, authorization3, updateCostumer)
router.put("/updatepassword", updatePassword ) 
router.delete("/deletecostumer/:customerID", authentication, authorization3, deleteCostumers)
router.post("/login", login)
router.get("/getroles/:page/:limit", authentication, getDetails)  // by admin
router.get("/getAllDetails/:page/:limit", getAllDetails) // by admin
router.get("/Individualprofiles/:customerID", Individualprofiles)
// router.get("/countOfManufacturer", countOfManufacturer)
// router.get("/countOfRetailer", countOfRetailer)
router.get("/countOfManufacturerAndRetailer",countOfManufacturerAndRetailer)

//============================enquiry form ============================
router.post("/costumer/enquiryForm", authentication, authorization, EnquiryForm)
router.get("/getenquiries/:page/:limit", getEnquiries)  // by admin
router.get("/IndividualcustomerEnquiry/:customerID/:page/:limit",authentication, authorization, IndividualCostumerEnquiry)
router.delete("/deleteCostumerEnquiry/:customerEnquiryId", authentication, authorization2, deleteCostumerEnquiry)  // by admin
router.put("/updateCostumersEnquiry/:customerEnquiryId", authentication, authorization2, updateCostumersEnquiry)
router.get("/countData", countData)
 router.get("/trackEnquiry/:trackingID",trackEnquiry)
router.get("/allDataOfEnquiries",allData)
router.get("/individualcostumerenquirycounts/:customerID",IndividualCostumerEnquiryCounts)
router.get("/countOfStatusByCustomerId/:limit",countOfStatusByCustomerId)
//=======================Add products===================================
router.post("/addProducts", addProdcts)
router.put("/updateProducts/:productID", authentication, authorization1, updateProduct)
router.delete("/products/:productID", authentication, authorization1, DeleteProduct)
router.get("/getproducts/:page/:limit",  getProducts)  // by admin 
router.get("/getproducts/:customerID/:page/:limit", getManufactureProducts)
router.get("/getproductnames", getproductnames)
router.get("/countProduct", countProduct)
router.get("/pendingProducts",pending)
router.get("/approvedProducts", approved)
router.get('/rejectedProducts',rejected)
router.get("/countOfInprocessingProducts",countOfInprocessing)
router.get("/countOfindeliveredProducts",countOfindelivered)
router.get("/countOfinshippedProducts",countOfinshipped)
router.get("/countOfinTransitProducts",countOfinTransit)
//router.get('/productsByStatus',productsByStatus)
router.get("/getCountsOfProduct",getCounts)
router.get('/individualproductscount/:customerID',individualProductsCount)
router.get("/countOfStatusByCustomerIdOfProducts/:limit",countOfStatusByCustomerIdOfProducts)

//=============================otp verification===================================
router.post("/otp", otpVerification)
router.post("/resendOtp", resendOtp)
router.put("/forgetPassword",forgetPassword)

//=============================requestAdmin=======================================
router.post("/admin", requestAdmin) // by admin

//======================contactform================================
router.post("/contactform", contactform)
router.get("/getcontactform/:page/:limit", getcontactform)//by admin
router.delete("/deleteContactForm/:contactUsId",authentication, authorization3 ,deleteContactForm) // by admin
router.get("/countOfContactForm", countOfContactForm)

module.exports = router  