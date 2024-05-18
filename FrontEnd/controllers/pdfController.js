const express = require('express');
const router = express.Router();
const generatePDF = require('../public/js/reportgeneration');

router.post("/generate-pdf", (req, res) => {
  const tableData = req.body.tableData;
  generatePDF(tableData, (err, pdfUrl) => {
    if (err) {
      res.status(500).json({ error: 'Failed to generate PDF' });
    } else {
      res.redirect(pdfUrl);
    }
  });
});

module.exports = router;
