const AddProductModel = require("../models/VendorModel");
const clientModel = require("../models/clientModel");
const UserModel = require("../models/UserModel");
const validator = require("../validation/validations");
const moment = require("moment");
require("moment-timezone");

const Mail = require("nodemailer/lib/mailer");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const { EMAIL, PASSWORD } = require("../env");

const client = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    //   let costumerId = req.params.customerID
    let data = req.body;
    const { userID } = data;

    if (!validator.isValid1(userID)) {
      return res.status(400).send({
        status: false,
        message: "userID is required",
      });
    }
    if (!validator.isValidObjectId(userID)) {
      return res.status(400).send({
        status: false,
        message: "userID not valid",
      });
    }
    let getCostumers = await UserModel.findOne({
      _id: userID,
      isDeleted: false,
    });
    if (!getCostumers) {
      return res.status(404).send({
        status: false,
        message: "user not found or already deleted",
      });
    }

    moment.tz.setDefault("Asia/Kolkata");

    // Get the current date and time
    let date = moment().format("DD-MM-YYYY");
    let time = moment().format("HH:mm:ss");

    // let lastTracking = await CostumerEnquiryModel.findOne(
    //   {},
    //   {},
    //   { sort: { createdAt: -1 } }
    // );
 //   let lastTrackingNumber = lastTracking.trackingID;
