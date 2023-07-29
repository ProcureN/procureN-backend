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
      return res.status(404).send({ status: false, message: "No products found" });
    }

    res.status(200).send({ status: true,  data });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};


//======================get Individual products=======================================================
const IndividualVendor = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    let userID = req.params.userID;
    let filter = { isDeleted: false };
   
    const resultsPerPage =
      req.params.limit === ":limit" ? 10 : req.params.limit;
    let page = req.params.page >= 1 ? req.params.page : 1;
    //const query = req.query.search;

    page = page - 1;
    let CountOfData = await VendorModel.find({
      userID: userID,
    }).countDocuments();

    if (CountOfData.length === 0) {
      return res.status(400).send({ 
        status: false,
         message: "No data found"
         });
    }
    let getData = await VendorModel.find({ userID: userID })
      .sort({ createdAt: -1 })
      .limit(resultsPerPage)
      .skip(resultsPerPage * page);
    return res.status(200).send({ 
      status: true, 
      data: getData, 
      count: CountOfData 
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//======================================get product names ====================================
const getproductnames = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    let filter = { isDeleted: false };
    let data = await VendorModel.find(filter).distinct("productName");
    if (!data)
      return res.status(404).send({ 
        status: false, 
        message: "no enquiries found" 
      });
    res.status(200).send({ status: true, data: data });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//==============================count of products========================================
const countProduct = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    //"Retailer", "Manufacturer"
    let data = await VendorModel.find({
      isDeleted: false,
    }).countDocuments();
    res.status(200).send({ 
      status: true, 
      data: data 
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getCounts = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    const pipeline = [
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: null,
          pending: { $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] } },
          rejected: {$sum: { $cond: [{ $eq: ["$status", "Rejected"] }, 1, 0] },},
          approved: {$sum: { $cond: [{ $eq: ["$status", "Approved"] }, 1, 0] },},
          inprocessing: { $sum: { $cond: [{ $eq: ["$deliveryStatus", "Processing"] }, 1, 0] },},
        
          shipped: {$sum: { $cond: [{ $eq: ["$deliveryStatus", "Shipped"] }, 1, 0] },},
          delivered: { $sum: { $cond: [{ $eq: ["$deliveryStatus", "Delivered"] }, 1, 0] },},
        },
      },
      {
        $project: { _id: 0,},
      },
    ];
    const data = await VendorModel.aggregate(pipeline);
    const count = await VendorModel.countDocuments({ isDeleted: false });
    res.status(200).send({ status: true,info:"products", data: data[0], count });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//=============================================================================================
const individualProductsCount = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    const pipeline = [
      {
        $match: {
          isDeleted: false,
          costumerID: new mongoose.Types.ObjectId(req.params.customerID),
        },
      },
      {
        $group: {
          _id: null,
          pending: { $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] } },
          rejected: { $sum: { $cond: [{ $eq: ["$status", "Rejected"] }, 1, 0] },},
          approved: {$sum: { $cond: [{ $eq: ["$status", "Approved"] }, 1, 0] },},
          inprocessing: { $sum: { $cond: [{ $eq: ["$deliveryStatus", "Processing"] }, 1, 0] }, },
          shipped: { $sum: { $cond: [{ $eq: ["$deliveryStatus", "Shipped"] }, 1, 0] },},
          delivered: { $sum: { $cond: [{ $eq: ["$deliveryStatus", "Delivered"] }, 1, 0] },},
          total: { $sum: 1 },
        },
      },
      {
        $project: {_id: 0,},
      },
    ];

    const [data, count] = await Promise.all([
      VendorModel.aggregate(pipeline),
      VendorModel.countDocuments({
        isDeleted: false,
        costumerID: new mongoose.Types.ObjectId(req.params.customerID),
      }),
    ]);

    res.status(200).send({ 
      status: true, 
      data: data[0],
       count 
      });
  } catch (error) {
    return res.status(500).send({
       status: false,
        message: error.message
       });
  }
};

//================================================================================

const countOfStatusByCustomerIdOfProducts = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    let { limit } = req.params; 
    if (!limit) {
      limit = 10; // Set a default limit value if not provided
    } else {
      limit = parseInt(limit); // Convert limit to a number
    }
    const pipeline = [
      {
        $match: {
          isDeleted: false
        }
      },
      {
        $group: {
          _id: { $toObjectId: '$costumerID' }, // Convert costumerID to ObjectId type
          counts: {
            $push: '$status'
          }
        }
      },
      {
        $lookup: {
          from: 'costumers', // Updated collection name
          let: { customerId: { $toString: '$_id' } },
          pipeline: [
            { $match: { $expr: { $eq: ['$$customerId', { $toString: '$_id' }] } } },
            { $project: { _id: 0, name: 1 } }
          ],
          as: 'customer'
        
        }
      },
      {
        $project: {
          _id: 0,
          name: { $arrayElemAt: ['$customer.name', 0] },
          Approved: {
            $size: {
              $filter: {
                input: '$counts',
                as: 'status',
                cond: { $eq: ['$$status', 'Approved'] }
              }
            }
          },
          Pending: {
            $size: {
              $filter: {
                input: '$counts',
                as: 'status',
                cond: { $eq: ['$$status', 'Pending'] }
              }
            }
          },
          Rejected: {
            $size: {
              $filter: {
                input: '$counts',
                as: 'status',
                cond: { $eq: ['$$status', 'Rejected'] }
              }
            }
          }
        }
      },
      {
        $limit: limit // Apply the limit to the result
      }
    ];

    const result = await VendorModel.aggregate(pipeline);

    const transformedData = result.map((item) => {
      return {
        name: item.name,
        Approved: item.Approved,
        Pending: item.Pending,
        Rejected: item.Rejected
      };
    });

    res.status(200).send({ status: true, info: 'products', data: transformedData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//======================================================================
// const graph = async (req,res)=>{
//    let vendorName = req.params.vendor

// }

module.exports = {
 vendor,
   updateVendor,
 DeleteVendor,
   getVendor,
  getManufactureProducts: IndividualVendor,
  getproductnames,
  countProduct,
  getCounts,
  individualProductsCount,
  countOfStatusByCustomerIdOfProducts
};
