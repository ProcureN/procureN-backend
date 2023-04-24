const jwt = require('jsonwebtoken');
const validator = require('../validation/validations');
const AddProductsModel = require('../models/AddProductModel');
const costumerModel = require('../models/CostumerModel');
const customerEnquiryModel = require('../models/CostomerEnquiryForm');
const authentication = async function (req, res, next) {
  try {
    let token = req.headers['authorization'];
    if (!token) {
      return res.status(401).send({ message: 'required token' });
    }
    let splittoken = token.split(' '); //converting into array
    // decoding token
    jwt.verify(splittoken[1], 'procure-n secret key', (err, decoded) => {
      if (err) {
        return res.status(401).send({ status: false, message: err.message });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } catch (error) {
    res.status(500).send({ status: false, message: err.message });
  }
};
//===========================================================================================
const authorization = async function (req, res, next) {
  try {
    let customerID = "642a78ce9c3be64d3b6d3aaa" //||req.params.customerID || req.body.customerID ;
    if (!validator.isValidObjectId(customerID)) {
      return res
        .status(400)
        .send({ status: false, message: 'invalid user Id' });
    }
    const user = await costumerModel.findById(customerID);
    if (!user) {
      return res.status(404).send({ status: false, message: 'User Not Found' });
    }
    let decoded = req.decoded.customerID;
    if (customerID !== decoded) {
      return res
        .status(403)
        .send({ staus: false, message: 'you are not authorized' });
    }
    next();
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};
//=====================================================================================

async function authorization1(req, res, next) {
  try {
    const customerID = req.decoded.customerID;
    const productID = req.params.productID;

    const errors = [];

    if (productID === ':productID') {
      errors.push('productID is required');
    } else {
      if (!validator.isValidObjectId(customerID)) {
        errors.push('Given bookId is an invalid ObjectId');
      }
    }

    if (errors.length > 0) {
      return res.status(400).send({
        status: false,
        message: `${errors.join(', ')}`,
      });
    }

    const productDocument = await AddProductsModel.findOne({
      _id: productID,
      isDeleted: false,
    });
    if (!productDocument) {
      return res
        .status(404)
        .send({ status: false, message: 'product not found' });
    }

    const pathcustomerID = '642a78ce9c3be64d3b6d3aaa';//productDocument.costumerID.toString() ||
    if (customerID !== pathcustomerID) {
      return res
        .status(403)
        .send({ status: false, message: 'user not authorized' });
    }
    next();
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
}
//========================================================================

// async function authorization2(req, res, next) {
//   try {
//     const customerID = req.decoded.customerID;
//     const customerEnquiryId = req.params.customerEnquiryId;

//     const errors = [];

//     if (customerEnquiryId === ":customerEnquiryId") {
//       errors.push("customerEnquiryId is required");
//     } else {
//       if (!validator.isValidObjectId(customerID)) {
//         errors.push("Given bookId is an invalid ObjectId");
//       }
//     }

//     if (errors.length > 0) {
//       return res.status(400).send({
//         status: false,
//         message: `${errors.join(", ")}`,
//       });
//     }

//     const customerEnquiryDocument = await customerEnquiryModel.find({ _id: customerEnquiryId, isDeleted: false });
//     if (!customerEnquiryDocument) {
//       return res.status(404).send({ status: false, message: "customerEnquiryDocument not found" });
//     }

//     const pathcustomerID = customerEnquiryDocument.costumerID.toString()
//     if (customerID !== pathcustomerID) {
//       return res
//         .status(403)
//         .send({ status: false, message: "user not authorized" });
//     }
//     next();
//   } catch (error) {
//     return res.status(500).send({ status: false, message: error.message });
//   }
// }
async function authorization2(req, res, next) {
  try {
    const customerID = req.decoded.customerID;
    const customerEnquiryId = req.params.customerEnquiryId;

    const errors = [];

    if (customerEnquiryId === ':customerEnquiryId') {
      errors.push('customerEnquiryId is required');
    } else {
      if (!validator.isValidObjectId(customerID)) {
        errors.push('Given bookId is an invalid ObjectId');
      }
    }

    if (errors.length > 0) {
      return res.status(400).send({
        status: false,
        message: `${errors.join(', ')}`,
      });
    }

    const customerEnquiryDocument = await customerEnquiryModel.find({
      _id: customerEnquiryId,
      isDeleted: false,
    });
    if (!customerEnquiryDocument || customerEnquiryDocument.length === 0) {
      return res
        .status(404)
        .send({ status: false, message: 'customerEnquiryDocument not found' });
    }

    const pathcustomerID = '642a78ce9c3be64d3b6d3aaa';
    if (!pathcustomerID || customerID !== pathcustomerID) {
      return res
        .status(403)
        .send({ status: false, message: 'user not authorized' });
    }
    next();
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
}

module.exports = {
  authentication,
  authorization,
  authorization1,
  authorization2,
};