//     if(!lastTrackingNumber){
//        let trackingID =`PN100000`
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
    data.date = date;
     data.time = time;
    
    // let email = getCostumers.email?.toString();
    // let name = getCostumers.name?.toString();
    // let config = {
    //   service: "gmail",
    //   auth: {
    //     user: EMAIL,
    //     pass: PASSWORD,
    //   },
    // };
    // let transporter = nodemailer.createTransport(config);

    // let MailGenerator = new Mailgen({
    //   theme: "default",
    //   product: {
    //     logo: "https://images-saboomaruti-in.s3.ap-south-1.amazonaws.com/misc/procurenlogo.png",
    //     // Custom logo height
    //     logoHeight: "100px",
    //     name: "ProcureN",
    //     link: "https://procuren.in/",
    //   },
    // });
    // let response = {
    //   body: {
    //     greeting: `Hi ${name}`,

    //     intro: [
    //       `Your enquiry has been registered successfully.Your tracking ID is ${data.trackingID} `,
    //     ],
    //     action: {
    //       instructions: "",
    //       button: {
    //         color: "#5c67f5", // Optional action button color
    //         text: `Track Now`,
    //         link: "https://procuren.in/",
    //       },
    //     },
    //     outro: "Thank you.",
    //     signature: "Best regards",
    //   },
    // };
    // let mail = MailGenerator.generate(response);
    // let message = {
    //   from: EMAIL,
    //   to: email,
    //   subject: `ProcureN - Your Business Proposal has been received`,
    //   html: mail,
    // };
    // transporter
    //   .sendMail(message)
    //   .then(() => {
    //     // return res.status(201).json({
    //     //     message: "you should receive an email"
    //     // })
    //   })
    //   .catch((error) => {
    //     return res.status(500).json({ error });
    //   });
    // //=================================2=========================================
    // let response2 = {
    //   body: {
    //     greeting: "Dear Admin",

    //     intro: [
    //       `We are pleased to inform you that a new Business Proposal has been received on our platform.`,

    //       `Please log in to the portal to view and respond to the enquiry.
    //    `,
    //     ],
    //     action: {
    //       instructions: "",
    //       button: {
    //         color: "#5c67f5", // Optional action button color
    //         text: `Login`,
    //         link: "https://procuren.in/login",
    //       },
    //     },
    //     outro: "Thank you.",
    //     signature: "Best regards",
    //   },
    // };
    // let mail2 = MailGenerator.generate(response2);
    // let message2 = {
    //   from: EMAIL,
    //   to: "nar.procuren@gmail.com",
    //   subject: `ProcureN - New Business Proposal Received`,
    //   html: mail2,
    // };
    // transporter
    //   .sendMail(message2)
    //   .then(() => {
    //     // return res.status(201).json({
    //     //     message: "you should receive an email"
    //     // })
    //   })
    //   .catch((error) => {
    //     return res.status(500).json({ error });
    //   });

    let saveData = await clientModel.create(data);

    res.status(201).send({ status: true, data: saveData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//==========================================================================================================

const getClientsDetails = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    let filter = { isDeleted: false };

    const resultsPerPage =
      req.params.limit === ":limit" ? 10 : req.params.limit;
    let page = req.params.page >= 1 ? req.params.page : 1;
    //const query = req.query.search;

    page = page - 1;
    let CountOfData = await clientModel.find(filter).countDocuments();

    let data = await clientModel.find(filter)
      .sort([["createdAt", -1]])
      .limit(resultsPerPage)
      .skip(resultsPerPage * page); //.countDocuments().exec()
    if (!data) {
      return res.status(404).send({
        status: false,
        message: "no enquiries found",
      });
    }
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
const updateclient = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    let data = req.body;
    const clientId = req.params.clientId;
    let { status, deliveryStatus } = data;

    let getclient = await clientModel.findById(
      clientId
    );
    if (!getclient) {
      return res.status(404).send({
        status: false,
        message: "no customer enquiry found",
      });
    }
    let userID = getclient.userID?.toString();
    let trackingID = getclient.trackingID;
    if (!userID) {
      return res.status(404).send({
        status: false,
        message: "userID not found",
      });
    }
    let user = await UserModel.findById(userID);
    if (!user) {
      return res
        .status(404)
        .send({ status: false, message: "user not found" });
    }
    let email = user.email?.toString();
    let name = user.name?.toString();
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
              `We regret to inform you that your Enquiry ${trackingID} has been rejected.`,
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
          subject: `ProcureN - Your enquiry is rejected`,
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
        //"processing", "shipped", "delivered"
        if (deliveryStatus == "Processing") {
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
                `We are pleased to inform you that your enquiry has been approved and is ready for dispatch.`,
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
              outro: "Thank you for choosing our services.",
              signature: "Best regards",
            },
          };
          let mail = MailGenerator.generate(response);
          let message = {
            from: EMAIL,
            to: email,
            subject: "ProcureN - Your Enquiry has been Approved!",
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
        if (deliveryStatus === "Shipped") {
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
                `We are pleased to inform you that your order has been shipped.`,
                `
                Your tracking ID : ${trackingID} `,
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
        if (deliveryStatus === "") {
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
                `We are pleased to inform you that your product is now in transit.`,
                ` Your tracking ID: ${trackingID}`,
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
            subject: `ProcureN - Product is in Transit`,
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
              `Your order with enquiry ${trackingID} is pending. We are working on it and will keep you updated.`,
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
          subject: `ProcureN - Pending of an enquiry `,
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
    let userData = await clientModel.findOneAndUpdate(
      { _id: clientId },
      data,
      { new: true }
    );
    if (!userData) {
      return res.status(404).send({
        status: false,
        message: "no user found to update",
      });
    }
    return res
      .status(200)
      .send({ status: true, message: "success", data: userData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//=========================================get individual costumer enquiry================================

const Individualclient = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    let userID = req.params.userID;

    if (!validator.isValid1(userID)) {
      return res.status(400).send({
        status: false,
        message: "costumerID is required",
      });
    }
    if (!validator.isValidObjectId(userID)) {
      return res.status(400).send({
        status: false,
        message: "costumerID not valid",
      });
    }

    const resultsPerPage =
      req.params.limit === ":limit" ? 10 : req.params.limit;
    let page = req.params.page >= 1 ? req.params.page : 1;
    page = page - 1;
    //const query = req.query.search;
    let CountOfData = await clientModel.find({
      isDeleted: false,
      userID: userID,
    }).countDocuments();
    let getData = await clientModel.find({
      isDeleted: false,
      userID: userID,
    })
      .sort({ createdAt: -1 })
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

const deleteClient = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    let clientId = req.params.clientId;
    if (!validator.isValidObjectId(clientId)) {
      res.status(400).send({
        status: false,
        message: "Please provide valid clientId",
      });
    }
    let getclient = await clientModel.findOne({
      _id: clientId,
    });
    if (!getclient) {
      return res.status(404).send({
        status: false,
        message: "clientId  Not Found for the request id",
      });
    }
    if (getclient.isDeleted == true) {
      return res.status(404).send({
        status: false,
        message: "already deleted not found",
      });
    }

    await clientModel.updateOne(
      { _id: clientId },
      { isDeleted: true, deletedAt: Date.now() }
    );
    return res.status(200).send({
      status: true,
      message: "deleted successfull",
    });
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
    let trackingID = req.params.trackingID;
    let getcustomerEnquiryId = await CostumerEnquiryModel.findOne({
      trackingID: trackingID,
    }).select({ status: 1, deliveryStatus: 1 });
    let getProductData = await AddProductModel.findOne({
      trackingID: trackingID,
    });

    if (getcustomerEnquiryId || getProductData) {
      if (getcustomerEnquiryId) {
        if (getcustomerEnquiryId.isDeleted == true) {
          return res.status(404).send({
            status: false,
            message: "tracking ID is deleted",
          });
        } else {
          return res.status(200).send({
            status: true,
            data: getcustomerEnquiryId,
          });
        }
      } else if (getProductData) {
        if (getProductData.isDeleted == true) {
          return res.status(404).send({
            status: false,
            message: "tracking ID is deleted",
          });
        } else
          return res.status(200).send({
            status: true,
            data: getProductData,
          });
      }
    } else {
      if (!getcustomerEnquiryId || !getProductData) {
        return res.status(404).send({
          status: false,
          message: "Not Found",
        });
      }
    }
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
                $cond: [{ $eq: ["$deliveryStatus", "Processing"] }, 1, 0],
              },
            },
           
            countOfinshippedDelivery: {
              $sum: { $cond: [{ $eq: ["$deliveryStatus", "Shipped"] }, 1, 0] },
            },
            countOfindeliveredDelivery: {
              $sum: {
                $cond: [{ $eq: ["$deliveryStatus", "Delivered"] }, 1, 0],
              },
            },
          },
        },
        { $project: { _id: 0 } },
      ]),
      CostumerEnquiryModel.countDocuments({ isDeleted: false }),
    ]);

    res.status(200).send({ status: true,info:"enquiries", data: data[0], count });
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
            $sum: { $cond: [{ $eq: ["$deliveryStatus", "Processing"] }, 1, 0] },
          },
         
          countOfinshippedDelivery: {
            $sum: { $cond: [{ $eq: ["$deliveryStatus", "Shipped"] }, 1, 0] },
          },
          countOfindeliveredDelivery: {
            $sum: { $cond: [{ $eq: ["$deliveryStatus", "Delivered"] }, 1, 0] },
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
//=================================================================================================
const countOfStatusByCustomerId = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    let { limit } = req.params; // Get the limit from path parameters

    limit = limit ? parseInt(limit) : 10;
    if (isNaN(limit)) {
      limit = 10;
    }
    const pipeline = [
      {
        $match: {
          isDeleted: false // Add this $match stage to exclude deleted documents
        }
      },
      {
        $group: {
          _id: '$customerID',
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
        $limit: parseInt(limit)
      }
    ];

    const result = await CostumerEnquiryModel.aggregate(pipeline);

    const transformedData = result.map((item) => {
      return {
        name: item.name,
        Approved: item.Approved,
        Pending: item.Pending,
        Rejected: item.Rejected
      };
    });

    res.status(200).send({ status: true, data: transformedData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};





module.exports = {
  client,
  getClientsDetails,
  Individualclient,
  deleteClient,
  countData,
  updateclient,
  trackEnquiry,
  allData,
  IndividualCostumerEnquiryCounts,
  countOfStatusByCustomerId
};
