const { response } = require('express');
const uploadModel = require('../models/clientModel');
const mongoose = require('mongoose');
let csv = require('csvtojson');
const clientModel = require('../models/clientModel');
const importUser = async (req, res) => {
  try {
    var userData = [];
    csv()
      .fromFile(req.file.path)
      .then(async (response) => {
        for (x = 0; x < response.length; x++) {
          userData.push({
            date: response[x].date,
            time: response[x].time,
            particular: response[x].particular,
            userID: new mongoose.Types.ObjectId(response[x].userID),
            vendor: response[x].vendor,
            quantity: response[x].quantity,
            price: response[x].price,
            isDeleted: response[x].isDeleted,
            vchNo: response[x].vchNo,
            status: response[x].status,
            deliveryStatus: response[x].deliveryStatus,
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
module.exports = { importUser };