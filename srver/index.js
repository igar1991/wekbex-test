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
async function getPage(req, res, options) {
    try {
        await client.connect();
        const result = {};
        const pageNumber = parseInt(req.query.page) || 0;
        const limit = parseInt(req.query.limit) || 12;
        let startIndex = pageNumber * limit;
        const endIndex = (pageNumber + 1) * limit;
        const count = await (await client.db("welbex").collection("welbex").find(options).toArray()).length;
        result.totalCities = count;
        if (startIndex > 0) {
          result.previous = {
            pageNumber: pageNumber - 1,
            limit: limit,
          };
        }
        if (endIndex < count) {
          result.next = {
            pageNumber: pageNumber + 1,
            limit: limit,
          };
        }
        result.data = await client.db("welbex").collection("welbex").find(options)
        .sort({"title": 1})
        .skip(startIndex)
        .limit(limit)
        .toArray()
        result.rowsPerPage = limit;
        return res.json({ msg: "Post Fetched successfully", data: result });
    } catch (e) {
        console.error(e);
        return res.status(500);
    } finally {
        await client.close();
    }
}

app.get("/api/city", async(req,res)=>{
    await getPage(req,res, {})
});

app.post("/api/city", async(req,res)=>{
    const options = {};
    options[req.body.column] = {[req.body.condition]: req.body.column==='title'?req.body.value:Number(req.body.value)}
    if(options['title']){
        options[req.body.column].$options = "i"
    }
    await getPage(req,res, options)
});

app.listen(PORT, () => console.log(`App is running on port: ${PORT}`));	
