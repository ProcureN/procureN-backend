const AddProductModel = require('../models/AddProductModel');
const CostumerEnquiryModel = require('../models/CostomerEnquiryForm');
const CostumerModel = require('../models/CostumerModel');
const validator = require('../validation/validations');

const Mail = require('nodemailer/lib/mailer');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const { EMAIL, PASSWORD } = require('../env');

const EnquiryForm = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    //   let costumerId = req.params.customerID
    let data = req.body;
    const {
      productName,
      otherProduct,
      name,
      contact,
      alternativeNumber,
      email,
      state,
      billingAddress,
      shippingPincode,
      quantity,
      city,
      customerID,
      date,
    } = data;

    if (validator.isValidBody(data))
      return res
        .status(400)
        .send({
          status: false,
          message: 'Enter details to create your account',
        });
    if (!validator.isValid1(customerID)) {
      return res
        .status(400)
        .send({ status: false, message: 'costumerID is required' });
    }
    if (!validator.isValidObjectId(customerID)) {
      return res
        .status(400)
        .send({ status: false, message: 'costumerID not valid' });
    }
    let getCostumers = await CostumerModel.findOne({
      _id: customerID,
      isDeleted: false,
    });
    if (!getCostumers) {
      return res
        .status(404)
        .send({ status: false, message: 'user not found or already deleted' });
    }
    //ProductName
    if (!productName)
      return res
        .status(400)
        .send({ status: false, message: 'ProductName is required' });
    if (validator.isValid(productName))
      return res
        .status(400)
        .send({ status: false, message: 'name should not be an empty string' });

    //OtherProduct
    //  if (!OtherProduct) return res.status(400).send({ status: false, message: "OtherProduct is required" });
    if (otherProduct) {
      if (validator.isValid(otherProduct))
        return res
          .status(400)
          .send({
            status: false,
            message: 'OtherProduct should not be an empty string',
          });
    }
    //Name
    if (!name)
      return res
        .status(400)
        .send({ status: false, message: 'name is required' });
    if (validator.isValid(name))
      return res
        .status(400)
        .send({ status: false, message: 'name should not be an empty string' });

    //Contact
    if (!contact)
      return res
        .status(400)
        .send({ status: false, message: 'Contact is required' });
    if (validator.isValid(contact))
      return res
        .status(400)
        .send({
          status: false,
          message: 'Contact should not be an empty string',
        });
    if (!validator.isValidPhone(contact.trim()))
      return res
        .status(400)
        .send({ status: false, message: 'Please Enter a valid Phone number' });

    //AlternativeNumber
    if (alternativeNumber) {
      if (validator.isValid(alternativeNumber))
        return res
          .status(400)
          .send({
            status: false,
            message: 'alternativeNumber should not be an empty string',
          });
      if (!validator.isValidPhone(alternativeNumber.trim()))
        return res
          .status(400)
          .send({
            status: false,
            message: 'Please Enter a valid alternativeNumber',
          });
    }

    //Email
    if (!email)
      return res
        .status(400)
        .send({ status: false, message: 'User email-id is required' });
    //validating user email-id
    if (!validator.isValidEmail(email.trim()))
      return res
        .status(400)
        .send({ status: false, message: 'Please Enter a valid email-id' });

    //state
    if (!state)
      return res
        .status(400)
        .send({ status: false, message: 'State is required' });
    if (validator.isValid(state))
      return res
        .status(400)
        .send({
          status: false,
          message: 'State should not be an empty string',
        });

    // BillingAddress
    if (!billingAddress)
      return res
        .status(400)
        .send({ status: false, message: 'BillingAddress is required' });
    if (validator.isValid(billingAddress))
      return res
        .status(400)
        .send({
          status: false,
          message: 'BillingAddress should not be an empty string',
        });

    //ShippingPincode
    if (!shippingPincode)
      return res
        .status(400)
        .send({ status: false, message: 'BillingAddress is required' });
    if (validator.isValid(shippingPincode)) {
      return res
        .status(400)
        .send({ status: false, message: 'Pincode is in wrong format' });
    }

    //quantity
    if (!quantity)
      return res
        .status(400)
        .send({ status: false, message: 'quantity is required' });
    if (validator.isValid(quantity)) {
      return res
        .status(400)
        .send({ status: false, message: 'quantity must be string' });
    }
    if (!validator.isValidPincode(shippingPincode)) {
      return res
        .status(400)
        .send({ status: false, message: 'Please Provide valid Pincode' });
    }
    var currentdate = new Date();
    var datetime =
      currentdate.getDay() +
      '-' +
      (currentdate.getMonth() + 1) +
      '-' +
      currentdate.getFullYear();
    //adding time
    let time =
      +currentdate.getHours() +
      ':' +
      currentdate.getMinutes() +
      ':' +
      currentdate.getSeconds();
    data.date = datetime;
    data.time = time;
    let saveData = await CostumerEnquiryModel.create(data);
    res.status(201).send({ status: true, data: saveData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//===================================================================

const getEnquiries = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    let filter = { isDeleted: false };
    const resultsPerPage =
      req.params.limit === ':limit' ? 10 : req.params.limit;
    let page = req.params.page >= 1 ? req.params.page : 1;
    //const query = req.query.search;

    page = page - 1;
    let CountOfData = await CostumerEnquiryModel.find(filter).countDocuments();
    let data = await CostumerEnquiryModel.find(filter)
      .sort({ status: 1, createdAt: -1, deliveryStatus: 1 })
      .limit(resultsPerPage)
      .skip(resultsPerPage * page); //.countDocuments().exec()
    if (!data)
      return res
        .status(404)
        .send({ status: false, message: 'no enquiries found' });

    res.status(200).send({
      status: true,
      data: data,
      count: CountOfData,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//==========================update costumers =========================================
const updateCostumersEnquiry = async (req, res) => {
  try {
    let data = req.body;
    const customerEnquiryID = req.params.customerEnquiryId;
    let { status, deliveryStatus } = data;
    if (status) {
      let statuses = ['Pending', 'Approved', 'Rejected'];
      if (!statuses.includes(status))
        return res
          .status(400)
          .send({
            status: false,
            message: `status must be selected among ${statuses}`,
          });
    }
    if (deliveryStatus) {
      let deliveryStatuses = [
        'processing',
        'shipped',
        'inTransit',
        'delivered',
      ];
      if (!deliveryStatuses.includes(deliveryStatus))
        return res
          .status(400)
          .send({
            status: false,
            message: `deliveryStatus must be selected among ${deliveryStatuses}`,
          });
    }
    let userData = await CostumerEnquiryModel.findOneAndUpdate(
      { _id: customerEnquiryID },
      data,
      { new: true }
    );
    if (!userData) {
      return res
        .status(404)
        .send({ satus: false, message: 'no user found to update' });
    }
    let getcustomerEnquiryData = await CostumerEnquiryModel.findById(
      customerEnquiryID
    );
    if (!getcustomerEnquiryData) {
      return res
        .status(404)
        .send({ satus: false, message: 'no customer enquiry found' });
    }
    let customerId = getcustomerEnquiryData.customerID?.toString();
    if (!customerId) {
      return res
        .status(404)
        .send({ satus: false, message: 'customerID not found' });
    }
    let customerData = await CostumerModel.findById(customerId);
    if (!customerData) {
      return res
        .status(404)
        .send({ satus: false, message: 'customer not found' });
    }
    let email = customerData.email?.toString();
    let name = customerData.name?.toString();
    let otp = 123;
    if (userData.status == 'Approved') {
      let config = {
        service: 'gmail',
        auth: {
          user: EMAIL,
          pass: PASSWORD,
        },
      };
      let transporter = nodemailer.createTransport(config);

      let MailGenerator = new Mailgen({
        theme: 'default',
        product: {
          name: 'procureN',
          link: 'https://mailgen.js/',
        },
      });
      let response = {
        body: {
          name: `${name}`,
          intro: `your enquiry is approved. track now: ${customerEnquiryID}`,
          outro: 'thank you',
        },
      };
      let mail = MailGenerator.generate(response);

      let message = {
        from: EMAIL,
        to: email,
        subject: 'Track it',
        html: mail,
      };
      transporter
        .sendMail(message)
        .then(() => {
          // return res.status(201).json({
          //     message: "you should receive an email"
          // })
        })
        .catch((error) => {
          return res.status(500).json({ error });
        });
    }
    return res
      .status(200)
      .send({ satus: true, message: 'success', data: userData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//=========================================get individual costumer enquiry================================

const IndividualCostumerEnquiry = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    let customerID = req.params.customerID;

    if (!validator.isValid1(customerID)) {
      return res
        .status(400)
        .send({ status: false, message: 'costumerID is required' });
    }
    if (!validator.isValidObjectId(customerID)) {
      return res
        .status(400)
        .send({ status: false, message: 'costumerID not valid' });
    }

    // if(!getData){
    //     return res.status(404).send({ status: false, message: "not enquiries found" })
    // }
    let filter = { isDeleted: false };
    const resultsPerPage =
      req.params.limit === ':limit' ? 10 : req.params.limit;
    let page = req.params.page >= 1 ? req.params.page : 1;
    page = page - 1;
    //const query = req.query.search;
    let CountOfData = await CostumerEnquiryModel.find({
      customerID: customerID,
    }).countDocuments();
    let getData = await CostumerEnquiryModel.find({ customerID: customerID })
      .sort({ status: 1, createdAt: -1, deliveryStatus: 1 })
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

const deleteCostumerEnquiry = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    let customerEnquiryId = req.params.customerEnquiryId;
    if (!validator.isValidObjectId(customerEnquiryId)) {
      res
        .status(400)
        .send({
          status: false,
          message: 'Please provide valid costumerEnquiryId',
        });
    }
    let getcustomerEnquiryId = await CostumerEnquiryModel.findOne({
      _id: customerEnquiryId,
    });
    if (!getcustomerEnquiryId) {
      return res
        .status(404)
        .send({
          status: false,
          message: 'customerEnquiry  Not Found for the request id',
        });
    }
    if (getcustomerEnquiryId.isDeleted == true) {
      return res
        .status(404)
        .send({
          status: false,
          message: 'CostumerEnquiry is already deleted not found',
        });
    }

    await CostumerEnquiryModel.updateOne(
      { _id: customerEnquiryId },
      { isDeleted: true, deletedAt: Date.now() }
    );
    return res
      .status(200)
      .send({ status: true, message: 'customerEnquiryId is deleted' });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//==========================count of enquire====================================================

const countData = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    let data = await CostumerEnquiryModel.find({
      isDeleted: false,
    }).countDocuments();
    res.status(200).send({ status: true, data: data });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//================================================================================
const pendingData = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    let data = await CostumerEnquiryModel.find({
      status: 'Pending',
      isDeleted: false,
    }).countDocuments();
    res.status(200).send({ status: true, data: data });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//===============================================================================
const rejectedData = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    let data = await CostumerEnquiryModel.find({
      status: 'Rejected',
      isDeleted: false,
    }).countDocuments();
    res.status(200).send({ status: true, data: data });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//=====================================================================================
const approvedData = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    let data = await CostumerEnquiryModel.find({
      status: 'Approved',
      isDeleted: false,
    }).countDocuments();
    res.status(200).send({ status: true, data: data });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//==============================================================================
const countOfInprocessingDelivery = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    //"processing","shipped","inTransit","delivered"
    let data = await CostumerEnquiryModel.find({
      deliveryStatus: 'processing',
      isDeleted: false,
    }).countDocuments();
    res.status(200).send({ status: true, data: data });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//=====================================================================================
const countOfinTransitDelivery = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    //"processing","shipped","inTransit","delivered"
    let data = await CostumerEnquiryModel.find({
      deliveryStatus: 'inTransit',
      isDeleted: false,
    }).countDocuments();
    res.status(200).send({ status: true, data: data });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//==============================================================
const countOfinshippedDelivery = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    //"processing","shipped","inTransit","delivered"
    let data = await CostumerEnquiryModel.find({
      deliveryStatus: 'shipped',
      isDeleted: false,
    }).countDocuments();
    res.status(200).send({ status: true, data: data });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//==============================================================================
const countOfindeliveredDelivery = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    //"processing","shipped","inTransit","delivered"
    let data = await CostumerEnquiryModel.find({
      deliveryStatus: 'delivered',
      isDeleted: false,
    }).countDocuments();
    res.status(200).send({ status: true, data: data });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//==========================tracking customer enquiry====================================
const trackEnquiry = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    let customerEnquiryId = req.params.enquireId;
    if (!validator.isValidObjectId(customerEnquiryId)) {
      res.status(400).send({
        status: false,
        message: 'Please provide valid id',
      });
    }
    let getcustomerEnquiryId = await CostumerEnquiryModel.findOne({
      _id: customerEnquiryId,
    });
    if (!getcustomerEnquiryId) {
      return res.status(404).send({
        status: false,
        message: 'id  Not Found',
      });
    }
    if (getcustomerEnquiryId.isDeleted == true) {
      return res.status(404).send({
        status: false,
        message: 'id is already deleted not found',
      });
    }

    let getEnquiries = await CostumerEnquiryModel.find({
      _id: customerEnquiryId,
    });
    res.status(200).send({ status: true, data: getEnquiries });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = {
  EnquiryForm,
  getEnquiries,
  IndividualCostumerEnquiry,
  deleteCostumerEnquiry,
  countData,
  pendingData,
  rejectedData,
  approvedData,
  updateCostumersEnquiry,
  countOfInprocessingDelivery,
  countOfindeliveredDelivery,
  countOfinshippedDelivery,
  countOfinTransitDelivery,
  trackEnquiry,
};
