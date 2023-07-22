const { response } = require('express');
const VendorModel = require('../models/VendorModel');
const mongoose = require('mongoose');

const clientModel = require('../models/clientModel');
const fs = require('fs');
const xlsx = require('xlsx');
const csv = require('csvtojson');


const isValidObjectId = (objectId) => {
  return mongoose.Types.ObjectId.isValid(objectId)
  
}
const importUser = async (req, res) => {
  try {
    // Check if the file name is correct (assuming the correct file name is "client.csv")
    const filename = req.file.filename;
    if (!filename.toLowerCase().includes('client')) {
      return res.status(400).json({
        status: false,
        message: 'Incorrect file type. Please upload a filename contains text CLIENT',
      });
    }

    // If the file is in XLSX format, convert it to CSV before proceeding
    if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      const workbook = xlsx.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const csvData = xlsx.utils.sheet_to_csv(workbook.Sheets[sheetName]);
      fs.writeFileSync(req.file.path, csvData);
    }

    const userData = [];
    const response = await csv().fromFile(req.file.path);
    const duplicateEntries = [];
    const invalidRows = [];

    for (let x = 0; x < response.length; x++) {
      const status = response[x].status ? response[x].status : 'Pending';
      const deliveryStatus = response[x].deliveryStatus ? response[x].deliveryStatus : 'Processing';

      // Check for missing or incorrect keys in the row
      const requiredKeys = ['Date', 'Particulars', 'Vendor', 'Quantity', 'Price', 'Vch-No.'];
      const rowKeys = Object.keys(response[x]);
      const missingKeys = requiredKeys.filter((key) => !rowKeys.includes(key));

      if (missingKeys.length > 0) {
        const existingMissingKeys = invalidRows.find((row) => row.every((key) => missingKeys.includes(key)));
        if (!existingMissingKeys) {
          invalidRows.push(missingKeys);
        }
      } else {
        const existingClient = await clientModel.findOne({ vchNo: response[x]['Vch-No.'] });
        if (existingClient) {
          duplicateEntries.push({
            row: x + 2,
            'Vch-No': response[x]['Vch-No.'],
          });
        } else {
          userData.push({
            date: response[x].Date,
            time: response[x].Time,
            particular: response[x].Particulars,
            userID: '64ab86c5ec3352792ffcd39c',
            vendor: response[x].Vendor,
            quantity: response[x].Quantity,
            price: response[x].Price,
            isDeleted: false,
            vchNo: response[x]['Vch-No.'],
            status: status,
            deliveryStatus: deliveryStatus,
          });
        }
      }
    }

    if (invalidRows.length > 0 || duplicateEntries.length > 0) {
      // If there are invalid rows or duplicate entries, send the response with the errors
      return res.status(400).json({
        status: false,
        message: 'Invalid rows or duplicate entries found',
        data: { invalidRows, duplicateEntries },
      });
    }

    await clientModel.insertMany(userData);

    res.status(200).send({ status: true, msg: 'Imported' });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = importUser;
//======================================================================================================


; // Replace this with the correct path to the VendorModel

const importVendor = async (req, res) => {
  try {
    // Check if the file name is correct (assuming the correct file name is "vendor.csv")
    const filename = req.file.filename;
    if (!filename.toLowerCase().includes('vendor')) {
      return res.status(400).json({
        status: false,
        message: 'Incorrect file type. Please upload a filename contains text VENDOR',
      });
    }

    // If the file is in XLSX format, convert it to CSV before proceeding
    if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      const workbook = xlsx.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const csvData = xlsx.utils.sheet_to_csv(workbook.Sheets[sheetName]);
      fs.writeFileSync(req.file.path, csvData);
    }

    const userData = [];
    const response = await csv().fromFile(req.file.path);
    const duplicateEntries = [];
    const invalidRows = [];

    for (let i = 0; i < response.length; i++) {
      const status = response[i].status ? response[i].status : 'Pending';
      const deliveryStatus = response[i].deliveryStatus ? response[i].deliveryStatus : 'Processing';

      // Check for missing or incorrect keys in the row
      const requiredKeys = ['Date', 'Particulars', 'Vendor', 'Quantity', 'Price', 'Vch-No.'];
      const rowKeys = Object.keys(response[i]);
      const missingKeys = requiredKeys.filter((key) => !rowKeys.includes(key));
      if (missingKeys.length > 0) {
        const existingMissingKeys = invalidRows.find((row) => row.every((key) => missingKeys.includes(key)));
        if (!existingMissingKeys) {
          invalidRows.push(missingKeys);
        }
      } else {
        const existingVendor = await VendorModel.findOne({ vchNo: response[i]['Vch-No.'] }); 
        if (existingVendor) {
          duplicateEntries.push({
            row: i + 2,
            'Vch-No': response[i]['Vch-No.'],
          });
        } else {
          userData.push({
            date: response[i].Date,
            time: response[i].Time,
            particular: response[i].Particulars,
            userID: '64ab86c5ec3352792ffcd39c',
            vendor: response[i].Vendor,
            quantity: response[i].Quantity,
            price: response[i].Price,
            isDeleted: false,
            vchNo: response[i]['Vch-No.'],
            status: status,
            deliveryStatus: deliveryStatus,
          });
        }
      }
    }

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