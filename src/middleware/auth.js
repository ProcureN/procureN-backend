const jwt = require('jsonwebtoken');
const validator = require('../validation/validations');
const { client } = require('../controller/ClientController');
const clientModel = require('../models/clientModel');
const userModel = require("../models/UserModel")
const VendorModel = require("../models/VendorModel")
// const costumerModel = require('../models/CostumerModel');
// const customerEnquiryModel = require('../models/clientModel');

const authentication = async function (req, res, next) {
  try {
    let token = req.headers['authorization'];
    if (!token) {
      return res.status(401).send({ message: 'Token required' });
    }
    let splitToken = token.split(' ');
    // decoding token
    jwt.verify(splitToken[1], 'procure-n secret key', (err, decoded) => {
      if (!err) {
        req.decoded = decoded;
        next();
      } else {
        return res.status(401).send({ status: false, message: err.message });
      }
    });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

// //===========================================================================================
const authorization3 = async function (req, res, next) {
  try {
    let userID = req.params.userID  ;
    if (!validator.isValidObjectId(userID)) {
      return res
        .status(400)
        .send({ status: false, message: 'invalid user Id' });
    }
    const user = await userModel.findById(userID);
    if (!user) {
      return res.status(404).send({ status: false, message: 'User Not Found' });
    }
    let decoded = req.decoded.userID;
    if (userID!== decoded) {
      return res
        .status(403)
        .send({ staus: false, message: 'you are not authorized' });
    }
    next();
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};
// //=====================================================================================

const authorization = async function (req, res, next) {
  try {
    let clientId = req.params.clientId;

    if (!validator.isValidObjectId(clientId)) {
      return res.status(400).send({ status: false, message: "Invalid client ID" });
    }

    // Retrieve the client document by ID
    const clientData = await clientModel.findById(clientId);

    // Check if the client document exists
    if (!clientData) {
      return res.status(404).send({ status: false, message: "Client Not Found" });
    }

    // Convert the user ID to a string
    const getUserID = clientData.userID?.toString();

    // Retrieve the user by ID
    const user = await userModel.findById(getUserID);

    // Check if the user exists
    if (!user) {
      return res.status(404).send({ status: false, message: "User Not Found" });
    }

    // Get the user ID from the decoded token (assuming you have a middleware that decodes the token and adds it to req.decoded.userID)
    let decodedUserID = req.decoded?.userID;

    // Check if the user ID from the token matches the client's user ID
    if (getUserID !== decodedUserID) {
      return res.status(403).send({ status: false, message: "You are not authorized" });
    }

    // If everything is fine, proceed to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// //========================================================================

const authorization1 = async function (req, res, next) {
  try {
      let Id = req.params.vendorID
      if (!validator.isValidObjectId(Id)) {
          return res.status(400).send({ status: false, message: "invalid user Id" })
      }
      const vendorData = await VendorModel.findById(Id)
      const getUserID = vendorData.userID?.toString()
      const user = await userModel.findById(getUserID)
      if (!user) {
          return res.status(404).send({ status: false, message: "User Not Found" })
      }
      let decoded = req.decoded.userID
      if (getUserID !== decoded) { return res.status(403).send({ staus: false, msg: "you are not authorized" }) }
      next()
  } catch (error) {
      return res.status(500).send({ status: false, message: error.message })
  }

}



module.exports = {
  authentication,
   authorization,
   authorization1,
  // authorization2,
  authorization3
};
