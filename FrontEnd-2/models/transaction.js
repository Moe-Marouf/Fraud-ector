const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  trans_ID: {
    type: Number,
    required: true,
  },
  sender_ID: {
    type: Number,
    required: true,
  },
  receiver_ID: {
    type: Number,
    required: true,
  },
  trans_type: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  trans_status: {
    type: String,
    required: true,
  },
  trans_fee: {
    type: Number,
    required: true,
  },
  channel: {
    type: String,
    required: true,
  },
  is_Fraud: {
    type: Boolean,
    required: true,
  },
});


module.exports = mongoose.model("transactions", transactionSchema);