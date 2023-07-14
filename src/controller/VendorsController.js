const VendorModel = require("../models/VendorModel");
const validator = require("../validation/validations");
const UserModel = require("../models/UserModel");
const aws = require("../aws/aws");
const moment = require("moment");
require("moment-timezone");

const uploadFile = require("../middleware/uploads");
const fs = require("fs");
const { Aggregate } = require("mongoose");
const Mail = require("nodemailer/lib/mailer");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const { EMAIL, PASSWORD } = require("../env");

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

    moment.tz.setDefault("Asia/Kolkata");// default time zone as india after deploy too

    // Get the current date and time
    let date = moment().format("DD/MM/YYYY");
    let time = moment().format("HH:mm:ss");

    //fetch the previous tracking id
    let lastVchNo = await VendorModel.findOne(
      {},
      {},
      { sort: { createdAt: -1 } }
    );
//     let lastTrackingNumber = lastVchNo.vchNo
//     if(!lastTrackingNumber){
//        let trackingID =`PN100`
//        data.trackingID = trackingID;

//     }
// else{
//     // Generate the new tracking number by adding 1 to the last tracking number
//     let newTrackingNumber = lastTrackingNumber.substring(2);
//     let addOne = parseInt(newTrackingNumber) + 1;
//     // Generate the tracking ID
//     let trackingID = `PN${addOne}`;
//     data.trackingID = trackingID;

