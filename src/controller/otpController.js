const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const jwt = require('jsonwebtoken');

const optModel = require('../models/OtpModel');
const costumerModel = require('../models/CostumerModel');
const validator = require('../validation/validations');
const { EMAIL, PASSWORD } = require('../env');

const otpVerification = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {

    let data = req.body;
    let { email, otp } = data;
    let costumerData = await costumerModel.findOne({ email: email });
    if (!costumerData) {
      return res
      .status(404)
      .send({ status: false, Message: 'user not found' });
    }
    let otpData = await optModel.findOne({ email: email });
    if (!otpData) {
      return res
      .status(400)
      .send('incorrect Email');
    }
    let otpverify = otpData.toObject();
    costumerData.toObject();
    console.log(otpverify.otp, costumerData.selectRole);
    if (otp == otpverify.otp) {
      let customerVerification = await costumerModel.findOneAndUpdate(
        { email: email },
        { $set: { verified: true } },
        {new:true}
      );

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
          greeting: "Hi",
          name: `procureN team`,
          intro: [ `New User ${costumerData.name} has been registered on our platform. Please take the necessary steps to welcome and onboard the new user.`,
        "    ",
          `User Details:`,` Name:  ${costumerData.name}`,`Email:  ${costumerData.email}`,` Phone:  ${costumerData.phone}`,` JobTitle: ${costumerData.jobTitle}`,` Company: ${costumerData.company}`,
         "       ", 
         "     ",
          `To access further details, kindly proceed to log in to the portal.`
       ],
      //  outro: "To access further details, kindly proceed to log in to the portal.",
          action: {
            instructions: "",
            button: {
              color: "#5c67f5", // Optional action button color
              text: `check`,
              link: "https://procuren.in/login",
            },
          },
         
        },
      };
      let mail = MailGenerator.generate(response);
      let message = {
        from: EMAIL,
        to: "nar.procuren@gmail.com",
        subject: ` ProcureN - New ${costumerData.selectRole} Registered `,
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
      const token = jwt.sign(
        { customerID: costumerData._id.toString() },
        'procure-n secret key',
        { expiresIn: '24h' }
      );

      return res
        .status(200)
        .send({status: true,
          message: 'login successful',
          selectRole: costumerData.selectRole.toString(),
          verifiedOtp: customerVerification.verified,
          email: email,
          token:token,
          customerID: costumerData._id
        });
    } else {
      return res.status(400).send({ status: false, message: 'incorrect otp' });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const resendOtp = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  try {
    let data = req.body;
    let { email } = data;
    if (!email) {
      return res.status(400).json({ message: "Please provide a valid email" });
    }
    if (!validator.isValidEmail(email.trim()))
      return res
        .status(400)
        .send({ status: false, message: 'Please Enter a valid Email-id' });
    let digits = '1234567890';
    let limit = 6;
    let otp = '';
    for (i = 1; i < limit; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    let checkdata = await costumerModel.findOne({ email: email })
    if (!checkdata) {
      return res.status(400).send({ status: false, message: "email is not register" })
    }
    let name = checkdata.name
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
        name: name,
        intro: [`We have resent your OTP. Please use the following code for verification:`],
        //intro: [`resended OTP:${otp}`],
        action: {
          instructions: "",
          button: {
            color: '#5c67f5', // Optional action button color
            text: `${otp}`,
            link: 'https://procuren.in/'

          }
        }
        //outro: ,
      },
    };
    let mail = MailGenerator.generate(response);

    let message = {
      from: EMAIL,
      to: email, // Ensure that the 'email' field is set
      subject: `${otp} is the resent OTP`,
      html: mail,
    };
    transporter.sendMail(message);

    return res.status(201).json({
      message: `OTP send successfully`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

///=============================================================================================================

const forgetPassword = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  try {
    let data = req.body
    let { email, password } = data
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
    let getCustomerData = await costumerModel.findOneAndUpdate({ email: email }, data, { new: true })
    res.status(200).send({ status: true, data: getCustomerData })

  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { otpVerification, resendOtp, forgetPassword };
