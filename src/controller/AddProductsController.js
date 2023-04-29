const AddProductsModel = require('../models/AddProductModel');
const validator = require('../validation/validations');
const costumerModel = require('../models/CostumerModel');
const aws = require('../aws/aws');
const uploadFile = require('../middleware/uploads');
const fs = require('fs');
const { Aggregate } = require('mongoose');
const Mail = require('nodemailer/lib/mailer');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const { EMAIL, PASSWORD } = require('../env');
const addProdcts = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    let data = req.body;
    let files = req.files;

    if (validator.isValidBody(data)) {
      return res
        .status(400)
        .send({ status: false, message: 'Enter details to create Product' });
    }
    // if (!validator.isValidFiles(files)) {
    //     return res.status(400).send({ status: false, message: "productImage is required" })
    // }
    const {
      productName,
      category,
      subCategory,
      manufacturerName,
      priceBeforeDiscount,
      price,
      withGST,
      description,
      shippingCharges,
      sizeUnit,
      productQuantity,
      availability,
      costumerID,
      selectImage1,
      selectImage2,
    } = data;

    //ProductName
    // if (!productName)
    //   return res
    //     .status(400)
    //     .send({ status: false, message: 'productName is required' });
    // if (validator.isValid(productName))
    //   return res
    //     .status(400)
    //     .send({ status: false, message: 'name should not be an empty string' });

    //Category
    // if (!category)
    //   return res
    //     .status(400)
    //     .send({ status: false, message: 'category is required' });
    // if (validator.isValid(category))
    //   return res.status(400).send({
    //     status: false,
    //     message: 'category should not be an empty string',
    //   });

    //SubCategory
    // if (!subCategory)
    //   return res
    //     .status(400)
    //     .send({ status: false, message: 'subCategory is required' });
    // if (validator.isValid(subCategory))
    //   return res.status(400).send({
    //     status: false,
    //     message: 'subCategory should not be an empty string',
    //   });

    //Manufacturer
    // if (!manufacturerName)
    //   return res
    //     .status(400)
    //     .send({ status: false, message: 'manufacturer is required' });
    // if (validator.isValid(manufacturerName))
    //   return res.status(400).send({
    //     status: false,
    //     message: 'manufacturer should not be an empty string',
    //   });

    //priceBeforeDiscount
    // if (!validator.isValid1(priceBeforeDiscount)) {
    //   return res
    //     .status(400)
    //     .send({ status: false, message: 'price is required' });
    // }
    // if (!validator.isValidPrice(priceBeforeDiscount)) {
    //   return res
    //     .status(400)
    //     .send({ status: false, message: 'Enter a Valid priceBeforeDiscount' });
    // }
    //Price
    // if (!validator.isValid1(price)) {
    //   return res
    //     .status(400)
    //     .send({ status: false, message: 'price is required' });
    // }
    // if (!validator.isValidPrice(price)) {
    //   return res
    //     .status(400)
    //     .send({ status: false, message: 'Enter a Valid price' });
    //}
    //WithGST
    // if (!validator.isValid1(withGST)) {
    //   return res
    //     .status(400)
    //     .send({ status: false, message: 'withGST is required' });
    // }
    // if (!validator.isValidPrice(withGST)) {
    //   return res
    //     .status(400)
    //     .send({ status: false, message: 'Enter a Valid withGST' });
    // }
    //Description
    // if (!description)
    //   return res
    //     .status(400)
    //     .send({ status: false, message: 'description is required' });
    // if (validator.isValid(description))
    //   return res.status(400).send({
    //     status: false,
    //     message: 'description should not be an empty string',
    //   });

    //ShippingCharges
    // if (!validator.isValid1(shippingCharges)) {
    //   return res
    //     .status(400)
    //     .send({ status: false, message: 'shippingCharges is required' });
    // }
    // if (!validator.isValidPrice(shippingCharges)) {
    //   return res
    //     .status(400)
    //     .send({ status: false, message: 'Enter a Valid shippingCharges' });
    // }
    //SizeUnit
    // if (!sizeUnit)
    //   return res
    //     .status(400)
    //     .send({ status: false, message: 'sizeUnit is required' });
    // if (validator.isValid(sizeUnit))
    //   return res.status(400).send({
    //     status: false,
    //     message: 'sizeUnit should not be an empty string',
    //   });

    //ProductQuantity
    // if (!productQuantity)
    //   return res
    //     .status(400)
    //     .send({ status: false, message: 'productQuantity is required' });
    // if (validator.isValid(productQuantity))
    //   return res.status(400).send({
    //     status: false,
    //     message: 'productQuantity should not be an empty string',
    //   });
    //Availability
    // if (!availability)
    //   return res
    //     .status(400)
    //     .send({ status: false, message: 'availability is required' });
    // if (validator.isValid(availability))
    //   return res.status(400).send({
    //     status: false,
    //     message: 'availability should not be an empty string',
    //   });

    if (!validator.isValid1(costumerID)) {
      return res
        .status(400)
        .send({ status: false, message: 'costumerID is required' });
    }
    if (!validator.isValidObjectId(costumerID)) {
      return res
        .status(400)
        .send({ status: false, message: 'costumerID not valid' });
    }
    let checkdata = await costumerModel.findById({ _id: costumerID });
    if (!checkdata)
      return res
        .status(201)
        .send({ status: false, message: 'costumer not found' });

    // let uploadImg = await uploadFile(req, res);

    // if (req.file == undefined) {
    //   return res.status(400).send({ message: "Please upload a file!" });
    // }
    // data.selectImage1 = req.file.originalname
    var currentdate = new Date();
    var datetime =
      currentdate.getDate() +
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
    let saveData = await AddProductsModel.create(data);
    res.status(201).send({ status: true, data: saveData });
  } catch (error) {
    if (error.code == 'LIMIT_FILE_SIZE') {
      return res.status(500).send({
        message: 'File size cannot be larger than 2MB!',
      });
    }
    return res.status(500).send({ status: false, message: error.message });
  }
};
//==================================product update======================================
const updateProduct = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const productID = req.params.productID;
    const data = req.body;
    let files = req.files;
    if (validator.isValidBody(data)) {
      return res
        .status(400)
        .send({ status: false, message: 'Enter details to create Product' });
    }

    let {
      productName,
      category,
      subCategory,
      manufacturerName,
      priceBeforeDiscount,
      price,
      withGST,
      description,
      shippingCharges,
      sizeUnit,
      productQuantity,
      availability,
      selectImage1,
      selectImage2,
      status, deliveryStatus
    } = data;
    if (selectImage1 || selectImage2) {
      if (!validator.isValidFiles(files)) {
        return res
          .status(400)
          .send({ status: false, message: 'productImage is required' });
      }
    }
    if (productName) {
      if (!productName)
        return res
          .status(400)
          .send({ status: false, message: 'productName is required' });
      if (validator.isValid(productName))
        return res.status(400).send({
          status: false,
          message: 'name should not be an empty string',
        });
    }

    if (category) {
      if (!category)
        return res
          .status(400)
          .send({ status: false, message: 'Category is required' });
      if (validator.isValid(category))
        return res.status(400).send({
          status: false,
          message: 'Category should not be an empty string',
        });
    }

    if (subCategory) {
      if (!subCategory)
        return res
          .status(400)
          .send({ status: false, message: 'SubCategory is required' });
      if (validator.isValid(subCategory))
        return res.status(400).send({
          status: false,
          message: 'subCategory should not be an empty string',
        });
    }

    if (manufacturerName) {
      if (!manufacturerName)
        return res
          .status(400)
          .send({ status: false, message: 'manufacturer is required' });
      if (validator.isValid(manufacturerName))
        return res.status(400).send({
          status: false,
          message: 'manufacturer should not be an empty string',
        });
    }

    if (priceBeforeDiscount) {
      if (!validator.isValid1(priceBeforeDiscount)) {
        return res
          .status(400)
          .send({ status: false, message: 'price is required' });
      }
      if (!validator.isValidPrice(priceBeforeDiscount)) {
        return res.status(400).send({
          status: false,
          message: 'Enter a Valid priceBeforeDiscount',
        });
      }
    }
    //Price
    if (price) {
      if (!validator.isValid1(price)) {
        return res
          .status(400)
          .send({ status: false, message: 'price is required' });
      }
      if (!validator.isValidPrice(price)) {
        return res
          .status(400)
          .send({ status: false, message: 'Enter a Valid price' });
      }
    }
    //WithGST
    if (withGST) {
      if (!validator.isValid1(withGST)) {
        return res
          .status(400)
          .send({ status: false, message: 'withGST is required' });
      }
      if (!validator.isValidPrice(withGST)) {
        return res
          .status(400)
          .send({ status: false, message: 'Enter a Valid withGST' });
      }
    }

    if (description) {
      if (!description)
        return res
          .status(400)
          .send({ status: false, message: 'description is required' });
      if (validator.isValid(description))
        return res.status(400).send({
          status: false,
          message: 'description should not be an empty string',
        });
    }

    if (shippingCharges) {
      if (!validator.isValid1(shippingCharges)) {
        return res
          .status(400)
          .send({ status: false, message: 'shippingCharges is required' });
      }
      if (!validator.isValidPrice(shippingCharges)) {
        return res
          .status(400)
          .send({ status: false, message: 'Enter a Valid shippingCharges' });
      }
    }

    if (sizeUnit) {
      if (!sizeUnit)
        return res
          .status(400)
          .send({ status: false, message: 'sizeUnit is required' });
      if (validator.isValid(sizeUnit))
        return res.status(400).send({
          status: false,
          message: 'sizeUnit should not be an empty string',
        });
    }

    if (productQuantity) {
      if (!productQuantity)
        return res
          .status(400)
          .send({ status: false, message: 'productQuantity is required' });
      if (validator.isValid(productQuantity))
        return res.status(400).send({
          status: false,
          message: 'productQuantity should not be an empty string',
        });
    }
    if (availability) {
      if (!availability)
        return res
          .status(400)
          .send({ status: false, message: 'availability is required' });
      if (validator.isValid(availability))
        return res.status(400).send({
          status: false,
          message: 'availability should not be an empty string',
        });
    }

    if (selectImage1) {
      if (!selectImage1)
        return res
          .status(400)
          .send({ status: false, message: 'SelectImage1 is required' });
      if (validator.isValid(SelectImage1))
        return res.status(400).send({
          status: false,
          message: 'SelectImage1 should not be an empty string',
        });
    }
    //SelectImage2
    if (selectImage2) {
      if (!selectImage2)
        return res
          .status(400)
          .send({ status: false, message: 'SelectImage2 is required' });
      if (validator.isValid(selectImage2))
        return res.status(400).send({
          status: false,
          message: 'SelectImage2 should not be an empty string',
        });
    }

    if (status) {
      let statuses = ['Pending', 'Approved', 'Rejected'];
      if (!statuses.includes(status))
        return res.status(400).send({
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
        return res.status(400).send({
          status: false,
          message: `deliveryStatus must be selected among ${deliveryStatuses}`,
        });
    }
    let manufacturerData = await AddProductsModel.findById({ _id:productID})
    if (!manufacturerData) {
      return res
        .status(404)
        .send({ status: false, message: 'no  manufacturerData found' });
    }
    let customerId = manufacturerData.costumerID?.toString();
    if (!customerId) {
      return res
        .status(404)
        .send({ status: false, message: 'customerID not found' });
    }
    let customerData = await costumerModel.findById(customerId);
    if (!customerData) {
      return res
        .status(404)
        .send({ status: false, message: 'customer not found' });
    }
    let email = customerData.email?.toString();
    let name = customerData.name?.toString();

    if (status) {
      if (status === 'Rejected') {
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
          color: '#48cfad',
          product: {
            logo: 'https://images-saboomaruti-in.s3.ap-south-1.amazonaws.com/misc/procurenlogo.png',
            // Custom logo height
            logoHeight: '100px',
            name: 'ProcureN',
            link: 'https://procuren.in/',

          },
        });
        let response = {
          body: {
            greeting: 'Dear',
            name: `${name}`,
            intro: [`We regret to inform you that your product ${productID} has been rejected. We have reviewed it thoroughly, and it does not meet our requirements. We understand that this may be disappointing news, but we assure you that we have taken every possible step to ensure fairness in our decision.`],
            outro: 'Thank you for your understanding.',
          },
        };
        let mail = MailGenerator.generate(response);
        let message = {
          from: EMAIL,
          to: email,
          subject: ` Rejection of Product ${productID}`,
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
      if (status === 'Approved') {
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
            logo: 'https://images-saboomaruti-in.s3.ap-south-1.amazonaws.com/misc/procurenlogo.png',
            // Custom logo height
            logoHeight: '100px',
            name: 'ProcureN',
            link: 'https://procuren.in/',

          },
        });
        let response = {
          body: {
            greeting: 'Dear',
            name: `${name}`,
            intro: [`We are pleased to inform you that your product has been approved and is ready for dispatch. Your tracking ID is :`],
            action: {
              instructions: "",
              button: {
                color: '#5c67f5', // Optional action button color
                text: `${productID}`,
                link: 'https://procuren.in/'

              }
            },
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
      if (status === 'Pending') {
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
            logo: 'https://images-saboomaruti-in.s3.ap-south-1.amazonaws.com/misc/procurenlogo.png',
            // Custom logo height
            logoHeight: '100px',
            name: 'ProcureN',
            link: 'https://procuren.in/',

          },
        });
        let response = {
          body: {
            name: `${name}`,
            intro: [`Your order with product ${productID} is pending. We are working to resolve it and will keep you updated. Contact us if you have any questions.`],
            outro: 'thank you',
          },
        };
        let mail = MailGenerator.generate(response);
        let message = {
          from: EMAIL,
          to: email,
          subject: `Pending Product Update`,
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
    }
    if (deliveryStatus) { //'processing','shipped','inTransit','delivered',
      if (deliveryStatus === "processing") {
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
            logo: 'https://images-saboomaruti-in.s3.ap-south-1.amazonaws.com/misc/procurenlogo.png',
            // Custom logo height
            logoHeight: '100px',
            name: 'ProcureN',
            link: 'https://procuren.in/',

          },
        });
        let response = {
          body: {
            name: `${name}`,
            intro: [`Your order with product ${productID} is pending. We are working to resolve it and will keep you updated. Contact us if you have any questions.`],
            outro: 'thank you',
          },
        };
        let mail = MailGenerator.generate(response);
        let message = {
          from: EMAIL,
          to: email,
          subject: ` Product processing`,
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
    }
    let productData = await AddProductsModel.findOneAndUpdate(
      { _id: productID },
      data,
      { new: true }
    );
    if (!productData) {
      return res
        .status(404)
        .send({ status: false, message: 'no user found to update' });
    }
    return res
      .status(200)
      .send({ status: true, message: 'success', data: productData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//=======================product delete================================================

const DeleteProduct = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    let productID = req.params.productID;
    if (!validator.isValidObjectId(productID)) {
      res
        .status(400)
        .send({ status: false, message: 'Please provide valid Product Id' });
    }
    let getId = await AddProductsModel.findOne({ _id: productID });
    if (!getId) {
      return res.status(404).send({
        status: false,
        message: 'Product Not Found for the request id',
      });
    }
    if (getId.isDeleted == true) {
      return res.status(404).send({
        status: false,
        message: 'Product is already deleted not found',
      });
    }

    await AddProductsModel.updateOne(
      { _id: productID },
      { isDeleted: true, deletedAt: Date.now() }
    );
    return res
      .status(200)
      .send({ status: true, message: 'Product is deleted' });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//======================get products=======================================================
const getProducts = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    let filter = { isDeleted: false };
    let sortStatus = req.query.status
    let delivery = req.query.deliveryStatus
    let created = req.query.createdAt
    const resultsPerPage =
      req.params.limit === ':limit' ? 10 : req.params.limit;
    let page = req.params.page >= 1 ? req.params.page : 1;
    //const query = req.query.search;

    page = page - 1;
    let CountOfData = await AddProductsModel.find(filter).countDocuments();

    if (sortStatus) {
      let data = await AddProductsModel.find(filter)
        .sort({ createdAt: created, status: sortStatus })
        .limit(resultsPerPage)
        .skip(resultsPerPage * page);
      if (!data)
        return res
          .status(404)
          .send({ status: false, message: 'no enquiries found' });

      res.status(200).send({
        status: true,
        data: data,
        count: CountOfData,
      });
    }
    else {
      let data = await AddProductsModel.find(filter)
        .sort({ deliveryStatus: delivery, createdAt: created })
        .limit(resultsPerPage)
        .skip(resultsPerPage * page);
      if (!data)
        return res
          .status(404)
          .send({ status: false, message: 'no enquiries found' });
      res.status(200).send({
        status: true,
        data: data,
        count: CountOfData,
      });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//======================get Individual products=======================================================
const getManufactureProducts = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    let customerID = req.params.customerID;
    let filter = { isDeleted: false };
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
    const resultsPerPage =
      req.params.limit === ':limit' ? 10 : req.params.limit;
    let page = req.params.page >= 1 ? req.params.page : 1;
    //const query = req.query.search;

    page = page - 1;
    let CountOfData = await AddProductsModel.find({
      costumerID: customerID,
    }).countDocuments();
    if (CountOfData.length === 0) {
      return res.status(400).send({ status: false, message: 'No data found.' });
    }
    let getData = await AddProductsModel.find({ costumerID: customerID })
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

//======================================get product names ====================================
const getproductnames = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    let filter = { isDeleted: false };
    let data = await AddProductsModel.find(filter).distinct('productName');
    if (!data)
      return res
        .status(404)
        .send({ status: false, message: 'no enquiries found' });
    res.status(200).send({ status: true, data: data });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//==============================count of products========================================
const countProduct = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    //"Retailer", "Manufacturer"
    let data = await AddProductsModel.find({
      isDeleted: false,
    }).countDocuments();
    res.status(200).send({ status: true, data: data });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//==============================================================================
const pending = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    //["pending","approved","rejected"]
    let data = await AddProductsModel.find({
      status: 'pending',
      isDeleted: false,
    }).countDocuments();
    res.status(200).send({ status: true, data: data });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//===============================================================================
const rejected = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    let data = await AddProductsModel.find({
      status: 'rejected',
      isDeleted: false,
    }).countDocuments();
    res.status(200).send({ status: true, data: data });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//=====================================================================================
const approved = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    let data = await AddProductsModel.find({
      status: 'approved',
      isDeleted: false,
    }).countDocuments();
    res.status(200).send({ status: true, data: data });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//==============================================================================
const countOfInprocessing = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    //"processing","shipped","inTransit","delivered"
    let data = await AddProductsModel.find({
      deliveryStatus: 'processing',
      isDeleted: false,
    }).countDocuments();
    res.status(200).send({ status: true, data: data });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//=====================================================================================
const countOfinTransit = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    //"processing","shipped","inTransit","delivered"
    let data = await AddProductsModel.find({
      deliveryStatus: 'inTransit',
      isDeleted: false,
    }).countDocuments();
    res.status(200).send({ status: true, data: data });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//==============================================================
const countOfinshipped = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    //"processing","shipped","inTransit","delivered"
    let data = await AddProductsModel.find({
      deliveryStatus: 'shipped',
      isDeleted: false,
    }).countDocuments();
    res.status(200).send({ status: true, data: data });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//==============================================================================
const countOfindelivered = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    //"processing","shipped","inTransit","delivered"
    let data = await AddProductsModel.find({
      deliveryStatus: 'delivered',
      isDeleted: false,
    }).countDocuments();
    res.status(200).send({ status: true, data: data });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//========================================================================

const getCounts = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const pipeline = [
      {
        $match: {
          isDeleted: false
        }
      },
      {
        $group: {
          _id: null,
          pending: { $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] } },
          rejected: { $sum: { $cond: [{ $eq: ['$status', 'Rejected'] }, 1, 0] } },
          approved: { $sum: { $cond: [{ $eq: ['$status', 'Approved'] }, 1, 0] } },
          inprocessing: { $sum: { $cond: [{ $eq: ['$deliveryStatus', 'processing'] }, 1, 0] } },
          inTransit: { $sum: { $cond: [{ $eq: ['$deliveryStatus', 'inTransit'] }, 1, 0] } },
          shipped: { $sum: { $cond: [{ $eq: ['$deliveryStatus', 'shipped'] }, 1, 0] } },
          delivered: { $sum: { $cond: [{ $eq: ['$deliveryStatus', 'delivered'] }, 1, 0] } }
        }
      },
      {
        $project: {
          _id: 0
        }
      }
    ];
    const data = await AddProductsModel.aggregate(pipeline);
    const count = await  AddProductsModel.countDocuments({ isDeleted: false })
    res.status(200).send({ status: true, data: data[0],count });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//=============================================================================================
const individualProductsCount = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const pipeline = [
      {
        $match: {
          isDeleted: false,
          costumerID: new mongoose.Types.ObjectId(req.params.customerID)
        }
      },
      {
        $group: {
          _id: null,
          pending: { $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] } },
          rejected: { $sum: { $cond: [{ $eq: ['$status', 'Rejected'] }, 1, 0] } },
          approved: { $sum: { $cond: [{ $eq: ['$status', 'Approved'] }, 1, 0] } },
          inprocessing: { $sum: { $cond: [{ $eq: ['$deliveryStatus', 'processing'] }, 1, 0] } },
          inTransit: { $sum: { $cond: [{ $eq: ['$deliveryStatus', 'inTransit'] }, 1, 0] } },
          shipped: { $sum: { $cond: [{ $eq: ['$deliveryStatus', 'shipped'] }, 1, 0] } },
          delivered: { $sum: { $cond: [{ $eq: ['$deliveryStatus', 'delivered'] }, 1, 0] } },
          total: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0
        }
      }
    ];

    const [data, count] = await Promise.all([
      AddProductsModel.aggregate(pipeline),
      AddProductsModel.countDocuments({ isDeleted: false, costumerID: new mongoose.Types.ObjectId(req.params.customerID) })
    ]);

    res.status(200).send({ status: true, data: data[0], count });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
;
module.exports = {
  addProdcts,
  updateProduct,
  DeleteProduct,
  getProducts,
  getManufactureProducts,
  getproductnames,
  countProduct,
  pending,
  rejected,
  approved,
  countOfInprocessing,
  countOfinTransit,
  countOfinshipped,
  countOfindelivered,
 // productsByStatus,
  getCounts,
  individualProductsCount
};
