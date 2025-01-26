const mongoose = require("mongoose");
const { getDBConnection } = require("../database/db");

const connection = getDBConnection("TestBridge");

const repoSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },

    url: {
        type: String,
        required: true,
    },
});

module.exports = connection.model("Repo", repoSchema);
