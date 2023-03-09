const express = require('express')
const router = express.Router()

const {register,updateCostumer,login,deleteCostumers} = require("../controller/CostumerController")
const {EnquiryForm}= require("../controller/CostumerEnquiryController")
const {addProdcts}=require("../controller/AddProductsController")
const {authentication, authorization}=require("../middleware/auth")

router.get("/test-me", function (req, res) {
    res.send("this is successfully created");
  });
//=============================costumer==================================
router.post("/Register",register)
router.put("/UpdateCostumer/:customerID",authentication, authorization,updateCostumer)
router.delete("/deletecostumer/:CostumerID",deleteCostumers)
router.post("/login",login)
//============================enquiry form ============================
router.post("/Costumer/EnquiryForm",EnquiryForm)
//=======================Add products===========================

router.post("/AddProducts",addProdcts)

module.exports = router 