const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const moment = require('moment');
require('moment-timezone');


const costumerModel = require('../models/UserModel');
const validator = require('../validation/validations');
const { EMAIL, PASSWORD } = require('../env');
const optModel = require('../models/OtpModel');

const register = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    let data = req.body;
    const {name,email,password, } = data;
    data.password = await bcrypt.hash(password, 10);          
    let digits = '1234567890';                           
    let limit = 6;
    let otp = '';   //genarating random number for otp
    for (i = 1; i < limit; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    let config = {
      service: 'gmail',
      auth: {
        user: "nar.procuren@gmail.com",
        pass: process.env.PASSWORD
        ,
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
        greeting: 'Dear',
        name: `${name}`,
        intro:  [`Thank you for choosing ProcureN! Your One-Time Password (OTP) has been generated.`,
        `Your OTP is ${otp}`],
       //outro: 'thank you',
       action: {
        instructions: "",
        button: {
            color: '#5c67f5', // Optional action button color
            text: `verify`,
            link: 'https://procuren.in/'

        }
    },
    signature: 'Best regards'
      },
    };
    let mail = MailGenerator.generate(response);

    let message = {
      from: EMAIL,
      to: email,
      subject: `ProcureN - OTP is ${otp} `,
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
    
    moment.tz.setDefault('Asia/Kolkata');
  
    // Get the current date and time
    let date = moment().format('DD/MM/YYYY');
    let time = moment().format('HH:mm:ss');
    data.date = date;
    data.time = time;
    let saveData = await costumerModel.create(data);

    let otpData = await optModel.create({ otp, email: email });
    res.status(201).send({ status: true, data: saveData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//==================================update=========================================

const updateCostumer = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    let data = req.body;
    let customerID = req.params.customerID;
    const {name,email, password,selectRole,company,jobTitle,phone,state,city,} = data;

    if (email) {
      let duplicateEmail = await costumerModel.findOne({ email: email });
      if (duplicateEmail)
        return res.status(400).send({
           status: false,
            message: 'Email already exist' 
          });
    }
    if (password) {
    data.password = await bcrypt.hash(password, 10);   //saving  the password in bcrypt form
     }
   
    if (phone) {
      let duplicatePhone = await costumerModel.findOne({ phone: phone });
      if (duplicatePhone)
        return res.status(400).send({
           status: false,
            message: 'Phone already exist' 
          });
    }
    let userData = await costumerModel.findOneAndUpdate(
      { _id: customerID },
      data,
      { new: true }
    ).sort({createdAt:-1});

    if (!userData) {
      return res.status(404).send({ 
        status: false, 
        message: 'no user found to update' 
      });
    }
    return res
      .status(200)
      .send({ status: true, message: 'success', data: userData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//==================================login=================================================

const login = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    Data = req.body
    const { email, password } = Data;
    
    const isEmailExists = await costumerModel.findOne({ email: email });
    if (!isEmailExists)
      return res.status(401).send({ 
        status: false,
         message: 'User not found.' 
        });
        const isPasswordMatch =   await bcrypt.compare(
          password,
          isEmailExists.password
        );
        if (!isPasswordMatch)
          return res.status(401).send({
             status: false,
              message: 'Email or Password is Incorrect'
             });
    
    if (isEmailExists.verified === false) {
      return res.status(400).send({ status: false, message: 'you are not verified' });
    }
    // > Create Jwt Token
    const token = jwt.sign(
      { userID: isEmailExists._id.toString() },
      'procure-n secret key',
      { expiresIn: '24h' }
    );

    //  Make Respoense
    let result = {
      userID: isEmailExists._id.toString(),
      selectRole: isEmailExists.selectRole.toString(),
      token: token,
    };
   // console.log('Login done');
    res.status(200).send({ status: true,
       message: 'Login Successful', 
       data: result 
      });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//=======================delete costumers===========================================

const deleteCostumers = async (req, res) => {
  try {
    const deleteCostumerID = req.params.customerID;
    //let error =[]
    if (!validator.isValidObjectId(deleteCostumerID)) {
      res.status(400).send({ 
        status: false, 
        message: 'Please provide valid costumer Id' 
      });
    }
    let getID = await costumerModel.findById(deleteCostumerID);   
    if (!getID) {
      return res.status(404).send({
        status: false,
        message: 'costumer Id Not Found for the request id',
      });
    }
    if (getID.isDeleted == true) {
      return res.status(404).send({
        status: false,
        message: 'costume id is already deleted not found',
      });
    }

    await costumerModel.updateOne(
      { _id: deleteCostumerID },
      { isDeleted: true, deletedAt: Date.now() }
    );
    return res.status(200).send({
       status: true,
        message: 'costumer Id is deleted succesfully' 
      });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//===========================================================================================================
const updatePassword = async (req, res) => {
  try {
    const data = req.body;
    const { email, password } = data;
    data.password = await bcrypt.hash(password, 10);
    let userData = await costumerModel.findOneAndUpdate(
      { email: email },
      { password: data.password },
      { new: true }
    );
    return res.status(200).send({ 
      status: true, 
      message: 'success',
       data: userData
       });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

//====================================================================================================
module.exports = {
  register,
  updateCostumer,
  login,
  deleteCostumers,
  updatePassword,
  
};
