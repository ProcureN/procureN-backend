const contactformModel = require("../models/contactUsModel");
const validator = require("../validation/validations");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const moment = require("moment");
require("moment-timezone");
const { EMAIL, PASSWORD } = require("../env");
const contactUsModel = require("../models/contactUsModel");
require("dotenv").config();
const contactform = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    let data = req.body; 
    // let {name,email,subject,message,phone}= data

    moment.tz.setDefault("Asia/Kolkata"); //default india time zone

    // Get the current date and time
    let date = moment().format("DD/MM/YYYY");
    let time = moment().format("HH:mm:ss");
    data.date = date;
    data.time = time;

    console.log(process.cwd()); // Check current working directory
    let config = {
      service: "gmail",
      auth: {
        user: "nar.procuren@gmail.com",
        pass: process.env.PASSWORD,
      },
    };
    let transporter = nodemailer.createTransport(config);

    let MailGenerator = new Mailgen({
      theme: "default",
      // Custom text direction
      // textDirection: 'rtl',
      color: "#48cfad",
      product: {
        logo: "https://images-saboomaruti-in.s3.ap-south-1.amazonaws.com/misc/procurenlogo.png",
        // Custom logo height
        logoHeight: "100px",
        name: "ProcureN",
        link: "https://procuren.in/",
      },
    });
    let response = { //make a response and body in table format
      body: {
        name: "ProcureN",
        intro: [`You got an enquiry from ${data.name}`],
        table: {
          data: [
            {
              Company: data.company, //assigning the values to the table
              Email: data.email,
              Contact: data.phone,
              Subject: data.subject,
            },
          ],
          columns: {
            // Optionally, customize the column widths
            customWidth: {
               company: '37%',
              Email: "20%",
              Contact: "11%",
              Subject: "33%",
            },
            // Optionally, change column text alignment
            customAlignment: {
              subject: "right",
            },
          },
        },
        action: {
          instructions: "",
          button: {
            color: "#5c67f5",    //login button redirects to login page
            text: `Login`,
            link: "https://procuren.in/login",
          },
        },
        signature: 'Best regards'
      },
    
    };
    let mail = MailGenerator.generate(response);

    let message = {
      from: EMAIL,
      to: "nar.procuren@gmail.com",
      subject: ` ProcureN - New enquiry from ${data.name}`,
      html: mail,
    };
    transporter
      .sendMail(message)
      .then(async () => {
        let saveData = await contactformModel.create(data);
        res.status(201).send({ status: true, data: saveData });
      })
      .catch((error) => {
        return res.status(500).json({ error });
      });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//=================================================================

const getcontactform = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    let filter = { isDeleted: false }; //required the docs which r not deleted
   //finding the docs with filter and sorting in deceasing order for createdAt key
    let data = await contactformModel 
      .find(filter)
      .sort({ createdAt: -1 })
    return res.status(200).send({
      status: true,
      data: data,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//============================================================
const deleteContactForm = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    const contactUsId = req.params.contactUsId;  //required contactUsId form path params
    
    // Validate the userID format (should be a valid MongoDB ObjectId)
    if (!validator.isValidObjectId(contactUsId)) {
      
      res.status(400).send({
        status: false,
        message: "Please provide valid costumer Id",
      });
    }
    let getID = await contactformModel.findById(contactUsId);
    if (!getID) {
      return res.status(404).send({
        status: false,
        message: "contactUs Id Not Found for the request id",
      });
    }
    if (getID.isDeleted == true) {
      return res.status(404).send({
        status: false,
        message: "contactUs id is already deleted not found",
      });
    }

    await contactformModel.updateOne(
      { _id: contactUsId },
      { isDeleted: true, deletedAt: Date.now() }
    );
    return res.status(200).send({
      status: true,
      message: "contactUs Id is deleted succesfully",
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//================================================================================================
const countOfContactForm = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    //"Retailer", "Manufacturer"
    let data = await contactformModel
      .find({ isDeleted: false })
      .countDocuments();
    res.status(200).send({ status: true, data: data });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//=================================================================================================
const updateContactUs = async (req,res)=>{
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    let data = req.body;
    const Id = req.params.contactUsId; //getting the client id from the path params
  

    let getContactUs = await contactUsModel.findById(Id);
    if (!getContactUs) {
      return res.status(404).send({
        status: false,
        message: "no contactUs id found",
      });
    }
   
   
    let userData = await contactUsModel.findOneAndUpdate({ _id: Id }, data, {
      new: true,
    });
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
}
//===============================================
module.exports = {
  contactform,
  getcontactform,
  deleteContactForm,
  countOfContactForm,
  updateContactUs
};
