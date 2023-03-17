
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');

const costumerModel = require("../models/CostumerModel")
const validator = require("../validation/validations")
const { EMAIL, PASSWORD } = require("../env")
const optModel = require("../models/OtpModel")


const register = async (req, res) => {
    try {
        let data = req.body;
        const { Name, Email, Password, SelectRole, Company, JobTitle, phone, State, city } = data
        if (validator.isValidBody(data)) return res.status(400).send({ status: false, message: "Enter details to create your account" });
        //validating firstname
        if (!Name) return res.status(400).send({ status: false, message: "name is required" });
        if (validator.isValid(Name)) return res.status(400).send({ status: false, message: "name should not be an empty string" });


        if (!Email) return res.status(400).send({ status: false, message: "User Email-id is required" });
        //validating user email-id
        if (!validator.isValidEmail(Email.trim())) return res.status(400).send({ status: false, message: "Please Enter a valid Email-id" });
        //checking if email already exist or not 
        let duplicateEmail = await costumerModel.findOne({ Email: Email })
        if (duplicateEmail) return res.status(400).send({ status: false, message: "Email already exist" })



        if (!phone) return res.status(400).send({ status: false, message: "User Phone number is required" });
        //validating user phone
        if (!validator.isValidPhone(phone.trim())) return res.status(400).send({ status: false, message: "Please Enter a valid Phone number" });
        //checking if phone already exist or not
        let duplicatePhone = await costumerModel.findOne({ phone: phone })
        if (duplicatePhone) return res.status(400).send({ status: false, message: "Phone already exist" })


        if (!Password) return res.status(400).send({ status: false, message: "Password is required" });
        //validating user password
        if (!validator.isValidPassword(Password)) return res.status(400).send({ status: false, message: "Password should be between 8 and 15 character and it should be alpha numeric" });
        if (validator.isValid(Password)) return res.status(400).send({ status: false, message: "Password should not be an empty string" });
        data.Password = await bcrypt.hash(Password, 10);

        if (!Company) return res.status(400).send({ status: false, message: "Company is required" });
        if (validator.isValid(Company)) return res.status(400).send({ status: false, message: "Company should not be an empty string" });


        if (!JobTitle) return res.status(400).send({ status: false, message: "JobTitle is required" });
        if (validator.isValid(JobTitle)) return res.status(400).send({ status: false, message: "JobTitle should not be an empty string" });

        if (!State) return res.status(400).send({ status: false, message: "State is required" });
        if (validator.isValid(State)) return res.status(400).send({ status: false, message: "State should not be an empty string" });


        if (!city) return res.status(400).send({ status: false, message: "city is required" });
        if (validator.isValid(city)) return res.status(400).send({ status: false, message: "city should not be an empty string" });

        let Role = ["Retailer", "manufacturer"];
        if (!Role.includes(SelectRole)) return res.status(400).send({ status: false, msg: `role must be slected among ${Role}` });


        let digits = '123456789';
        let limit = 6;
        let otp = ''
        for (i = 1; i < limit; i++) {
            otp += digits[Math.floor(Math.random() * 10)];
    
        }
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
                name: `Dear ${Name}`,
                intro: `please verify your email opt:${otp}` ,
                outro: "thnk u"
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
    .then(() => {
        // return res.status(201).json({
        //     msg: "you should receive an email"
        // })
    
    }).catch(error => {
        return res.status(500).json({ error })
    })
    // transporter.sendMail(
    //     message, function (error, info) {
    //         if (error) {
    //             console.log(error);
    //             res.status(500).send("couldn't send")
    //         }
    //         else {
    //             savedOTPS[Email] = otp;
    //             setTimeout(
    //                 () => {
    //                     delete savedOTPS.email
    //                 }, 60000
    //             )
    //             res.send("sent otp")
    //         }

    //     }
    // )



        let saveData = await costumerModel.create(data)
      
      let otpData = await optModel.create({otp, Email:Email})
        res.status(201).send({ status: true, data: otpData })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    } 
}

//==================================update=========================================

