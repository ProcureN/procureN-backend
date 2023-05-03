const AddProductModel = require("../models/AddProductModel");
const CostumerEnquiryModel = require("../models/CostomerEnquiryForm");
const CostumerModel = require("../models/CostumerModel");
const validator = require("../validation/validations");
const moment = require('moment');

const Mail = require("nodemailer/lib/mailer");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const { EMAIL, PASSWORD } = require("../env");

const EnquiryForm = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    //   let costumerId = req.params.customerID
    let data = req.body;
    const {
      productName,
      otherProduct,
     // name,
      contact,
      alternativeNumber,
      //email,
      state,
      billingAddress,
      shippingPincode,
      quantity,
      city,
      customerID,
     
    } = data;

    // if (validator.isValidBody(data))
    //   return res.status(400).send({
    //     status: false,
    //     message: 'Enter details to create your account',
    //   });
    if (!validator.isValid1(customerID)) {
      return res
        .status(400)
        .send({ status: false, message: "costumerID is required" });
    }
    if (!validator.isValidObjectId(customerID)) {
      return res
        .status(400)
        .send({ status: false, message: "costumerID not valid" });
    }
    let getCostumers = await CostumerModel.findOne({
      _id: customerID,
      isDeleted: false,
    });
    if (!getCostumers) {
      return res
        .status(404)
        .send({ status: false, message: "user not found or already deleted" });
    }
    //ProductName
    // if (!productName)
    //   return res
    //     .status(400)
    //     .send({ status: false, message: 'ProductName is required' });
    // if (validator.isValid(productName))
    //   return res
    //     .status(400)
    //     .send({ status: false, message: 'name should not be an empty string' });

    //OtherProduct
    //  if (!OtherProduct) return res.status(400).send({ status: false, message: "OtherProduct is required" });
    // if (otherProduct) {
    //   if (validator.isValid(otherProduct))
    //     return res.status(400).send({
    //       status: false,
    //       message: 'OtherProduct should not be an empty string',
    //     });
    // }
    //Name
    // if (!name)
    //   return res
    //     .status(400)
    //     .send({ status: false, message: 'name is required' });
    // if (validator.isValid(name))
    //   return res
    //     .status(400)
    //     .send({ status: false, message: 'name should not be an empty string' });

    // //Contact
    // if (!contact)
    //   return res
    //     .status(400)
    //     .send({ status: false, message: 'Contact is required' });
    // if (validator.isValid(contact))
    //   return res.status(400).send({
    //     status: false,
    //     message: 'Contact should not be an empty string',
    //   });
    // if (!validator.isValidPhone(contact.trim()))
    //   return res
    //     .status(400)
    //     .send({ status: false, message: 'Please Enter a valid Phone number' });

    //AlternativeNumber
    // if (alternativeNumber) {
    //   if (validator.isValid(alternativeNumber))
    //     return res.status(400).send({
    //       status: false,
    //       message: 'alternativeNumber should not be an empty string',
    //     });
    //   if (!validator.isValidPhone(alternativeNumber.trim()))
    //     return res.status(400).send({
    //       status: false,
    //       message: 'Please Enter a valid alternativeNumber',
    //     });
    // }

    //Email
    // if (!email)
    //   return res
    //     .status(400)
    //     .send({ status: false, message: 'User email-id is required' });
    // //validating user email-id
    // if (!validator.isValidEmail(email.trim()))
    //   return res
    //     .status(400)
    //     .send({ status: false, message: 'Please Enter a valid email-id' });

    //state
    // if (!state)
    //   return res
    //     .status(400)
    //     .send({ status: false, message: 'State is required' });
    // if (validator.isValid(state))
    //   return res.status(400).send({
    //     status: false,
    //     message: 'State should not be an empty string',
    //   });

    // BillingAddress
    // if (!billingAddress)
    //   return res
    //     .status(400)
    //     .send({ status: false, message: 'BillingAddress is required' });
    // if (validator.isValid(billingAddress))
    //   return res.status(400).send({
    //     status: false,
    //     message: 'BillingAddress should not be an empty string',
    //   });

    //ShippingPincode
    // if (!shippingPincode)
    //   return res
    //     .status(400)
    //     .send({ status: false, message: 'BillingAddress is required' });
    // if (validator.isValid(shippingPincode)) {
    //   return res
    //     .status(400)
    //     .send({ status: false, message: 'Pincode is in wrong format' });
    // }

    //quantity
    // if (!quantity)
    //   return res
    //     .status(400)
    //     .send({ status: false, message: 'quantity is required' });
    // if (validator.isValid(quantity)) {
    //   return res
    //     .status(400)
    //     .send({ status: false, message: 'quantity must be string' });
    // }
    // if (!validator.isValidPincode(shippingPincode)) {
    //   return res
    //     .status(400)
    //     .send({ status: false, message: 'Please Provide valid Pincode' });
    // }
    
    let date = moment().format('DD-MM-YYYY');
    let time = moment().format('HH:mm:ss');
    data.date = date;
    data.time = time;
    
    let email = getCostumers.email?.toString();
    let name = getCostumers.name?.toString();
    let config = {
      service: "gmail",
      auth: {
        user: EMAIL,
        pass: PASSWORD,
      },
    };
    let transporter = nodemailer.createTransport(config);

    let MailGenerator = new Mailgen({
      theme: "default",
      product: {
        logo: "https://images-saboomaruti-in.s3.ap-south-1.amazonaws.com/misc/procurenlogo.png",
        // Custom logo height
        logoHeight: "100px",
        name: "ProcureN",
        link: "https://procuren.in/",
      },
    });
    let response = {
      body: {
        greeting: "Dear",
        name: `${name}`,
        intro: [
          `Your enquiry has been registered successfully.Please find your tracking ID below: `,
        ],
        action: {
          instructions: "",
          button: {
            color: "#5c67f5", // Optional action button color
            text: `${customerEnquiryID}`,
            link: "https://procuren.in/",
          },
        },
        outro: "Thank you.",
      },
    };
    let mail = MailGenerator.generate(response);
    let message = {
      from: EMAIL,
      to: email,
      subject: `Your Enquiry Registration with Tracking ID ${customerEnquiryID}`,
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
  
    let saveData = await CostumerEnquiryModel.create(data);
    res.status(201).send({ status: true, data: saveData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//==========================================================================================================

const getEnquiries = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    let filter = { isDeleted: false };
    let sortStatus = req.query.status;
    let delivery = req.query.deliveryStatus;
    let created = req.query.createdAt;
    const resultsPerPage =
      req.params.limit === ":limit" ? 10 : req.params.limit;
    let page = req.params.page >= 1 ? req.params.page : 1;
    //const query = req.query.search;

    page = page - 1;
    let CountOfData = await CostumerEnquiryModel.find(filter).countDocuments();

    if (sortStatus) {
      let data = await CostumerEnquiryModel.find(filter)
        .sort({ createdAt: created, status: sortStatus })
        .limit(resultsPerPage)
        .skip(resultsPerPage * page);
      if (!data)
        return res
          .status(404)
          .send({ status: false, message: "no enquiries found" });

      res.status(200).send({
        status: true,
        data: data,
        count: CountOfData,
      });
    } else {
      let data = await CostumerEnquiryModel.find(filter)
        .sort({ deliveryStatus: delivery, createdAt: created })
        .limit(resultsPerPage)
        .skip(resultsPerPage * page);
      if (!data)
        return res
          .status(404)
          .send({ status: false, message: "no enquiries found" });
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

//==========================update costumers =========================================
const updateCostumersEnquiry = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    let data = req.body;
    const customerEnquiryID = req.params.customerEnquiryId;
    let { status, deliveryStatus } = data;
   
    let getcustomerEnquiryData = await CostumerEnquiryModel.findById(
      customerEnquiryID
    );
    if (!getcustomerEnquiryData) {
      return res
        .status(404)
        .send({ status: false, message: "no customer enquiry found" });
    }
    let customerId = getcustomerEnquiryData.customerID?.toString();
    if (!customerId) {
      return res
        .status(404)
        .send({ status: false, message: "customerID not found" });
    }
    let customerData = await CostumerModel.findById(customerId);
    if (!customerData) {
      return res
        .status(404)
        .send({ status: false, message: "customer not found" });
    }
    let email = customerData.email?.toString();
    let name = customerData.name?.toString();
    if (status) {
      if (status === "Rejected") {
        let config = {
          service: "gmail",
          auth: {
            user: EMAIL,
            pass: PASSWORD,
          },
        };
        let transporter = nodemailer.createTransport(config);

        let MailGenerator = new Mailgen({
          theme: "default",
          product: {
            logo: "https://images-saboomaruti-in.s3.ap-south-1.amazonaws.com/misc/procurenlogo.png",
            // Custom logo height
            logoHeight: "100px",
            name: "ProcureN",
            link: "https://procuren.in/",
          },
        });
        let response = {
          body: {
            greeting: "Dear",
            name: `${name}`,
            intro: [
              `We regret to inform you that your Enquiry ${customerEnquiryID} has been rejected. We have reviewed it thoroughly, and it does not meet our requirements. We understand that this may be disappointing news, but we assure you that we have taken every possible step to ensure fairness in our decision.`,
            ],
            outro: "Thank you for your understanding.",
          },
        };
        let mail = MailGenerator.generate(response);
        let message = {
          from: EMAIL,
          to: email,
          subject: ` Rejection of enquiry ${customerEnquiryID}`,
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
      if (status === "Approved") { //"processing", "shipped", "inTransit", "delivered"
        if(deliveryStatus =="processing"){
        let config = {
          service: "gmail",
          auth: {
            user: EMAIL,
            pass: PASSWORD,
          },
        };
        let transporter = nodemailer.createTransport(config);

        let MailGenerator = new Mailgen({
          theme: "default",
          product: {
            logo: "https://images-saboomaruti-in.s3.ap-south-1.amazonaws.com/misc/procurenlogo.png",
            // Custom logo height
            logoHeight: "100px",
            name: "ProcureN",
            link: "https://procuren.in/",
          },
        });
        let response = {
          body: {
            greeting: "Dear",
            name: `${name}`,
            intro: [
              `We are pleased to inform you that your enquiry has been approved and is ready for dispatch. Please find your tracking ID below: `,
            ],
            action: {
              instructions: "",
              button: {
                color: "#5c67f5", // Optional action button color
                text: `${customerEnquiryID}`,
                link: "https://procuren.in/",
              },
            },
            outro: "Thank you for choosing our services.",
          },
        };
        let mail = MailGenerator.generate(response);
        let message = {
          from: EMAIL,
          to: email,
          subject: "Track it",
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
      //
      if (deliveryStatus === "shipped") {
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
            intro: [`We are pleased to inform you that your order has been shipped.Please find your tracking ID below: `],
            action: {
              instructions: "",
              button: {
                color: "#5c67f5", // Optional action button color
                text: `${customerEnquiryID}`,
                link: "https://procuren.in/",
              },
            },
            outro: 'Thank you for choosing our service.',
          },
        };
        let mail = MailGenerator.generate(response);
        let message = {
          from: EMAIL,
          to: email,
          subject: `Product Has Shipped!`,
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
      if (deliveryStatus === "inTransit") {
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
            intro: [`We are pleased to inform you that your product is now in transit. You can track your shipment using the tracking ID provided: `],
            action: {
              instructions: "",
              button: {
                color: "#5c67f5", // Optional action button color
                text: `${customerEnquiryID}`,
                link: "https://procuren.in/",
              },
            },
            outro: 'Thank you for choosing our service.',
          },
        };
        let mail = MailGenerator.generate(response);
        let message = {
          from: EMAIL,
          to: email,
          subject: `Product in Transit`,
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
      if (deliveryStatus === "delivered") {
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
            intro: [`We're happy to inform you that your order has been delivered today. Please let us know if you have any questions or concerns regarding the delivery.`],
            outro: 'Thank you for choosing our service.',
          },
        };
        let mail = MailGenerator.generate(response);
        let message = {
          from: EMAIL,
          to: email,
          subject: `Delivery Confirmation`,
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
      if (status === "Pending") {
        let config = {
          service: "gmail",
          auth: {
            user: EMAIL,
            pass: PASSWORD,
          },
        };
        let transporter = nodemailer.createTransport(config);

        let MailGenerator = new Mailgen({
          theme: "default",
          product: {
            logo: "https://images-saboomaruti-in.s3.ap-south-1.amazonaws.com/misc/procurenlogo.png",
            // Custom logo height
            logoHeight: "100px",
            name: "ProcureN",
            link: "https://procuren.in/",
          },
        });
        let response = {
          body: {
            name: `${name}`,
            intro: [
              `Your order with enquiry ${customerEnquiryID} is pending. We are working to resolve it and will keep you updated. Contact us if you have any questions.`,
            ],
            outro: "thank you",
          },
        };
        let mail = MailGenerator.generate(response);
        let message = {
          from: EMAIL,
          to: email,
          subject: `Pending  of enquiry `,
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
    // if (deliveryStatus) { //'processing','shipped','inTransit','delivered',
    //   if (deliveryStatus === "processing") {
    //     let config = {
    //       service: 'gmail',
    //       auth: {
    //         user: EMAIL,
    //         pass: PASSWORD,
    //       },
    //     };
    //     let transporter = nodemailer.createTransport(config);

    //     let MailGenerator = new Mailgen({
    //       theme: 'default',
    //       product: {
    //         logo: 'https://images-saboomaruti-in.s3.ap-south-1.amazonaws.com/misc/procurenlogo.png',
    //         // Custom logo height
    //         logoHeight: '100px',
    //         name: 'ProcureN',
    //         link: 'https://procuren.in/',

    //       },
    //     });
    //     let response = {
    //       body: {
    //         name: `${name}`,
    //         intro: [`This is to inform you that your product ${customerEnquiryID} is currently in process. Our team is working hard to ensure its timely completion. We will keep you updated with the progress.`],
    //         outro: 'Thank you for your patience.',
    //       },
    //     };
    //     let mail = MailGenerator.generate(response);
    //     let message = {
    //       from: EMAIL,
    //       to: email,
    //       subject: `Product is being processed`,
    //       html: mail,
    //     };
    //     transporter
    //       .sendMail(message)
    //       .then(() => {
    //         // return res.status(201).json({
    //         //     message: "you should receive an email"
    //         // })
    //       })
    //       .catch((error) => {
    //         return res.status(500).json({ error });
    //       });

    //   }
     
    // }
    let userData = await CostumerEnquiryModel.findOneAndUpdate(
      { _id: customerEnquiryID },
      data,
      { new: true }
    );
    if (!userData) {
      return res
        .status(404)
        .send({ status: false, message: "no user found to update" });
    }
    return res
      .status(200)
      .send({ status: true, message: "success", data: userData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//=========================================get individual costumer enquiry================================

const IndividualCostumerEnquiry = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    let customerID = req.params.customerID;

    if (!validator.isValid1(customerID)) {
      return res
        .status(400)
        .send({ status: false, message: "costumerID is required" });
    }
    if (!validator.isValidObjectId(customerID)) {
      return res
        .status(400)
        .send({ status: false, message: "costumerID not valid" });
    }

    // if(!getData){
    //     return res.status(404).send({ status: false, message: "not enquiries found" })
    // }
    let filter = { isDeleted: false };
    const resultsPerPage =
      req.params.limit === ":limit" ? 10 : req.params.limit;
    let page = req.params.page >= 1 ? req.params.page : 1;
    page = page - 1;
    //const query = req.query.search;
    let CountOfData = await CostumerEnquiryModel.find({
      isDeleted: false,
      customerID: customerID,
    }).countDocuments();
    let getData = await CostumerEnquiryModel.find({
      isDeleted: false,
      customerID: customerID,
    })
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
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    let customerEnquiryId = req.params.customerEnquiryId;
    if (!validator.isValidObjectId(customerEnquiryId)) {
      res.status(400).send({
        status: false,
        message: "Please provide valid costumerEnquiryId",
      });
    }
    let getcustomerEnquiryId = await CostumerEnquiryModel.findOne({
      _id: customerEnquiryId,
    });
    if (!getcustomerEnquiryId) {
      return res.status(404).send({
        status: false,
        message: "customerEnquiry  Not Found for the request id",
      });
    }
    if (getcustomerEnquiryId.isDeleted == true) {
      return res.status(404).send({
        status: false,
        message: "CostumerEnquiry is already deleted not found",
      });
    }

    await CostumerEnquiryModel.updateOne(
      { _id: customerEnquiryId },
      { isDeleted: true, deletedAt: Date.now() }
    );
    return res
      .status(200)
      .send({ status: true, message: "customerEnquiryId is deleted" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//==========================count of enquire====================================================

const countData = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    let data = await CostumerEnquiryModel.find({
      isDeleted: false,
    }).countDocuments();
    res.status(200).send({ status: true, data: data });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//==========================tracking customer enquiry====================================

const trackEnquiry = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    let customerEnquiryId = req.params.enquireId;
    if (!validator.isValidObjectId(customerEnquiryId)) {
      res.status(400).send({
        status: false,
        message: "Please provide valid id",
      });
    }
    let getcustomerEnquiryId = await CostumerEnquiryModel.findOne({
      _id: customerEnquiryId,
    });
    if (!getcustomerEnquiryId) {
      return res.status(404).send({
        status: false,
        message: "id  Not Found",
      });
    }
    if (getcustomerEnquiryId.isDeleted == true) {
      return res.status(404).send({
        status: false,
        message: "id is already deleted not found",
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
//============================================================================
const allData = async (req, res) => {
  try {
    const [data, count] = await Promise.all([
      CostumerEnquiryModel.aggregate([
        { $match: { isDeleted: false } },
        {
          $group: {
            _id: null,
            pendingData: {
              $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] },
            },
            rejectedData: {
              $sum: { $cond: [{ $eq: ["$status", "Rejected"] }, 1, 0] },
            },
            approvedData: {
              $sum: { $cond: [{ $eq: ["$status", "Approved"] }, 1, 0] },
            },
            countOfInprocessingDelivery: {
              $sum: {
                $cond: [{ $eq: ["$deliveryStatus", "processing"] }, 1, 0],
              },
            },
            countOfinTransitDelivery: {
              $sum: {
                $cond: [{ $eq: ["$deliveryStatus", "inTransit"] }, 1, 0],
              },
            },
            countOfinshippedDelivery: {
              $sum: { $cond: [{ $eq: ["$deliveryStatus", "shipped"] }, 1, 0] },
            },
            countOfindeliveredDelivery: {
              $sum: {
                $cond: [{ $eq: ["$deliveryStatus", "delivered"] }, 1, 0],
              },
            },
          },
        },
        { $project: { _id: 0 } },
      ]),
      CostumerEnquiryModel.countDocuments({ isDeleted: false }),
    ]);

    res.status(200).send({ status: true, data: data[0], count });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

//===========================================================================
const IndividualCostumerEnquiryCounts = async (req, res) => {
  try {
    const data = await CostumerEnquiryModel.aggregate([
      {
        $match: {
          isDeleted: false,
          customerID: new mongoose.Types.ObjectId(req.params.customerID),
        },
      },
      {
        $group: {
          _id: null,
          pendingData: {
            $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] },
          },
          rejectedData: {
            $sum: { $cond: [{ $eq: ["$status", "Rejected"] }, 1, 0] },
          },
          approvedData: {
            $sum: { $cond: [{ $eq: ["$status", "Approved"] }, 1, 0] },
          },
          countOfInprocessingDelivery: {
            $sum: { $cond: [{ $eq: ["$deliveryStatus", "processing"] }, 1, 0] },
          },
          countOfinTransitDelivery: {
            $sum: { $cond: [{ $eq: ["$deliveryStatus", "inTransit"] }, 1, 0] },
          },
          countOfinshippedDelivery: {
            $sum: { $cond: [{ $eq: ["$deliveryStatus", "shipped"] }, 1, 0] },
          },
          countOfindeliveredDelivery: {
            $sum: { $cond: [{ $eq: ["$deliveryStatus", "delivered"] }, 1, 0] },
          },
        },
      },
      {
        $group: {
          _id: "$customerID",
          count: { $sum: 1 },
          data: { $first: "$$ROOT" },
        },
      },
      { $project: { _id: 0, count: 1, data: 1 } },
    ]);
    const count = await CostumerEnquiryModel.find({
      customerID: req.params.customerID,
    }).countDocuments({ isDeleted: false });
    res.send({ status: true, count: count, data: data[0].data });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = {
  EnquiryForm,
  getEnquiries,
  IndividualCostumerEnquiry,
  deleteCostumerEnquiry,
  countData,
  updateCostumersEnquiry,
  trackEnquiry,
  allData,
  IndividualCostumerEnquiryCounts,
};
