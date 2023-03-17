const mongoose = require("mongoose")
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');

const optModel = require("../models/OtpModel")
const costumerModel = require("../models/CostumerModel")
const validator = require("../validation/validations")
const { EMAIL, PASSWORD } = require("../env")

const otpVerification = async (req, res) => {
    try {
        res.setHeader('Access-Control-Allow-Origin', '*')
        let data = req.body
        let { Email, otp } = data
        if (!Email) return res.status(400).send({ status: false, message: "User Email-id is required" });
            //validating user email-id
            if (!validator.isValidEmail(Email.trim())) return res.status(400).send({ status: false, message: "Please Enter a valid Email-id" });
            let costumerData = await costumerModel.findOne({Email:Email})
            if(!costumerData){
                return res.status(404).send({status:false,Message:"user not found"})
            }

            if (!otp) return res.status(400).send({ status: false, message: "otp is required" });
            
        let otpData = await optModel.findOne({ Email: Email })
        if (!otpData) {
            return res.status(400).send("incorrect Email")
        }
        let otpverify = otpData.toObject()
       costumerData.toObject()
        console.log(otpverify.otp,costumerData.SelectRole)
        if (otp == otpverify.otp) {
            return res.status(200).send({status:true,message:"login successful",SelectRole:costumerData.SelectRole.toString()})
        } else {
            return res.status(400).send({status:false,message:"incorrect otp"})
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
   
}

const resendOtp = async (req,res)=>{
    try {
        let data=req.body
        let {Email}=data
    let digits = '1234567890';
        let limit = 6;
        let otp = ''
        for (i = 1; i < limit; i++) {
            otp += digits[Math.floor(Math.random() * 10)];
    
        }
        let updateotp =  await optModel.findOneAndUpdate({ Email: Email },{$set:{otp:otp}})
        let config = {
            service: 'gmail',
            auth: {
                user: EMAIL,
                pass: PASSWORD
            }
        }
        let transporter = nodemailer.createTransport(config);
       

        let MailGenerator = new Mailgen({
            theme: "default",
            product: {
                name: "procure-n",
                link: 'https://mailgen.js/'
            }
        })
        let response = {
            body: {
                name: `Dear `,
                intro: `resended OTP:${otp}` ,
                outro: "thnk you"
            }
        }
        let mail = MailGenerator.generate(response)

    let message = {
        from : EMAIL,
        to : Email,
        subject: "OTP verification",
        html: mail
    }
     transporter.sendMail(message)
    // .then(() => {
    //     return res.status(201).json({
    //         msg: "resended the OTP"
    //     })
    // }).catch(error => {
    //     return res.status(500).json({ error })
    // }) 
   
    return res.status(201).json({
                msg: `resended the OTP${otp} `
            })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
    
}
module.exports = { otpVerification,resendOtp }
