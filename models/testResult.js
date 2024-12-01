const mongoose = require("mongoose");

const stepMatchSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true,
    },

    // not present if step does not require arguements
    arguments: [String], // ignore offset, keep value
});

const resultSchema = new mongoose.Schema({
    status: { 
        type: Boolean,
        required: true,
    },
    duration: Number // ignore if step is in before/after instead of steps 
})

const stepResultSchema = new mongoose.Schema({
    
    result: {
        type: resultSchema, // ignore duration for each step
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

const scenarioResultSchema = new mongoose.Schema({
    type: {
        type: String,
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

const testResultSchema = new mongoose.Schema({
    tests: {
        type: [featureResultSchema],
        required: true,
    },
});

module.exports = testResultSchema;
