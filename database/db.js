const mongoose = require("mongoose");
const dbConfig = require("../config/mongodb.config");

const connections = {};

const getDBConnection = (dbName) => {
    if (!connections[dbName]) {
        try {
            connections[dbName] = mongoose.createConnection(dbConfig.uri, {
                dbName: dbName,
            });
        } catch (err) {
            console.error(err);
        }
    }
    return connections[dbName];
};

const closeDBConnections = async () => {
    console.log("[db.js] Closing db connections...");
    await Promise.all(Object.values(connections).map((conn) => conn.close()));
};

module.exports = { getDBConnection, closeDBConnections };
