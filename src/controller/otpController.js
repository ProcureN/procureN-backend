const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');

const optModel = require('../models/OtpModel');
const costumerModel = require('../models/CostumerModel');
const validator = require('../validation/validations');
const { EMAIL, PASSWORD } = require('../env');

const otpVerification = async (req, res) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    let data = req.body;
    let { email, otp } = data;
    if (!email)
      return res
        .status(400)
        .send({ status: false, message: 'User Email-id is required' });
    //validating user email-id
    if (!validator.isValidEmail(email.trim()))
      return res
        .status(400)
        .send({ status: false, message: 'Please Enter a valid Email-id' });
    let costumerData = await costumerModel.findOne({ email: email });
    if (!costumerData) {
      return res.status(404).send({ status: false, Message: 'user not found' });
    }

    if (!otp)
      return res
        .status(400)
        .send({ status: false, message: 'otp is required' });

    let otpData = await optModel.findOne({ email: email });
    if (!otpData) {
      return res.status(400).send('incorrect Email');
    }
    let otpverify = otpData.toObject();
    costumerData.toObject();
    console.log(otpverify.otp, costumerData.selectRole);
    if (otp == otpverify.otp) {
      let customerVerification = await costumerModel.findOneAndUpdate(
        { email: email },
        { $set: { verified: true } }
      );

      return res
        .status(200)
        .send({
          status: true,
          message: 'login successful',
          selectRole: costumerData.selectRole.toString(),
          verifiedOtp: customerVerification.verified,
          email:email
        });
    } else {
      return res.status(400).send({ status: false, message: 'incorrect otp' });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const resendOtp = async (req, res) => {
  try {
    let data = req.body;
    let { email } = data;
    let digits = '1234567890';
    let limit = 6;
    let otp = '';
    for (i = 1; i < limit; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    let updateotp = await optModel.findOneAndUpdate(
      { email: email },
      { $set: { otp: otp } }
    );
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
        name: 'procure-n',
        link: 'https://mailgen.js/',
      },
    });
    let response = {
      body: {
        name: `Dear `,
        intro: `resended OTP:${otp}`,
        outro: 'thnk you',
      },
    };
    let mail = MailGenerator.generate(response);

    let message = {
      from: EMAIL,
      to: email,
      subject: 'OTP verification',
      html: mail,
    };
    transporter.sendMail(message);
    // .then(() => {
    //     return res.status(201).json({
    //         message: "resended the OTP"
    //     })
    // }).catch(error => {
    //     return res.status(500).json({ error })
    // })

    return res.status(201).json({
      message: `OTP send successfully`,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const forgetPassword = async (req, res) => {
  try {
    let data = req.body
    let { email,password} =data
    if (!password)
    return res
      .status(400)
      .send({ status: false, message: 'Password is required' });
  //validating user password
  if (!validator.isValidPassword(password))
    return res.status(400).send({
      status: false,
      message:
        'Password should be between 8 and 15 character and it should be alpha numeric',
    });
  if (validator.isValid(password))
    return res.status(400).send({
      status: false,
      message: 'Password should not be an empty string',
    });
    data.password = await bcrypt.hash(password, 10);
    let getCustomerData = await costumerModel.findOneAndUpdate({email:email},data,{new:true})
    res.status(200).send({status:true, data:getCustomerData})
   
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { otpVerification, resendOtp,forgetPassword };
