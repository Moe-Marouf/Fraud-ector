const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const session = require("express-session");
const crypto = require('crypto'); // Add this line for generating secret key

const User = require("./models/user");
const Transaction = require("./models/transaction");
const Comment = require("./models/comment");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Generate a random string of 32 characters for secret key
const secretKey = crypto.randomBytes(32).toString('hex');

// Add session middleware
app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false
}));

app.set("view engine", "ejs");


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

// Initialize multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Home route
app.get("/home/v1/", async (req, res) => {
  // Check if user is authenticated
  if (!req.session.user) {
      // Redirect to login page if not authenticated
      return res.redirect("/login/v1/");
  }
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
// Login route
app.get("/login/v1/", (req, res) => {
  res.render("login");
});

// Rules route
app.get("/rules/v1/", (req, res) => {
  // Check if user is authenticated
  if (!req.session.user) {
      // Redirect to login page if not authenticated
      return res.redirect("/login/v1/");
  }
  // Render the rules page
  res.render("rules");
});

// Add route
app.get("/add/v1/", (req, res) => {
  // Check if user is authenticated
  if (!req.session.user) {
      // Redirect to login page if not authenticated
      return res.redirect("/login/v1/");
  }
  // Render the add page
  res.render("add");
});

// Transaction route
app.get("/transaction/v1/", (req, res) => {
  // Check if user is authenticated
  if (!req.session.user) {
      // Redirect to login page if not authenticated
      return res.redirect("/login/v1/");
  }
  // Render the transaction page
  res.render("transaction");
});

// Transaction history route
app.get("/transactionhistory/v1/", (req, res) => {
  // Check if user is authenticated
  if (!req.session.user) {
      // Redirect to login page if not authenticated
      return res.redirect("/login/v1/");
  }
  // Render the transaction history page
  res.render("transactionhistory");
});

// Charts route
app.get("/charts/v1/", (req, res) => {
  // Check if user is authenticated
  if (!req.session.user) {
      // Redirect to login page if not authenticated
      return res.redirect("/login/v1/");
  }
  // Render the chart page
  res.render("chart");
});

// Notifications route
app.get("/notifications/v1/", async (req, res) => {
    // Check if user is authenticated
    if (!req.session.user) {
        // Redirect to login page if not authenticated
        return res.redirect("/login/v1/");
    }
    try {
        // Retrieve data from MongoDB
        const data = await Transaction.find();

        // Render the notifications page
        res.render("notifications", { data });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Handle 404 errors
app.use((req, res) => {
  res.status(404).send("<h1>404 Error</h1>");
});

//send to database
// Upload CSV route
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

// Send comment route
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


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


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
