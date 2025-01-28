const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({

    // override default _id with uuid injected 
    _id: {
        type: String,
        required: true,
    },

    // name of test case, NOT the same as filename
    name: {
        type: String,
        required: true,
    },

    // name of file to find test case
    file: {
        type: String,
        required: true,
    },

    // for querying purposes
    tags: {
        type: [String],
        default: [],
    },

    // date of last update to test case, NOT the file
    lastUpdated: {
        type: Date,
        default: Date.now,
    },

    // most recent date the test case was executed
    lastExecuted: {
        type: Date,
    },
});

module.exports = testCaseSchema;




