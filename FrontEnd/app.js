const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const User = require("./models/user");
const Transaction = require("./models/transaction");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => {
  res.redirect("/login/v1/");
});

app.get("/home/v1/", (req, res) => {
  res.render("dashboard");
});

app.get("/login/v1/", (req, res) => {
  res.render("login");
});

app.get("/rules/v1/", (req, res) => {
  res.render("rules");
});

app.get("/transactionhistory/v1/", (req, res) => {
  res.render("transactionhistory");
});

app.get("/transactionhistory2/v1/", (req, res) => {
  const selectedDate = req.query.date;

  res.render('transactionhistory2', { selectedDate });
});

app.get("/charts/v1/", (req, res) => {
  res.render("chart");
});

app.use((req, res) => {
  res.status(404).send("<h1>404 Error</h1>");
});

// Connecting Mongoose
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error);
  });

// Port
app.listen(process.env.PORT, () => {
  console.log(`Listening on Port ${process.env.PORT}`);
});