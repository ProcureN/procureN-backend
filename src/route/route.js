const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer({ dest: 'uploads/' })  

router.post("/upload",upload.single('try'),(req,res)=>{
  console.log(req.file)
  console.log(req.body)
})
const {
  register, updateCostumer, login, updatePassword, deleteCostumers,getDetails,getAllDetails,Individualprofiles,UniqueEmail, uniquePhone, countOfManufacturerAndRetailer,} = require("../controller/CostumerController");
const { client, getClientsDetails,Individualclient, deleteClient, countData,updateclient,trackEnquiry, allData,IndividualCostumerEnquiryCounts, countOfStatusByCustomerId,
} = require("../controller/ClientController");
//const { authentication, authorization, authorization1, authorization2 ,authorization3} = require("../middleware/auth")
const { requestAdmin } = require("../controller/requestAdminController");
const {otpVerification, resendOtp, forgetPassword,} = require("../controller/otpController");
const { contactform, getcontactform, deleteContactForm, countOfContactForm,} = require("../controller/contactUsController");
const {
  vendor,  updateVendor,  DeleteVendor,  getVendor,  getManufactureProducts, getproductnames, countProduct,  pending,rejected,approved, countOfInprocessing, countOfinshipped, countOfindelivered,
 getCounts,individualProductsCount,countOfStatusByCustomerIdOfProducts,
} = require("../controller/VendorsController");

router.get("/test-me", function (req, res) {
  res.send("this is successfully created");
});
//=============================costumer==================================

router.post("/UniqueEmail", UniqueEmail);
router.post("/uniquePhone", uniquePhone);

router.post("/register", register);
router.put(
  "/UpdateCostumer/:customerID",
  // authentication,
  // authorization3,
  updateCostumer
);
router.put("/updatepassword", updatePassword);
router.delete(
  "/deletecostumer/:customerID",
  // authentication,
  // authorization3,
  deleteCostumers
);
router.post("/login", login);
router.get(
  "/getroles",
  //authentication,
  getDetails
); // by admin
router.get("/getAllDetails/:page/:limit", getAllDetails); // by admin
router.get("/Individualprofiles/:customerID", Individualprofiles);
// router.get("/countOfManufacturer", countOfManufacturer)
// router.get("/countOfRetailer", countOfRetailer)
router.get("/countOfManufacturerAndRetailer", countOfManufacturerAndRetailer);

//============================client ============================
router.post("/client", client);
router.get("/getclient/:page/:limit", getClientsDetails); // by admin
router.put(
  "/updateclient/:clientId",
  // authentication,
  // authorization2,
  updateclient
);
router.get(
  "/Individualclient/:userID/:page/:limit",
  // authentication,
  // authorization,
  Individualclient
);
router.delete(
  "/deleteClient/:clientId",
  // authentication,
  // authorization2,
  deleteClient
); // by admin

router.get("/countData", countData);
router.get("/trackEnquiry/:trackingID", trackEnquiry);
router.get("/allDataOfEnquiries", allData);
router.get(
  "/individualcostumerenquirycounts/:customerID",
  IndividualCostumerEnquiryCounts
);
router.get("/countOfStatusByCustomerId/:limit", countOfStatusByCustomerId);
//======================= vendor ===================================
router.post("/vendor", vendor);
router.get("/getVendor/:page/:limit", getVendor);
router.put(
  "/updateVendor/:vendorID",
  // authentication,
  // authorization1,
  updateVendor
);
router.delete(
  "/DeleteVendor/:productID",
  // authentication,
  // authorization1,
  DeleteVendor
);
 // by admin
router.get("/getproducts/:customerID/:page/:limit", getManufactureProducts);
router.get("/getproductnames", getproductnames);
router.get("/countProduct", countProduct);
router.get("/pendingProducts", pending);
router.get("/approvedProducts", approved);
router.get("/rejectedProducts", rejected);
router.get("/countOfInprocessingProducts", countOfInprocessing);
router.get("/countOfindeliveredProducts", countOfindelivered);
router.get("/countOfinshippedProducts", countOfinshipped);

//router.get('/productsByStatus',productsByStatus)
router.get("/getCountsOfProduct", getCounts);
router.get("/individualproductscount/:customerID", individualProductsCount);
router.get(
  "/countOfStatusByCustomerIdOfProducts/:limit",
  countOfStatusByCustomerIdOfProducts
);

//=============================otp verification===================================
router.post("/otp", otpVerification);
router.post("/resendOtp", resendOtp);
router.put("/forgetPassword", forgetPassword);

//=============================requestAdmin=======================================
//router.post("/admin", requestAdmin); // by admin

//======================contactform================================
router.post("/contactform", contactform);
router.get("/getcontactform/:page/:limit", getcontactform); //by admin
router.delete(
  "/deleteContactForm/:contactUsId",
  // authentication,
  // authorization3,
  deleteContactForm
); // by admin
router.get("/countOfContactForm", countOfContactForm);

module.exports = router;
