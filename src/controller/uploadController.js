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
      const requiredKeys = ['Date',  'Particular', 'Vendor', 'Quantity', 'Price', 'VchNo'];
      const rowKeys = Object.keys(response[x]);
      const missingKeys = requiredKeys.filter((key) => !rowKeys.includes(key));

      if (missingKeys.length > 0) {
        // Check if the missing keys are already present in invalidRows
        const existingMissingKeys = invalidRows.find((row) => row.every((key) => missingKeys.includes(key)));
        if (!existingMissingKeys) {
          invalidRows.push(missingKeys);
        }
      } else {
        let existingClient = await clientModel.findOne({ vchNo: response[x]. VchNo });
        if (existingClient) {
          dupesClients.push({
            row: x + 2,
            VchNo: response[x].VchNo,
          });
        } else {
          userData.push({
            date: response[x].Date,
            time: response[x].Time,
            particular: response[x].Particular,
            userID: '64ab86c5ec3352792ffcd39c',
            vendor: response[x].Vendor,
            quantity: response[x].Quantity,
            price: response[x].Price,
            isDeleted: false,
            vchNo: response[x].VchNo,
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
        // message: 'Invalid rows or duplicate entries found',
        data:{invalidRows,dupesClients}
      });
    }

    await clientModel.insertMany(userData);

    res.status(200).send({ status: true, msg: 'Imported' });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

//======================================================================================================


const importVendor = async (req, res) => {
  try {
    // Check if the file name is correct (assuming the correct file name is "vendor.csv")
    const filename = req.file.filename;
    if (!filename.toLowerCase().includes('vendor')) {
      return res.status(400).json({
        status: false,
        message: 'Incorrect file type. Please upload a file named "vendor.csv".',
      });
    }

    const userData = [];
    const response = await csv().fromFile(req.file.path);
    const duplicateEntries = [];
    const invalidRows = [];

    // Rest of the function code remains the same
    // ...
    // (Your existing code for processing the CSV data)

    if (invalidRows.length > 0 || duplicateEntries.length > 0) {
      // If there are invalid rows or duplicate entries, send the response with the errors
      return res.status(400).json({
        status: false,
        message: 'Invalid rows or duplicate entries found',
        data: { invalidRows, duplicateEntries },
      });
    }

    await VendorModel.insertMany(userData);

    res.status(200).send({ status: true, msg: 'Vendors imported' });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { importUser , importVendor};