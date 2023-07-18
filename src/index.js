const express = require('express');
const mongoose = require('mongoose');
const route = require('./route/route');
const dotenv = require('dotenv'); // Import dotenv

dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);var cors = require('cors');
app.use(cors());

mongoose
  .connect(process.env.MONGODB_URL, { // Use process.env to access environment variables
    useNewUrlParser: true,
  })
  .then(() => console.log('MongoDb is connected'))
  .catch((err) => console.log(err));

app.use('/', route);
const port = process.env.PORT || 3001; // Use process.env to access environment variables

app.listen(port, function () {
  console.log('Express app running on port ' + port);
});
