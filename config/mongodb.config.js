require("dotenv").config();

const config = {
    uri: process.env.MONGOURI,
};

module.exports = config;