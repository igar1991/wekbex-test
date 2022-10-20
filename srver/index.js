const express = require("express");
const { MongoClient } = require('mongodb');
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT;
const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;
const app = express();

app.use(cors());
app.use(express.json());

const client = new MongoClient(MONGO_CONNECTION_STRING);

app.listen(PORT, () => console.log(`App is running on port: ${PORT}`));

app.get("/city", async(req,res)=>{
    try {
        await client.connect();
        const cursor = await client.db("welbex").collection("city").find();
        const results = await cursor.toArray();
        return res.status(201).json(results)
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
});
