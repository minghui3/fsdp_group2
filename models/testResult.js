const mongoose = require("mongoose");

const testResultSchema = new mongoose.Schema({
    tests: {
        type: [featureResultSchema],
        required: true,
    },
});

const featureResultSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    keyword: {
        type: String,
        required: true,
    },
    scenarios: {
        type: [scenarioResultSchema],
        required: true,
    },
    uri: {
        type: String,
        required: true,
    },
});

const scenarioResultSchema = new mongoose.Schema({
    type: {
        type: { type: String },
        required: true,
    },
    keyword: {
        type: String,
        required: true,
    },
    steps: {
        type: [stepResultSchema],
        required: true,
    },

    // not present if type of scenario is Background
    start_timestamp: Date,
    name: String,

    // optional if scenario is not Background, else not present.
    before: [stepResultSchema],
    after: [stepResultSchema],
});

const stepResultSchema = new mongoose.Schema({
    result: {
        type: { duration: Number, status: Boolean },
        required: true,
    },
    match: {
        type: stepMatchSchema,
        required: true,
    },

    // not present in before and after in scenarioResultSchema
    keyword: String,
    name: String,
});

const stepMatchSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true,
    },

    // not present if step does not require arguements
    arguments: [String], // ignore offset, keep value
});

module.exports = testResultSchema;
