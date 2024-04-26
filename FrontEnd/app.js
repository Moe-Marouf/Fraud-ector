const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// New code
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

const User = require("./models/user");
const Transaction = require("./models/transaction");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");

// New code
const upload = multer({ dest: "uploads/" });

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

app.get("/add/v1/", (req, res) => {
  res.render("add");
});

// New code
app.post("/uploadCSV", upload.single("csvfile"), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send("No file uploaded");
  }

//sendComment
app.post("/sendComment", async (req, res) => {
  const { email, name, comment } = req.body;

  if (!email || !name || !comment) {
    return res.status(400).json({ error: "Please provide email, name, and comment" });
  }

  try {
    // Create a new Comment document and save it to the database
    const newComment = new Comment({ email, name, comment });
    await newComment.save();
    console.log("Comment saved to MongoDB");
    res.status(201).json({ message: "Comment saved successfully!" });
  } catch (error) {
    console.error("Error saving comment to MongoDB:", error);
    res.status(500).json({ error: "An error occurred while saving the comment." });
  }
});



  // MongoDB connection
  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("Connected to MongoDB");

      const db = mongoose.connection;
      const collection = db.collection("transactions"); // Specify your MongoDB collection name

      // Parse uploaded CSV file
      const parser = csv({ delimiter: "," })
        .on("data", (row) => {
          // Insert row into MongoDB collection
          collection.insertOne({ data: row }, (err, result) => {
            if (err) throw err;
            console.log("Inserted row into MongoDB");
          });
        })
        .on("end", () => {
          db.close(); // Close MongoDB connection after insertion
          res.redirect("/add/v1/");
        });

      // Read and parse uploaded CSV file
      fs.createReadStream(file.path).pipe(parser);
    })
    .catch((error) => {
      console.log("Error connecting to MongoDB:", error);
      res.status(500).send("Error connecting to MongoDB");
    });
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

app.get("/Help/v1/", (req, res) => {
  res.render("Help");
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
