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
var currentdate = new Date();
var datetime = currentdate.getDay() + "-" + currentdate.getMonth()
    + "-" + currentdate.getFullYear()
    //adding time
let time = + currentdate.getHours() + ":"
    + currentdate.getMinutes() + ":" + currentdate.getSeconds();
data.date = datetime
data.time = time
let saveData = await contactformModel.create(data)
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
        let data = await contactformModel.find(filter).limit(resultsPerPage)
        .skip(resultsPerPage * page);
        return res.status(200).send({ status: true, data: data, count:CountOfData});
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}
//============================================================
const deleteContactForm = async (req,res)=>{
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