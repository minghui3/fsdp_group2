const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        default: "quahminghui@gmail.com",
    },
    password: {
        type: String,
        default: "password",
    },
    name: {
        type: String,
        default: "name",
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

module.exports = mongoose.model("User", userSchema);
