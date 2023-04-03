const contactformModel = require("../models/contactUsModel")
const validator = require("../validation/validations")
const contactform =async (req,res)=>{
    try {
    let data = req.body
    let {name,email,subject,message,phone}= data
    
    if (validator.isValidBody(data)) return res.status(400).send({ status: false, message: "Enter details to create your account" });
 
    if (!name) return res.status(400).send({ status: false, message: "name is required" });
    if (validator.isValid(name)) return res.status(400).send({ status: false, message: "name should not be an empty string" });

    if (!email) return res.status(400).send({ status: false, message: "email is required" });
    if (!validator.isValidEmail(email.trim())) return res.status(400).send({ status: false, message: "Please Enter a valid Email-id" });
if(subject){
    if (validator.isValid(subject)) return res.status(400).send({ status: false, message: "subject should not be an empty string" });
}
if(message){
    if (validator.isValid(message)) return res.status(400).send({ status: false, message: "message should not be an empty string" });
}
if(phone){
    if (!validator.isValidPhone(phone.trim())) return res.status(400).send({ status: false, message: "Please Enter a valid Phone number" });
}
let saveData = await contactformModel.create(data)
res.status(201).send({ status: true, data: saveData })
} catch (error) {
    return res.send({ status: false, message: error.message })
}
}
//=================================================================


const getcontactform = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    try {
        let data = await contactformModel.find({isDeleted: false})
        res.status(200).send({ status: true, data: data })
    } catch (error) {
        return res.send({ status: false, message: error.message })
    }
}

module.exports = {contactform,getcontactform}