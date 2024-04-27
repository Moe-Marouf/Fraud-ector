const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

const User = require("./models/user");
const Transaction = require("./models/transaction");
const Comment = require("./models/comment");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");

const upload = multer({ dest: "uploads/" });

// Routes
app.get("/", (req, res) => {
  res.redirect("/login/v1/");
});

app.get("/home/v1/", async (req, res) => {
  try {
    // Retrieve data from MongoDB
    const data = await Transaction.find();

    // Render the dashboard EJS template with the data
    res.render("dashboard", { data });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get("/login/v1/", (req, res) => {
  res.render("login");
});

app.get("/rules/v1/", (req, res) => {
  res.render("rules");
});

app.get("/add/v1/", (req, res) => {
  res.render("add");
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Initialize MongoDB connection pool
const db = mongoose.connection;

// Event handlers for MongoDB connection
db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.post("/uploadCSV", upload.single("csvfile"), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send("No file uploaded");
  }

  // Create model for transactions
  const Transaction = mongoose.model("Transaction", new mongoose.Schema({ data: Object }));

  // Parse uploaded CSV file
  const parser = fs.createReadStream(file.path)
    .pipe(csv({ delimiter: "," }));

  let rowCount = 0;

  parser.on("data", async (row) => {
    rowCount++;
    console.log(`Processing row ${rowCount}:`, row);

    try {
      // Insert row into MongoDB collection
      await Transaction.create({ data: row });
      console.log("Inserted row into MongoDB");
    } catch (err) {
      console.error("Error inserting row into MongoDB:", err);
    }
  });

  parser.on("end", () => {
    console.log("CSV data uploaded and saved to MongoDB");
    console.log(`Total rows processed: ${rowCount}`);
    // Redirect user to success.html after successful upload
    res.redirect("/add/v1/");
  });

  parser.on("error", (err) => {
    console.error("Error parsing CSV:", err);
    res.status(500).send("Error parsing CSV");
  });
});

// Handle comment submissions
app.post("/sendComment", async (req, res) => {
  const { email, name, comment } = req.body;

  if (!email || !name || !comment) {
    return res.status(400).json({ error: "Please provide email, name, and comment" });
  }

  try {
    const newComment = new Comment({ email, name, comment });
    await newComment.save();
    console.log("Comment saved to MongoDB");
    res.status(201).json({ message: "Comment saved successfully!" });
  } catch (error) {
    console.error("Error saving comment to MongoDB:", error);
    res.status(500).json({ error: "An error occurred while saving the comment." });
  }
});

app.get("/transactionhistory/v1/", (req, res) => {
  res.render("transactionhistory");
});

app.get("/charts/v1/", (req, res) => {
  res.render("chart");
});

app.get("/Help/v1/", (req, res) => {
  res.render("Help");
});

app.get("/notifications/v1/", async (req, res) => {
  try {
    // Retrieve data from MongoDB
    const data = await Transaction.find();

    // Render the dashboard EJS template with the data
    res.render("notifications", { data });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.use((req, res) => {
  res.status(404).send("<h1>404 Error</h1>");
});

// Connecting Mongoose
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");

    // Start the server after MongoDB connection is established
    app.listen(process.env.PORT, () => {
      console.log(`Listening on Port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error);
  });

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("Connected to MongoDB");
//   })
//   .catch((error) => {
//     console.log("Error connecting to MongoDB:", error);
//   });

// Port
// app.listen(process.env.PORT, () => {
//   console.log(`Listening on Port ${process.env.PORT}`);
// });

//FLASK:

const axios = require('axios');
async function makePrediction(features) {
  try {
    const response = await axios.post('http://localhost:5000/predict', {
      features: features
    });
    console.log('Prediction:', response.data);
  } catch (error) {
    console.error('Error making prediction:', error);
  }
}
makePrediction([[-100, -100]]);
