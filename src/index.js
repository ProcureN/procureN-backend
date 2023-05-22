const express = require("express")
const mongoose = require("mongoose")
const route = require("./route/route")
// const route = require("./route/route")

const app = express()
const multer= require("multer");

app.use( multer().any())
app.use(express.json());
var cors = require('cors');
app.use(cors());

mongoose.connect("mongodb+srv://narprocuren:procureN123@cluster0.3nsvxkt.mongodb.net/ProcureN", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))

 

app.use('/', route)

app.listen(process.env.PORT || 3001, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3001))
})