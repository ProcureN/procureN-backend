const optModel = require("../models/OtpModel")
const costumerModel = require("../models/CostumerModel")
const validator = require("../validation/validations")
const mongoose = require("mongoose")

const otpVerification = async (req, res) => {
    try {
        res.setHeader('Access-Control-Allow-Origin', '*')
        let data = req.body
        console.log(data)
        let { email, otp } = data
        if (!email) return res.status(400).send({ status: false, message: "User Email-id is required" });
            //validating user email-id
            if (!validator.isValidEmail(email.trim())) return res.status(400).send({ status: false, message: "Please Enter a valid Email-id" });
            let costumerData = await costumerModel.findOne({Email:email})
            if(!costumerData){
                return res.status(404).send({status:false,Message:"user not found"})
            }

            if (!otp) return res.status(400).send({ status: false, message: "otp is required" });
            
        let otpData = await optModel.findOne({ Email: email })
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

module.exports = { otpVerification }
