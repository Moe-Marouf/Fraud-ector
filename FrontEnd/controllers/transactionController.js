const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');

const upload = multer({ dest: 'uploads/' });
const Transaction = mongoose.model("Transaction", new mongoose.Schema({ data: Object }));

router.post("/uploadCSV", upload.single("csvfile"), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send("No file uploaded");
  }

  const parser = fs.createReadStream(file.path).pipe(csv({ delimiter: "," }));

  let rowCount = 0;

  parser.on("data", async (row) => {
    rowCount++;
    console.log(`Processing row ${rowCount}:`, row);

    try {
      await Transaction.create({ data: row });
      console.log("Inserted row into MongoDB");
    } catch (err) {
      console.error("Error inserting row into MongoDB:", err);
    }
  });

  parser.on("end", () => {
    console.log("CSV data uploaded and saved to MongoDB");
    console.log(`Total rows processed: ${rowCount}`);
    res.redirect("/add/v1/");
  });

  parser.on("error", (err) => {
    console.error("Error parsing CSV:", err);
    res.status(500).send("Error parsing CSV");
  });
});

router.post('/searchTransactions', async (req, res) => {
  try {
    const { type, amount, nameOrig, isFraud } = req.body;
    let query = {};
    if (type) query.type = type;
    if (amount) query.amount = amount;
    if (nameOrig) query.nameOrig = nameOrig;
    if (isFraud) query.isFraud = isFraud;

    const filteredTransactions = await Transaction.find(query);
    res.json(filteredTransactions);
  } catch (error) {
    console.error('Error filtering transactions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
