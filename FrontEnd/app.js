require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const csv = require('csv-parser');

const app = express();
const upload = multer({ dest: 'uploads/' });

const sessionSecret = process.env.SESSION_SECRET;
const mongodbUri = process.env.MONGODB_URI;

// Middleware function to set cache control headers
const setCacheControl = (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
};

// Apply the setCacheControl middleware to all routes
app.use(setCacheControl);

// Controllers
const authController = require('./controllers/authController');
const mainController = require('./controllers/mainController');
const transactionController = require('./controllers/transactionController');
const pdfController = require('./controllers/pdfController');
const commentController = require('./controllers/commentController');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true
}));

mongoose.connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));



// Route handling
app.use('/', authController);
app.use('/', mainController);
app.use('/', transactionController);
app.use('/', pdfController);
app.use('/', commentController);

// Handle 404 errors
app.use((req, res) => {
  res.render("404");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//Old FLASK method:

// const axios = require('axios');
// async function makePrediction(features) {
//   try {
//     const response = await axios.post('http://localhost:5000/predict', {
//       features: features
//     });
//     console.log('Prediction:', response.data);
//   } catch (error) {
//     console.error('Error making prediction:', error);
//   }
// }
// makePrediction([[-100, -100]]);
// makePrediction([[200, 300]]);

const axios = require('axios');

// Function to send prediction request with API key
function sendPredictionRequest(data, apiKey) {
  axios.post('http://localhost:5000/predict', data, {
    headers: {
      'X-API-KEY': apiKey
    }
  })
    .then(response => {
      console.log('Fraud Probability:', response.data.probability);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Example usage with user API key
const userApiKey = '4832f43263b3ea8a8de7a1618acaf5a0';  // a users api key is here 

sendPredictionRequest({
  type: 'PAYMENT',  // these are the valid classes for this typee: ['CASH_OUT' 'DEBIT' 'PAYMENT' 'TRANSFER']. they're case senstivie so make sure its right
  amount: 2000,
  nameOrig: 'C207471778',  //Example original name ID (it throws an error if its not the same as one of the ID's in the database. they represent people so their ID must be valid)
  nameDest: 'M1979787155'  //Example destination name ID (same here aswell, but represnts recipient id)
}, '4832f43263b3ea8a8de7a1618acaf5a0'); //this way

// Another example usage with user API key
sendPredictionRequest({
  type: 'PAYMENT',
  amount: 20000000,
  nameOrig: 'C207471778',
  nameDest: 'M1979787155'
}, userApiKey); // or This way
