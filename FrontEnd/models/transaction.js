const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  step: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  nameOrig: {
    type: String,
    required: true,
  },
  oldBalanceOrg: {
    type: Number,
    required: true,
  },
  newBalanceOrig: {
    type: Number,
    required: true,
  },
  nameDest: {
    type: String,
    required: true,
  },
  oldBalanceDest: {
    type: Number,
    required: true,
  },
  newBalanceDest: {
    type: Number,
    required: true,
  },
  isFraud: {
    type: Boolean,
    required: true,
  },
  isFlaggedFraud: {
    type: Boolean,
    required: true,
  },
});


module.exports = mongoose.model("transactions", transactionSchema);