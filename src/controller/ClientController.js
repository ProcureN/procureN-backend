const AddProductModel = require("../models/VendorModel");
const clientModel = require("../models/clientModel");
const UserModel = require("../models/UserModel");
const validator = require("../validation/validations");
const moment = require("moment");
require("moment-timezone");
require('dotenv').config();
const Mail = require("nodemailer/lib/mailer");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const { EMAIL, PASSWORD } = require("../env");

const client = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    //   let costumerId = req.params.customerID
    let data = req.body;
    const { userID } = data;

    if (!validator.isValid1(userID)) {
      //checking user id required
      return res.status(400).send({
        status: false,
        message: "userID is required",
      });
    }
    if (!validator.isValidObjectId(userID)) {
      //user id (objectid) validation
      return res.status(400).send({
        status: false,
        message: "userID not valid",
      });
    }
    let getCostumers = await UserModel.findOne({
      _id: userID,
      isDeleted: false,
    }); //checking the user is present and not deleted
    if (!getCostumers) {
      return res.status(404).send({
        status: false,
        message: "user not found or already deleted",
      });
    }
    let findVchNo = await clientModel.findOne({vchNo:data.vchNo})
    if(findVchNo){
      return res.status(404).send({status:false,message:"vchNo already exist"})
    }
    moment.tz.setDefault("Asia/Kolkata"); //default timezone as india

    // Get the current date and time
    let date = moment().format("DD/MM/YYYY"); //saving date and time
    let time = moment().format("HH:mm:ss");
    data.date = date;
    data.time = time;
    let saveData = await clientModel.create(data);

    res.status(201).send({ status: true, data: saveData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//==========================================================================================================

const getclient = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    let data = await clientModel.aggregate([
      { $match: { isDeleted: false } }, //maching the key and the value
      { $group: { _id: "$vchNo", doc: { $first: "$$ROOT" } } }, // grouping with vchNo and fetching the 1sy docs
      { $replaceRoot: { newRoot: "$doc" } }, //replacing the doc with new root
      { $sort: { createdAt: -1 } }, //sorting in the deceasing order
    ]);

    if (!data || data.length === 0) {
      return res.status(404).send({ status: false, message: "Not found" });
    }

    res.status(200).send({ status: true, data: data });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//==========================update costumers =========================================
const updateclient = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    let data = req.body;
    const clientId = req.params.clientId; //getting the client id from the path params
  

    let getclient = await clientModel.findById(clientId);
    if (!getclient) {
      return res.status(404).send({
        status: false,
        message: "no customer enquiry found",
      });
    }
    let userID = getclient.userID?.toString(); // converting the object id to string
    
    if (!userID) {
      return res.status(404).send({
        status: false,
        message: "userID not found",
      });
    }
    let user = await UserModel.findById(userID);
    if (!user) {
      return res.status(404).send({ status: false, message: "user not found" });
    }
    let userData = await clientModel.findOneAndUpdate({ _id: clientId }, data, {
      new: true,
    });
    if (!userData) {
      return res.status(404).send({
        status: false,
        message: "no user found to update",
      });
    }
    return res
      .status(200)
      .send({ status: true, message: "success", data: userData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//=========================================get individual costumer enquiry================================

const Individualclient = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    let userID = req.params.userID;  //user id om path params

    if (!validator.isValid1(userID)) {
      return res.status(400).send({
        status: false,
        message: "costumerID is required",
      });
    }
    if (!validator.isValidObjectId(userID)) {
      return res.status(400).send({
        status: false,
        message: "costumerID not valid",
      });
    }

    const resultsPerPage =req.params.limit === ":limit" ? 10 : req.params.limit; //pagination
    let page = req.params.page >= 1 ? req.params.page : 1;
    page = page - 1;
    //const query = req.query.search;
    let CountOfData = await clientModel  //finding the count of user and not deleted
      .find({
        isDeleted: false,
        userID: userID,
      })
      .countDocuments();
    let getData = await clientModel  //finding the docs doc of user id, not deleted and appling the pagination
      .find({
        isDeleted: false,
        userID: userID,
      })
      .sort({ createdAt: -1 })
      .limit(resultsPerPage)
      .skip(resultsPerPage * page);

    return res
      .status(200)
      .send({ status: true, data: getData, count: CountOfData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//==============================delete costumer enquiry =====================================

const deleteClient = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    let clientId = req.params.clientId;   // client id form path params
    if (!validator.isValidObjectId(clientId)) {
      res.status(400).send({
        status: false,
        message: "Please provide valid clientId",
      });
    }
    let getclient = await clientModel.findOne({
      _id: clientId,  //check that client is present or not
    });
    if (!getclient) {
      return res.status(404).send({
        status: false,
        message: "clientId  Not Found for the request id",
      });
    }
    if (getclient.isDeleted == true) {  // is that client is deleted....?
      return res.status(404).send({
        status: false,
        message: "already deleted not found",
      });
    }

    await clientModel.updateOne(   //if not deleted then updating and making it dirty
      { _id: clientId },
      { isDeleted: true, deletedAt: Date.now() }
    );
    return res.status(200).send({
      status: true,
      message: "deleted successfull",
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//==========================tracking customer enquiry====================================


module.exports = {
  client,
  getclient,
  Individualclient,
  deleteClient,
  updateclient,
};
