const VendorModel = require("../models/VendorModel");
const validator = require("../validation/validations");
const UserModel = require("../models/UserModel");
const aws = require("../aws/aws");
const moment = require("moment");
require("moment-timezone");

// const uploadFile = require("../middleware/uploads");
// const fs = require("fs");
// const { Aggregate } = require("mongoose");
// const Mail = require("nodemailer/lib/mailer");
const mongoose = require("mongoose");
// const nodemailer = require("nodemailer");
// const Mailgen = require("mailgen");
// const { EMAIL, PASSWORD } = require("../env");

const vendor = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    let data = req.body;
    let files = req.files;

   //testing 
//checking data is present or not
    if (validator.isValidBody(data)) {
      return res.status(400) .send({ 
        status: false,
         message: "Enter details to create Product"
         });
    }
    const { userID } = data;

    //check the costumer id 
    if (!validator.isValid1(userID)) {
      return res.status(400).send({
         status: false,
          message: "userID is required"
         });
    }
    //  check customer id validation
    if (!validator.isValidObjectId(userID)) {
      return res.status(400).send({ 
        status: false,
         message: "userID not valid" 
        });
    }

    let checkdata = await UserModel.findById({ _id: userID });
    if (!checkdata)
      return res.status(201).send({ 
        status: false,
         message: "user not found"
         });

         let findVchNo = await VendorModel.findOne({vchNo:data.vchNo})
         if(findVchNo){
           return res.status(404).send({status:false,message:"vchNo already exist"})
         }
    moment.tz.setDefault("Asia/Kolkata");// default time zone as india after deploy too

    // Get the current date and time
    let date = moment().format("DD/MM/YYYY");
    let time = moment().format("HH:mm:ss");
    data.date = date;
    data.time = time;
    let saveData = await VendorModel.create(data);
    res.status(201).send({ 
      status: true,
       data: saveData
       });
  } catch (error) {
    return res.status(500).send({
       status: false, 
       message: error.message }
       );
  }
};
//==================================product update======================================
const updateVendor = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    const vendorID = req.params.vendorID;
    const data = req.body;
    let vchNo = data.vchNo;
   

    let manufacturerData = await VendorModel.findById({ _id: vendorID });
    if (!manufacturerData) {
      return res.status(404).send({ 
        status: false,
         message: "no  manufacturerData found"
         });
    }
    let userID = manufacturerData.userID?.toString();
   let existingVchNo = manufacturerData.vchNo
    if (!userID) {
      return res.status(404).send({
         status: false,
          message: "user not found"
         });
    }
    let userData = await UserModel.findById(userID);
    if (!userData) {
      return res.status(404).send({ 
        status: false,
         message: "user not found" 
        });
    }
    if(existingVchNo !== vchNo){
      let vchoNoExist = await VendorModel.findOne({ vchNo: vchNo });
      // Check if the vchNo already exists and the corresponding client document is not deleted
      if (vchoNoExist && !vchoNoExist.isDeleted) {
        return res.status(400).send({ status: false, message: "vchNo already exists" });
      }
    }
    let productData = await VendorModel.findOneAndUpdate(
      { _id: vendorID },
      data,
      { new: true }
    );
    if (!productData) {
      return res.status(404).send({ 
        status: false, 
        message: "no user found to update" 
      });
    }
    return res.status(200)
      .send({ 
        status: true,
         message: "success", 
         data: productData 
        });
  } catch (error) {
    return res.status(500)
    .send({ status: false, message: error.message });
  }
};

//=======================product delete================================================

const DeleteVendor = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    let vendorID   = req.params.vendorID;
    if (!validator.isValidObjectId(vendorID)) {
      res.status(400).send({
        status: false,
         message: "Please provide valid vendor Id" });
    }
    let getId = await VendorModel.findOne({ _id: vendorID });
    if (!getId) {
      return res.status(404).send({
        status: false,
        message: "vendor Not Found for the request id",
      });
    }
    if (getId.isDeleted == true) {
      return res.status(404).send({
        status: false,
        message: "vendor is already deleted not found",
      });
    }

    await VendorModel.updateOne(
      { _id: vendorID },
      { isDeleted: true, deletedAt: Date.now() }
    );
    return res.status(200).send({
       status: true,
        message: "vendor is deleted" 
      });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//======================get products=======================================================


const getVendor = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    let filter = { isDeleted: false };

    let data = await VendorModel.aggregate([
      // { $match: filter },
      // { $group: { _id: "$vchNo", docs: { $first: "$$ROOT" } } },
      // { $sort: { "docs.createdAt": -1 } },
      // { $project: { _id: 0, docs: 1 } }
      { $match: { isDeleted: false} },
      { $group: { _id: "$vchNo", doc: { $first: "$$ROOT" } } },
      { $replaceRoot: { newRoot: "$doc" } },
      { $sort: { createdAt: -1 } },
    ]);

    if (!data || data.length === 0) {
      return res.status(404).send({ status: false, data: [] });
    }

    res.status(200).send({ status: true,  data });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};



module.exports = {
 vendor,
   updateVendor,
 DeleteVendor,
   getVendor,
  
};
