const { response } = require('express');
const VendorModel = require('../models/VendorModel');
const mongoose = require('mongoose');
let csv = require('csvtojson');
const clientModel = require('../models/clientModel');


const isValidObjectId = (objectId) => {
  return mongoose.Types.ObjectId.isValid(objectId)
  
}
const importUser = async (req, res) => {
  try {
    var userData = [];
    csv()
      .fromFile(req.file.path)
      .then(async (response) => {
        for (x = 0; x < response.length; x++) {
          const status = response[x].status ? response[x].status : 'Pending';
          const deliveryStatus = response[x].deliveryStatus ? response[x].deliveryStatus : "Processing" ;
          userData.push({
            date: response[x].date,
            time: response[x].time,
            particular: response[x].particular,
            userID:'64ab86c5ec3352792ffcd39c',
            vendor: response[x].vendor,
            quantity: response[x].quantity,
            price: response[x].price,
            isDeleted: false,
            vchNo: response[x].vchNo,
            status: status,
            deliveryStatus: deliveryStatus,
          });
        }
        // console.log(userData)
        await clientModel.insertMany(userData);
        // console.log(response)
      });
    res.status(200).send({ status: true, msg: 'Imported' });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};


const importVendor = async (req, res) => {
  try {
    var userData = [];
    csv()
      .fromFile(req.file.path)
      .then(async (response) => {
        for (x = 0; x < response.length; x++) {
          const status = response[x].status ? response[x].status : 'Pending';
          const deliveryStatus = response[x].deliveryStatus ? response[x].deliveryStatus : "Processing" ;
          userData.push({
            date: response[x].date,
            time: response[x].time, 
            particular: response[x].particular,
            userID:'64ab86c5ec3352792ffcd39c',
            vendor: response[x].vendor,
            quantity: response[x].quantity,
            price: response[x].price,
            isDeleted: false,
            vchNo: response[x].vchNo,
            status: status,
            deliveryStatus: deliveryStatus,
          });
        }
        // console.log(userData)
        await VendorModel.insertMany(userData);
        // console.log(response)
      });
    res.status(200).send({ status: true, msg: "vendors imported" });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};
module.exports = { importUser , importVendor};