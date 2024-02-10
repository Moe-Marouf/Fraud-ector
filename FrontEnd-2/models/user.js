const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  ID: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});


module.exports = mongoose.model("users", userSchema);