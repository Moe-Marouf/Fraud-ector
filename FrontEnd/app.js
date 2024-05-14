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
const generatePDF = require('./public/js/reportgeneration'); // Import the function

const app = express();
const upload = multer({ dest: 'uploads/' });


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

// Middleware function to set cache control headers
const setCacheControl = (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
};

// Apply the setCacheControl middleware to all routes
app.use(setCacheControl);


app.get("/", (req, res) => {
  res.redirect("/login/v1/");
});

app.get("/login/v1/", (req, res) => {
  res.render("login");
});

app.get("/home/v1/", async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  res.render('dashboard');
});

app.get("/Register/v1/", (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  res.render("Register");
});

app.get("/settings/v1/", (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  res.render("settings");
});

app.get("/rules/v1/", (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  res.render("rules");
});

app.get("/add/v1/", (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  res.render("add");
});

app.get("/transactionhistory/v1/", (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  res.render("transactionhistory");
});

app.get("/transaction/v1/", (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  res.render("transaction");
});

app.get("/charts/v1/", (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  res.render("chart");
});

app.get("/Help/v1/", (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  res.render("Help");
});

app.get("/notifications/v1/", async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  res.render('notifications');
});


app.post("/generate-pdf", (req, res) => {
  const data = req.body; // Assuming the data is sent in the request body

  generatePDF(data, (err, result) => {
    if (err) {
      console.error('Error generating PDF:', err);
      return res.status(500).send('Failed to generate PDF');
    }
    res.send(result);
  });
});

// Handle 404 errors
app.use((req, res) => {
  res.render("404");
});


//Send comment route
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

app.post("/generate-pdf", (req, res) => {
  // Retrieve table data from request body
  const tableData = req.body.tableData;

  // Create PDF document
  const doc = new pdfkit();
  doc.pipe(res);

  // Add table data to PDF
  tableData.forEach(row => {
    row.forEach(cell => {
      doc.cell(100, 20, cell, { border: true });
    });
    doc.moveDown();
  });

  // Finalize PDF
  doc.end();
});

app.post('/searchTransactions', async (req, res) => {
  try {
    // Retrieve search criteria from request body
    const { type, amount, nameOrig, isFraud } = req.body;

    // Build the query based on search criteria
    let query = {};
    if (type) query.type = type;
    if (amount) query.amount = amount;
    if (nameOrig) query.nameOrig = nameOrig;
    if (isFraud) query.isFraud = isFraud;

    // Retrieve data from MongoDB based on the query
    const filteredTransactions = await Transaction.find(query);

    // Send the filtered data as a response
    res.json(filteredTransactions);
  } catch (error) {
    console.error('Error filtering transactions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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
makePrediction([[200, 300]]);
