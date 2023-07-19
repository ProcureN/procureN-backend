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
    const userData = [];
    const response = await csv().fromFile(req.file.path);
    const dupesClients = [];
    const invalidRows = [];

    for (let x = 0; x < response.length; x++) {
      const status = response[x].status ? response[x].status : 'Pending';
      const deliveryStatus = response[x].deliveryStatus ? response[x].deliveryStatus : 'Processing';

      // Check for missing or incorrect keys in the row
      const requiredKeys = ['date',  'particular', 'vendor', 'quantity', 'price', 'vchNo'];
      const rowKeys = Object.keys(response[x]);
      const missingKeys = requiredKeys.filter((key) => !rowKeys.includes(key));

      if (missingKeys.length > 0) {
        // Check if the missing keys are already present in invalidRows
        const existingMissingKeys = invalidRows.find((row) => row.every((key) => missingKeys.includes(key)));
        if (!existingMissingKeys) {
          invalidRows.push(missingKeys);
        }
      } else {
        let existingClient = await clientModel.findOne({ vchNo: response[x].vchNo });
        if (existingClient) {
          dupesClients.push({
            row: x + 2,
            VchNo: response[x].vchNo,
          });
        } else {
          userData.push({
            date: response[x].date,
            time: response[x].time,
            particular: response[x].particular,
            userID: '64ab86c5ec3352792ffcd39c',
            vendor: response[x].vendor,
            quantity: response[x].quantity,
            price: response[x].price,
            isDeleted: false,
            vchNo: response[x].vchNo,
            status: status,
            deliveryStatus: deliveryStatus,
          });
        }
      }
    }

    if (invalidRows.length > 0 || dupesClients.length > 0) {
      // If there are invalid rows or duplicate entries, send the response with the errors
      return res.status(400).json({
        status: false,
        message: 'Invalid rows or duplicate entries found',
        invalidRows,
        dupesClients,
      });
    }

    await clientModel.insertMany(userData);

    res.status(200).send({ status: true, msg: 'Imported' });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};




const importVendor = async (req, res) => {
  try {
    const userData = [];
    const response = await csv().fromFile(req.file.path);
    const duplicateEntries = [];
    const invalidRows = [];

    for (let i = 0; i < response.length; i++) {
      const status = response[i].status ? response[i].status : 'Pending';
      const deliveryStatus = response[i].deliveryStatus ? response[i].deliveryStatus : 'Processing';

      // Check for missing or incorrect keys in the row
      const requiredKeys = ['date',  'particular', 'vendor', 'quantity', 'price', 'vchNo'];
      const rowKeys = Object.keys(response[i]);
      const missingKeys = requiredKeys.filter((key) => !rowKeys.includes(key));
      if (missingKeys.length > 0) {
        // Check if the missing keys are already present in invalidRows
        const existingMissingKeys = invalidRows.find((row) => row.every((key) => missingKeys.includes(key)));
        if (!existingMissingKeys) {
          invalidRows.push(missingKeys);
        }
      }  else{
      const existingVendor = await VendorModel.findOne({ vchNo: response[i].vchNo });
      if (existingVendor) {
        // VchNo already exists, add to duplicateEntries array
        duplicateEntries.push({
          row: i + 2, // Row number in the Excel sheet (1-indexed)
          vchNo: response[i].vchNo,
        });
      } else {
        userData.push({
          date: response[i].date,
          time: response[i].time,
          particular: response[i].particular,
          userID: '64ab86c5ec3352792ffcd39c',
          vendor: response[i].vendor,
          quantity: response[i].quantity,
          price: response[i].price,
          isDeleted: false,
          vchNo: response[i].vchNo,
          status: status,
          deliveryStatus: deliveryStatus,
        });
      }
    }
    }

    if (invalidRows.length > 0 ||duplicateEntries.length > 0) {
      // If there are duplicate entries, send the response with the duplicate entries
      return res.status(400).json({
        status: false,
        message: 'Invalid rows or duplicate entries found',
        invalidRows,
      duplicateEntries,
      });
    }

    await VendorModel.insertMany(userData);

    res.status(200).send({ status: true, msg: 'Vendors imported' });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { importUser , importVendor};