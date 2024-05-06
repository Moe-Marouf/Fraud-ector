const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    // You can add more fields as needed, such as name, age, etc.
});

const User = mongoose.model("User", userSchema);

module.exports = User;

