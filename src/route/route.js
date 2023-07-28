const express = require("express");
const router = express.Router();
const fs = require("fs");
const app = express();
const path = require("path");
const multer = require("multer");
const uploadController = require("../controller/uploadController");
app.use(express.static(path.resolve(__dirname, "src/public")));
//==================================================================================================
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const directory = "src/public/uploads";
    fs.mkdirSync(directory, { recursive: true }); // Create the directory if it doesn't exist
    cb(null, directory);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
var upload = multer({ storage: storage });
router.post("/importUser", upload.single("file"), uploadController.importUser);
router.post(
  "/importVendor",
  upload.single("file"),
  uploadController.importVendor
);
//=================================================================================================
const {
  register,
  updateCostumer,
  login,
  updatePassword,
  deleteCostumers,
  getDetails,
  getAllDetails,
  Individualprofiles,
  UniqueEmail,
  uniquePhone,
} = require("../controller/CostumerController");
const {
  client,
  getclient,
  Individualclient,
  deleteClient,
  updateclient,
  uniqueVchNo
} = require("../controller/ClientController");
const {
  authentication,
  authorization,
  authorization1,
  // authorization2,
  authorization3,
} = require("../middleware/auth");

const {
  otpVerification,
  resendOtp,
  forgetPassword,
} = require("../controller/otpController");
const {
  contactform,
  getcontactform,
  deleteContactForm,
  countOfContactForm,
  updateContactUs,
} = require("../controller/contactUsController");
const {
  vendor,
  updateVendor,
  DeleteVendor,
  getVendor,
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

//============================client ============================
router.post("/client", client);
router.get("/getclient", authentication, getclient); // by admin
router.put(
  "/updateclient/:clientId" /*  */,
  authentication,
  authorization,
  updateclient
);
router.delete(
  "/deleteClient/:clientId",
  authentication,
  authorization,
  deleteClient
);
//router.get("/uniqueVchNo",uniqueVchNo)
//======================= vendor ===================================
router.post("/vendor", vendor);
router.get("/getVendor", authentication, getVendor);
router.put(
  "/updateVendor/:vendorID",
  authentication,
  authorization1,
  updateVendor
);
router.delete(
  "/DeleteVendor/:vendorID",
  authentication,
  authorization1,
  DeleteVendor
);
// by admin
//======================contactform================================
router.post("/contactform", contactform);
router.get("/getcontactform", authentication, getcontactform); //by admin
router.delete(
  "/deleteContactForm/:contactUsId/:userID",
  authentication,
  authorization3,
  deleteContactForm
); // by admin
router.put(
  "/updateContactUs/:contactUsId/:userID",
  authentication,
  authorization3,
  updateContactUs
);
//=============================otp verification===================================
router.post("/otp", otpVerification);
router.post("/resendOtp", resendOtp);
router.put("/forgetPassword", forgetPassword);



module.exports = router;
