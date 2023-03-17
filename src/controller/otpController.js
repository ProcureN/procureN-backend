const optModel = require("../models/OtpModel")
const validator = require("../validation/validations")
const mongoose = require("mongoose")

const otpVerification = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    let data = req.body
    let { Email, otp } = data
    if (!Email) return res.status(400).send({ status: false, message: "User Email-id is required" });
        //validating user email-id
        if (!validator.isValidEmail(Email.trim())) return res.status(400).send({ status: false, message: "Please Enter a valid Email-id" });
        if (!otp) return res.status(400).send({ status: false, message: "otp is required" });
        
    let otpData = await optModel.findOne({ Email: Email })
    if (!otpData) {
        return res.send("incorrect Email")
    }
    let otpverify = otpData.toObject()
    console.log(otpverify.otp)
    if (otp == otpverify.otp) {
        return res.send("login successful")
    } else {
        return res.send("incorrect otp")
    }
}

module.exports = { otpVerification }