const updateCostumer = async (req, res) => {
    try {

        let data = req.body
        let customerID = req.params.customerID
        const { Name, Email, Password, SelectRole, Company, JobTitle, phone, State, city } = data
        if (Name) {
            if (!Name) return res.status(400).send({ status: false, message: "name is required" });
            if (validator.isValid(Name)) return res.status(400).send({ status: false, message: "name should not be an empty string" });
        }
        if (Email) {
            if (!Email) return res.status(400).send({ status: false, message: "User Email-id is required" });
            //validating user email-id
            if (!validator.isValidEmail(Email.trim())) return res.status(400).send({ status: false, message: "Please Enter a valid Email-id" });
            //checking if email already exist or not  
            let duplicateEmail = await costumerModel.findOne({ Email: Email })
            if (duplicateEmail) return res.status(400).send({ status: false, message: "Email already exist" })
        }
        if (Password) {
            if (!Password) return res.status(400).send({ status: false, message: "Password is required" });
            //validating user password
            if (!validator.isValidPassword(Password)) return res.status(400).send({ status: false, message: "Password should be between 8 and 15 character and it should be alpha numeric" });
            if (validator.isValid(Password)) return res.status(400).send({ status: false, message: "Password should not be an empty string" });

        }
        if (Company) {
            if (!Company) return res.status(400).send({ status: false, message: "Company is required" });
            if (validator.isValid(Company)) return res.status(400).send({ status: false, message: "Company should not be an empty string" });

        }
        if (JobTitle) {
            if (!JobTitle) return res.status(400).send({ status: false, message: "JobTitle is required" });
            if (validator.isValid(JobTitle)) return res.status(400).send({ status: false, message: "JobTitle should not be an empty string" });

        }
        if (phone) {
            if (!phone) return res.status(400).send({ status: false, message: "User Phone number is required" });
            //validating user phone
            if (!validator.isValidPhone(phone.trim())) return res.status(400).send({ status: false, message: "Please Enter a valid Phone number" });
            //checking if phone already exist or not
            let duplicatePhone = await costumerModel.findOne({ phone: phone })
            if (duplicatePhone) return res.status(400).send({ status: false, message: "Phone already exist" })
        }
        if (State) {
            if (!State) return res.status(400).send({ status: false, message: "State is required" });
            if (validator.isValid(State)) return res.status(400).send({ status: false, message: "State should not be an empty string" });
        }
        if (city) {
            if (!city) return res.status(400).send({ status: false, message: "city is required" });
            if (validator.isValid(city)) return res.status(400).send({ status: false, message: "city should not be an empty string" });
        }
        if (SelectRole) {
            let Role = ["Retailer", "manufacturer"];
            if (!Role.includes(SelectRole)) return res.status(400).send({ status: false, msg: `role must be slected among ${Role}` });
        }
        let userData = await costumerModel.findOneAndUpdate({ _id: customerID }, data, { new: true })
        if (!userData) { return res.status(404).send({ satus: false, message: "no user found to update" }) }
        return res.status(200).send({ satus: true, message: "success", data: userData })

    } catch (error) {
        return res.send({ status: false, message: error.message })
    }
}

//==================================login=================================================

const login = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    try {
        Data = req.body
        if (validator.isValidBody(Data)) return res.status(400).send({ status: false, message: "Enter details to create your account" });
        const { Email, Password } = Data
        if (!Email) return res.status(400).send({ status: false, message: "User Email-id is required" });

        if (!validator.isValidEmail(Email.trim())) return res.status(400).send({ status: false, message: "Please Enter a valid Email-id" });

        const isEmailExists = await costumerModel.findOne({ Email: Email })
        if (!isEmailExists) return res.status(401).send({ status: false, message: "Email is Incorrect" })
        //  Password Validation 
        if (validator.isValid(Password)) return res.status(400).send({ status: false, message: "Password should not be an empty string" });


        const isPasswordMatch = await bcrypt.compare(Password, isEmailExists.Password)
        if (!isPasswordMatch) return res.status(401).send({ status: false, message: "Password is Incorrect" })

        // > Create Jwt Token 
        const token = jwt.sign(
            { customerID: isEmailExists._id.toString() },
            "procure-n secret key",
            { expiresIn: '24h' }
        )
        //  Make Respoense
        let result = {
            customerID: isEmailExists._id.toString(),
            token: token,
        }
        res.status(200).send({ status: true, message: "Login Successful", data: result })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}
//=======================delete costumers===========================================

const deleteCostumers = async (req, res) => {
    try {
        const deleteCostumerID = req.params.customerID
        //let error =[]
        if (!validator.isValidObjectId(deleteCostumerID)) {
            res.status(400).send({ status: false, message: "Please provide valid costumer Id" })
        }
        let getID = await costumerModel.findById(deleteCostumerID)
        if (!getID) { return res.status(404).send({ status: false, message: "costumer Id Not Found for the request id" }) }
        if (getID.isDeleted == true) { return res.status(404).send({ status: false, message: "costume id is already deleted not found" }) }

        await costumerModel.updateOne({ _id: deleteCostumerID }, { isDeleted: true, deletedAt: Date.now() })
        return res.status(200).send({ status: true, message: "costumer Id is deleted succesfully" })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    } 
}

//==============================get details======================================

const getDetails = async (req, res) => {
    try {
        let data = req.query
        let { SelectRole } = data

        let Role = ["Retailer", "manufacturer"];
        if (!Role.includes(SelectRole)) return res.status(400).send({ status: false, msg: `role must be slected among ${Role}` });
        if (Object.keys(data).length == 0)
            return res.status(400).send({ status: false, msg: "Enter the key and value to filter" })

        let getdata = await costumerModel.find({ SelectRole: SelectRole }, { isDeleted: false })
        res.status(200).send({ status: true, data: getdata })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { register, updateCostumer, login, deleteCostumers, getDetails }