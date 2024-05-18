const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');

router.post("/sendComment", async (req, res) => {
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

module.exports = router;
