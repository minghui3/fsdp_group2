const mongoose = require("mongoose");
const { getDBConnection } = require("../database/db");

const dbConnection = getDBConnection("TestBridge"); 

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    photoPath: {
        type: String,
        default: "",
    },
    dateAdded: {
        type: Date,
        default: Date.now,
    },
});

module.exports = dbConnection.model("User", userSchema);
