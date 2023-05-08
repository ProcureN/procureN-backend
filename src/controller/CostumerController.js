const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const moment = require('moment');
require('moment-timezone');


const costumerModel = require('../models/CostumerModel');
const validator = require('../validation/validations');
const { EMAIL, PASSWORD } = require('../env');
const optModel = require('../models/OtpModel');

const register = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    let data = req.body;
    const {name,email,password, } = data;
    data.password = await bcrypt.hash(password, 10);
    let digits = '0123456789';
    let limit = 6;
    let otp = '';
    for (i = 0; i < limit; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
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
        name: `${name}`,
        intro:  [`Thank you for choosing ProcureN! Your One-Time Password (OTP) has been generated. Your OTP is ${otp}`],
       //outro: 'thank you',
       action: {
        instructions: "",
        button: {
            color: '#5c67f5', // Optional action button color
            text: `verify`,
            link: 'https://procuren.in/otp/signup'

        }
    }
      },
    };
    let mail = MailGenerator.generate(response);

    let message = {
      from: EMAIL,
      to: email,
      subject: `${otp} is the OTP to sign in to your ProcureN account `,
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
    let date = moment().format('DD-MM-YYYY');
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
    const {
      name,
      email,
      password,
      selectRole,
      company,
      jobTitle,
      phone,
      state,
      city,
    } = data;
    // if (Name) {
    //   if (!Name)
    //     return res
    //       .status(400)
    //       .send({ status: false, message: 'name is required' });
    //   if (validator.isValid(Name))
    //     return res.status(400).send({
    //       status: false,
    //       message: 'name should not be an empty string',
    //     });
    // }
    if (email) {
      // if (!email)
      //   return res
      //     .status(400)
      //     .send({ status: false, message: 'User Email-id is required' });
      // //validating user email-id
      // if (!validator.isValidEmail(email.trim()))
      //   return res
      //     .status(400)
      //     .send({ status: false, message: 'Please Enter a valid Email-id' });
      //checking if email already exist or not
      let duplicateEmail = await costumerModel.findOne({ email: email });
      if (duplicateEmail)
        return res
          .status(400)
          .send({ status: false, message: 'Email already exist' });
    }
    if (password) {
    data.password = await bcrypt.hash(password, 10);
     }
    // if (Company) {
    //   if (!Company)
    //     return res
    //       .status(400)
    //       .send({ status: false, message: 'Company is required' });
    //   if (validator.isValid(Company))
    //     return res.status(400).send({
    //       status: false,
    //       message: 'Company should not be an empty string',
    //     });
    // }
    // if (JobTitle) {
    //   if (!JobTitle)
    //     return res
    //       .status(400)
    //       .send({ status: false, message: 'JobTitle is required' });
    //   if (validator.isValid(JobTitle))
    //     return res.status(400).send({
    //       status: false,
    //       message: 'JobTitle should not be an empty string',
    //     });
    // }
    if (phone) {
      // if (!phone)
      //   return res
      //     .status(400)
      //     .send({ status: false, message: 'User Phone number is required' });
      // //validating user phone
      // if (!validator.isValidPhone(phone.trim()))
      //   return res.status(400).send({
      //     status: false,
      //     message: 'Please Enter a valid Phone number',
      //   });
      // checking if phone already exist or not
      let duplicatePhone = await costumerModel.findOne({ phone: phone });
      if (duplicatePhone)
        return res
          .status(400)
          .send({ status: false, message: 'Phone already exist' });
    }
    // if (State) {
    //   if (!State)
    //     return res
    //       .status(400)
    //       .send({ status: false, message: 'State is required' });
    //   if (validator.isValid(State))
    //     return res.status(400).send({
    //       status: false,
    //       message: 'State should not be an empty string',
    //     });
    // }
    // if (city) {
    //   if (!city)
    //     return res
    //       .status(400)
    //       .send({ status: false, message: 'city is required' });
    //   if (validator.isValid(city))
    //     return res.status(400).send({
    //       status: false,
    //       message: 'city should not be an empty string',
    //     });
    // }
    // if (SelectRole) {
    //   let Role = ['Retailer', 'Manufacturer'];
    //   if (!Role.includes(SelectRole))
    //     return res.status(400).send({
    //       status: false,
    //       message: `role must be slected among ${Role}`,
    //     });
    // }
    let userData = await costumerModel.findOneAndUpdate(
      { _id: customerID },
      data,
      { new: true }
    ).sort({createdAt:-1});
    if (!userData) {
      return res
        .status(404)
        .send({ status: false, message: 'no user found to update' });
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
    Data = req.body;
    // if (validator.isValidBody(Data))
    //   return res.status(400).send({
    //     status: false,
    //     message: 'Enter details to create your account',
    //   });
    const { email, password } = Data;
    // if (!email) 
    //   return res
    //     .status(400) 
    //     .send({ status: false, message: 'User Email-id is required' });

    // if (!validator.isValidEmail(email.trim()))
    //   return res
    //     .status(400)
    //     .send({ status: false, message: 'Please Enter a valid Email-id' });

    const isEmailExists = await costumerModel.findOne({ email: email });
    if (!isEmailExists)
      return res
        .status(401)
        .send({ status: false, message: 'User not found.' });


        const isPasswordMatch =   await bcrypt.compare(
          password,
          isEmailExists.password
        );
        if (!isPasswordMatch)
          return res
            .status(401)
            .send({ status: false, message: 'Email or Password is Incorrect' });
    
    if (isEmailExists.verified === false) {
      return res
        .status(400)
        .send({ status: false, message: 'you are not verified' });
    }
    //  Password Validation
    // if (validator.isValid(password))
    //   return res.status(400).send({
    //     status: false,
    //     message: 'Password should not be an empty string',
    //   });

    // > Create Jwt Token
    const token = jwt.sign(
      { customerID: isEmailExists._id.toString() },
      'procure-n secret key',
      { expiresIn: '24h' }
    );

    //  Make Respoense
    let result = {
      customerID: isEmailExists._id.toString(),
      selectRole: isEmailExists.selectRole.toString(),
      token: token,
    };
   // console.log('Login done');
    res
      .status(200)
      .send({ status: true, message: 'Login Successful', data: result });
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
      res
        .status(400)
        .send({ status: false, message: 'Please provide valid costumer Id' });
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
    return res
      .status(200)
      .send({ status: true, message: 'costumer Id is deleted succesfully' });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//==============================get details======================================

const getDetails = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    let data = req.query;
    let { selectRole } = data;

    let Role = ['Retailer', 'Manufacturer'];
    if (!Role.includes(selectRole))
      return res
        .status(400)
        .send({ status: false, message: `role must be slected among ${Role}` });
    if (Object.keys(data).length == 0)
      return res
        .status(400)
        .send({ status: false, message: 'Enter the key and value to filter' });

    const resultsPerPage =
      req.params.limit === ':limit' ? 10 : req.params.limit;
    let page = req.params.page >= 1 ? req.params.page : 1;
    //const query = req.query.search;
    page = page - 1;
    let CountOfData = await costumerModel
      .find({ selectRole: selectRole, isDeleted: false }).countDocuments();
    let getdata = await costumerModel.find({ selectRole: selectRole, isDeleted: false })
      .sort({ selectRole: 1, createdAt: -1 })
      .limit(resultsPerPage)
      .skip(resultsPerPage * page);
    res.status(200).send({ status: true, data: getdata, count: CountOfData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//========================================================================
const getAllDetails = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const resultsPerPage =
      req.params.limit === ':limit' ? 10 : req.params.limit;
    let page = req.params.page >= 1 ? req.params.page : 1;
    //const query = req.query.search;

    page = page - 1;
    let CountOfData = await costumerModel
      .find({
        isDeleted: false,
        selectRole: {
          $ne: 'admin',
        },
      })
      .countDocuments();
    let data = await costumerModel
      .find({
        isDeleted: false,
        selectRole: {
          $ne: 'admin',
        },
      })
      .sort({ selectRole: -1, createdAt: -1 })
      .limit(resultsPerPage)
      .skip(resultsPerPage * page);

    res.status(200).send({ status: true, data: data, count: CountOfData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//====================================================================================

const Individualprofiles = async (req, res) => {
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

    let getData = await costumerModel.findOne({
      _id: customerID,
      isDeleted: false,
    });
    if (!getData) {
      return res
        .status(400)
        .send({ status: false, message: 'not enquiries found' });
    }
    return res.status(200).send({ status: true, data: getData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//============================================================================================
const countOfManufacturer = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    //"Retailer", "Manufacturer"
    let data = await costumerModel
      .find({ selectRole: 'Manufacturer', isDeleted: false })
      .countDocuments();
    res.status(200).send({ status: true, data: data });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//============================================================================================
const countOfRetailer = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    //"Retailer", "Manufacturer"
    let data = await costumerModel
      .find({ selectRole: 'Retailer', isDeleted: false })
      .countDocuments();
    res.status(200).send({ status: true, data: data });
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
    return res
      .status(200)
      .send({ status: true, message: 'success', data: userData });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};
//====================================== UniqueEmail =========================================

const UniqueEmail = async (req,res)=>{
  res.setHeader('Access-Control-Allow-Origin', '*')
  try {
    let email = req.body.email
    let checkdata = await costumerModel.find({email:email})
    if(!checkdata || checkdata.length ===0){
       return res.status(200).send({status:true,message:"email is unique"})
    }else
    return res.status(400).send({status:false,message:"email already existing"})
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
 
}
//==================================================================================================

const uniquePhone = async (req,res)=>{
  res.setHeader('Access-Control-Allow-Origin', '*')
  try {
    let phone = req.body.phone
    let checkdata = await costumerModel.find({phone:phone})
    if(!checkdata || checkdata.length ===0){
       return res.status(200).send({status:true,message:"phone is unique"})
    }else
    return res.status(400).send({status:false,message:"phone already existing"})
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }

}
//====================================================================================================
module.exports = {
  register,
  updateCostumer,
  login,
  deleteCostumers,
  getDetails,
  getAllDetails,
  Individualprofiles,
  countOfManufacturer,
  countOfRetailer,
  updatePassword,
  UniqueEmail,
  uniquePhone
};
