const contactformModel = require("../models/contactUsModel")
const validator = require("../validation/validations")
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const moment = require('moment');
require('moment-timezone');

const { EMAIL, PASSWORD } = require('../env');
const contactform =async (req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    try {
    let data = req.body
   // let {name,email,subject,message,phone}= data
  
   moment.tz.setDefault('Asia/Kolkata');
  
   // Get the current date and time
   let date = moment().format('DD-MM-YYYY');
   let time = moment().format('HH:mm:ss');
data.date = date;
data.time = time;

let saveData = await contactformModel.create(data)

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
    // Custom text direction
   // textDirection: 'rtl',
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
        name: "ProcureN",
        intro: [`You got a Bussiness Proposal from ${data.name}`, ],
        table: {
            data: [ 
                { //name,email,subject,message,phone
                    Email:data.email,
                    Phone: data.phone,
                    Message:data.message

                },
               
            ],
            columns: {
                // Optionally, customize the column widths
                customWidth: {
                    // Name: '15%',
                     Email: '20%',
                    Phone:'10%' ,
                    
                    message: '70%',
                   
                },
                // Optionally, change column text alignment
                customAlignment: {
                    subject: 'right'
                }
            }
        },
        action: {
            instructions: "",
            button: {
              color: '#5c67f5', // Optional action button color
              text: `Home`,
              link: 'https://procuren.in/'
  
            }
          }
    }

  };
  let mail = MailGenerator.generate(response);

  let message = {
    from: EMAIL,
    to:  "veronicamiryala001@gmail.com",
    subject: `Bussiness proposal for ProcureN from ${data.name}`,
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
    let messages = {
        from: EMAIL,
        to: `${data.email}`,
        subject: `Bussiness proposal for ProcureN from ${data.name}`,
        html: mail,
      };
      transporter
        .sendMail(messages)
        .then(() => {
          // return res.status(201).json({
          //     message: "you should receive an email"
          // })
        })
        .catch((error) => {
          return res.status(500).json({ error });
        });
res.status(201).send({ status: true, data: saveData })
} catch (error) {
    return res.status(500).send({ status: false, message: error.message });
}
}
//=================================================================


const getcontactform = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    try {
        let filter = { isDeleted: false };
        const resultsPerPage =  req.params.limit ===':limit' ?10 : req.params.limit;
        let page = req.params.page >= 1 ? req.params.page : 1;
        //const query = req.query.search;
    
        page = page - 1
        let CountOfData = await contactformModel.find(filter).countDocuments();
    if (CountOfData.length===0) {
      return res
        .status(400)
        .send({ status: false, message: 'No data found.' });
    }
        let data = await contactformModel.find(filter).sort({ createdAt: -1}).limit(resultsPerPage)
        .skip(resultsPerPage * page);
        return res.status(200).send({ status: true, data: data, count:CountOfData});
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}
//============================================================
const deleteContactForm = async (req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    try {
        const contactUsId = req.params.contactUsId
        //let error =[]
        if (!validator.isValidObjectId(contactUsId)) {
            res.status(400).send({ status: false, message: "Please provide valid costumer Id" })
        }
        let getID = await contactformModel.findById(contactUsId)
        if (!getID) { return res.status(404).send({ status: false, message: "contactUs Id Not Found for the request id" }) }
        if (getID.isDeleted == true) { return res.status(404).send({ status: false, message: "contactUs id is already deleted not found" }) }

        await contactformModel.updateOne({ _id: contactUsId }, { isDeleted: true, deletedAt: Date.now() })
        return res.status(200).send({ status: true, message: "contactUs Id is deleted succesfully" })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}
//================================================================================================
const countOfContactForm = async (req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
   try {//"Retailer", "Manufacturer"
       let data = await contactformModel.find({isDeleted: false}).countDocuments()
  res.status(200).send({ status: true, data:data })
   } catch (error) {
       return res.status(500).send({ status: false, message: error.message })
   }
  }

module.exports = {contactform,getcontactform,deleteContactForm,countOfContactForm}