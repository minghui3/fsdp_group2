const {MongoClient} = require('mongodb');
require('dotenv').config()
const uri = process.env.MONGOURI;
const dbName = process.env.MONGODB;
let db;
const connection = async () =>{
    try{
        const client = new MongoClient(uri)
        await client.connect();
        db = client.db(dbName);
        console.log("Connected to MongoDB");
    }
    catch(err){
        console.error("MongoDB connection failed.", err.message);
    }
}

const getDB = async() => {
    if (!db){
        await connection();
    }
    return db;
}

module.exports = {connection , getDB}