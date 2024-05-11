require('dotenv').config();

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const authController = require('./controllers/authController');

const User = require('./models/User');
const Transaction = require('./models/transaction');
const Comment = require('./models/comment');

const app = express();

const sessionSecret = process.env.SESSION_SECRET;
const mongodbUri = process.env.MONGODB_URI;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true
}));

mongoose.connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

app.use('/', authController);

app.get("/", (req, res) => {
  res.redirect("/login/v1/");
});

app.get("/login/v1/", (req, res) => {
  res.render("login");
});

app.get("/transactionhistory/v1/", (req, res) => {
  res.render("transactionhistory");
});


app.listen(process.env.PORT || 3000, () => {
  console.log('Server started on port 3000');
});