// }
//     data.date = date;
//     data.time = time;
//     let email = checkdata.email?.toString();
//     let name = checkdata.name?.toString();
 

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
    let files = req.files;
    let { selectImage1, selectImage2, status, deliveryStatus } = data;
    let manufacturerData = await VendorModel.findById({ _id: vendorID });
    if (!manufacturerData) {
      return res.status(404).send({ 
        status: false,
         message: "no  manufacturerData found"
         });
    }
    let userID = manufacturerData.userID?.toString();
    let trackingID = manufacturerData.trackingID;
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
    let email = userData.email?.toString();
    let name = userData.name?.toString();

    if (status) {
      if (status === "Rejected") {
        let config = {
          service: "gmail",
          auth: {
            user: EMAIL,
            pass: process.env.PASSWORD,
          },
        };
        let transporter = nodemailer.createTransport(config);

        let MailGenerator = new Mailgen({
          theme: "default",
          color: "#48cfad",
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
              `We regret to inform you that your product ${trackingID} has been rejected.`,
              `Please contact us if you have any questions.`,
            ],
            outro: "Thank you for your understanding.",
            signature: "Best regards",
          },
        };
        let mail = MailGenerator.generate(response);
        let message = {
          from: EMAIL,
          to: email,
          subject: `ProcureN -  Your product is rejected`,
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
      if (status === "Approved") {
        if (deliveryStatus === "Processing") {
          let config = {
            service: "gmail",
            auth: {
              user: EMAIL,
              pass: process.env.PASSWORD,
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
                `We are pleased to inform you that your product has been approved and is ready for dispatch.`,
                `Your tracking ID : ${trackingID} `,
              ],
              action: {
                instructions: "",
                button: {
                  color: "#5c67f5", // Optional action button color
                  text: `Track Now`,
                  link: "https://procuren.in/",
                },
              },
              outro: "Thank you for your patience.",
              signature: "Best regards",
            },
          };
          let mail = MailGenerator.generate(response);
          let message = {
            from: EMAIL,
            to: email,
            subject: `ProcureN - Your product has been Approved!`,
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
        if (deliveryStatus === "Shipped") {
          let config = {
            service: "gmail",
            auth: {
              user: EMAIL,
              pass: process.env.PASSWORD,
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
                `We are pleased to inform you that your order has been shipped.`,
                `Your tracking ID : ${trackingID} `,
              ],
              action: {
                instructions: "",
                button: {
                  color: "#5c67f5", // Optional action button color
                  text: `Track Now`,
                  link: "https://procuren.in/",
                },
              },
              outro: "Thank you for choosing our service.",
              signature: "Best regards",
            },
          };
          let mail = MailGenerator.generate(response);
          let message = {
            from: EMAIL,
            to: email,
            subject: `ProcureN - Product has Shipped!`,
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
        if (deliveryStatus === "Delivered") {
          let config = {
            service: "gmail",
            auth: {
              user: EMAIL,
              pass: process.env.PASSWORD,
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
                `We're happy to inform you that your order ${trackingID} has been delivered.`,
              ],
              outro: "Thank you for choosing our service.",
              signature: "Best regards",
            },
          };
          let mail = MailGenerator.generate(response);
          let message = {
            from: EMAIL,
            to: email,
            subject: `ProcureN - Delivery Confirmation`,
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
            pass: process.env.PASSWORD,
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
              `Your order  ${trackingID} is pending. We are working on it and will keep you updated.`,
              `Please contact us if you have any questions.`,
            ],
            action: {
              instructions: "",
              button: {
                color: "#5c67f5", // Optional action button color
                text: `Track Now`,
                link: "https://procuren.in/",
              },
            },
            outro: "Thank you",
            signature: "Best regards",
          },
        };
        let mail = MailGenerator.generate(response);
        let message = {
          from: EMAIL,
          to: email,
          subject: `ProcureN - Pending of an enquiry`,
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
        message: "Product is deleted" 
      });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//======================get products=======================================================
// const getVendor = async (req, res) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   try {
//     let filter = { isDeleted: false };

//     // const resultsPerPage =
//     //   req.params.limit === ":limit" ? 10 : req.params.limit;
//     // let page = req.params.page >= 1 ? req.params.page : 1;
//     // //const query = req.query.search;

//     // page = page - 1;
//     // let CountOfData = await VendorModel.find(filter).countDocuments();

//     let data = await VendorModel.find(filter)
//       .sort([["createdAt", -1]])
//       .limit(resultsPerPage)
//       .skip(resultsPerPage * page);
//     if (!data)
//       return res.status(404).send({ 
//         status: false,
//          message: "no products found" 
//         });

//     res.status(200).send({
//       status: true,
//       data: data,
//       // count: CountOfData,
//     });
//   } catch (error) {
//     return res.status(500).send({ status: false, message: error.message });
//   }
// };

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
         message: "No data found."
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
//==============================================================================
const pending = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    //["pending","approved","rejected"]
    let data = await VendorModel.find({
      status: "pending",
      isDeleted: false,
    }).countDocuments();
    res.status(200).send({
       status: true, 
       data: data });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//===============================================================================
const rejected = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    let data = await VendorModel.find({
      status: "rejected",
      isDeleted: false,
    }).countDocuments();
    res.status(200).send({ status: true, data: data });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//=====================================================================================
const approved = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    let data = await VendorModel.find({
      status: "approved",
      isDeleted: false,
    }).countDocuments();
    res.status(200).send({ status: true, data: data });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//==============================================================================
const countOfInprocessing = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    //"processing","shipped","delivered"
    let data = await VendorModel.find({
      deliveryStatus: "Processing",
      isDeleted: false,
    }).countDocuments();
    res.status(200).send({ status: true, data: data });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//=====================================================================================
//==============================================================
const countOfinshipped = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    //"processing","shipped","delivered"
    let data = await VendorModel.find({
      deliveryStatus: "Shipped",
      isDeleted: false,
    }).countDocuments();
    res.status(200).send({ status: true, data: data });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//==============================================================================
const countOfindelivered = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    //"processing","shipped","delivered"
    let data = await VendorModel.find({
      deliveryStatus: "Delivered",
      isDeleted: false,
    }).countDocuments();
    res.status(200).send({ status: true, data: data });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//========================================================================

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
;

module.exports = {
 vendor,
   updateVendor,
 DeleteVendor,
   getVendor,
  getManufactureProducts: IndividualVendor,
  getproductnames,
  countProduct,
  pending,
  rejected,
  approved,
  countOfInprocessing,

  countOfinshipped,
  countOfindelivered,
  // productsByStatus,
  getCounts,
  individualProductsCount,
  countOfStatusByCustomerIdOfProducts
};
