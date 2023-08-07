const AddProductModel = require("../models/VendorModel");
const clientModel = require("../models/clientModel");
const UserModel = require("../models/UserModel");
const validator = require("../validation/validations");
const moment = require("moment");
require("moment-timezone");
require('dotenv').config();


const client = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    // Get the data from the request body
    let data = req.body;
    const { userID } = data;

    // Check if the userID is provided
    if (!validator.isValid1(userID)) {
      // Checking user id required
      return res.status(400).send({
        status: false,
        message: "userID is required",
      });
    }

    // Validate the userID format (should be a valid MongoDB ObjectId)
    if (!validator.isValidObjectId(userID)) {
      // User id (objectid) validation
      return res.status(400).send({
        status: false,
        message: "userID not valid",
      });
    }

    // Find the user in the UserModel by the provided userID
    let getCostumers = await UserModel.findOne({
      _id: userID,
      isDeleted: false,
    });

    // Check if the user exists and is not deleted
    if (!getCostumers) {
      return res.status(404).send({
        status: false,
        message: "user not found or already deleted",
      });
    }

    // Find if a client with the provided vchNo already exists in the clientModel
    let findVchNo = await clientModel.findOne({ vchNo: data.vchNo });

    // Check if the vchNo is already taken
    if (findVchNo) {
      return res.status(404).send({ status: false, message: "vchNo already exists" });
    }

    // Set the default timezone to Asia/Kolkata
    moment.tz.setDefault("Asia/Kolkata");

    // Get the current date and time
    let date = moment().format("DD/MM/YYYY");
    let time = moment().format("HH:mm:ss");

    // Add date and time to the data object
    data.date = date;
    data.time = time;

    // Create a new client record in the clientModel
    let saveData = await clientModel.create(data);

    // Return the successful response
    res.status(201).send({ status: true, data: saveData });
  } catch (error) {
    // If there's an error, return the error message
    return res.status(500).send({ status: false, message: error.message });
  }
};

//==========================Get Clients=========================================
const getclient = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    // Retrieve all client documents from the clientModel collection
    let data = await clientModel.aggregate([
      { $match: { isDeleted: false } }, // Match documents where the 'isDeleted' field is set to false
      { $group: { _id: "$vchNo", doc: { $first: "$$ROOT" } } }, // Group the documents by 'vchNo' and fetch the first document of each group
      { $replaceRoot: { newRoot: "$doc" } }, // Replace the current root with the 'doc' object from the group (unwrap the grouped documents)
      { $sort: { createdAt: -1 } }, // Sort the documents in descending order based on the 'createdAt' field
    ]);

    // Check if data is empty or no documents were found
    if (!data || data.length === 0) {
      return res.status(404).send({ status: false, data: [] });
    }

    // Return the successful response with the data
    res.status(200).send({ status: true, data: data });
  } catch (error) {
    // If there's an error, return the error message
    return res.status(500).send({ status: false, message: error.message });
  }
};


//==========================Update Clients=========================================
const updateclient = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    let data = req.body;
    let vchNo = data.vchNo;
    const clientId = req.params.clientId; // Getting the client id from the path params

    // Finding the client doc with the given id
    let getclient = await clientModel.findById(clientId);
    if (!getclient) {
      return res.status(404).send({
        status: false,
        message: "No customer enquiry found",
      });
    }
    let userID = getclient.userID?.toString(); // Extracting the user id and converting the object id to string
    let existingVchNo = getclient.vchNo;

    // Checking if the user is present or not
    if (!userID) {
      return res.status(404).send({
        status: false,
        message: "userID not found",
      });
    }

    // Finding the userId in the database
    let user = await UserModel.findById(userID);

    // If user is not found
    if (!user) {
      return res.status(404).send({ status: false, message: "User not found" });
    }

    // Check if the provided vchNo is different from the existing vchNo in the database
    // If it's different, then check if the new vchNo already exists in the database
    if (existingVchNo !== vchNo) {
      let vchoNoExist = await clientModel.findOne({ vchNo: vchNo });

      // Check if the vchNo already exists and the corresponding client document is not deleted
      if (vchoNoExist && !vchoNoExist.isDeleted) {
        return res.status(400).send({ status: false, message: "vchNo already exists" });
      }
    }

    // Updating the client doc with the given id and the data provided
    let userData = await clientModel.findOneAndUpdate({ _id: clientId }, data, {
      new: true,
    });

    // Checking if the client is present or not
    if (!userData) {
      return res.status(404).send({
        status: false,
        message: "No user found to update",
      });
    }

    return res.status(200).send({ status: true, message: "Success", data: userData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};


//==============================Delete Client====================================
const deleteClient = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    let clientId = req.params.clientId; // Getting client id from path params

    // Checking if clientId is a valid ObjectId
    if (!validator.isValidObjectId(clientId)) {
      res.status(400).send({
        status: false,
        message: "Please provide a valid clientId",
      });
    }

    // Finding the client with the given clientId
    let getclient = await clientModel.findOne({
      _id: clientId,
    });

    // Checking if the client is present or not
    if (!getclient) {
      return res.status(404).send({
        status: false,
        message: "ClientId not found for the requested id",
      });
    }

    // Checking if the client is already deleted
    if (getclient.isDeleted == true) {
      return res.status(404).send({
        status: false,
        message: "Already deleted, not found",
      });
    }

    // Updating the client document and marking it as deleted
    await clientModel.updateOne(
      { _id: clientId },
      { isDeleted: true, deletedAt: Date.now() }
    );

    return res.status(200).send({
      status: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }

};
 
//==================================================================================================

module.exports = {
  client,
  getclient,
  deleteClient,
  updateclient,
  //uniqueVchNo
};
