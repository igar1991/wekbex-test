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

async function getPage(req, res, optionsFilter, optionsSort) {
    try {
        await client.connect();
        const result = {};
        const pageNumber = parseInt(req.query.page) || 0;
        const limit = parseInt(req.query.limit) || 12;
        let startIndex = pageNumber * limit;
        const endIndex = (pageNumber + 1) * limit;
        const count = await (await client.db("welbex").collection("welbex").find(optionsFilter).toArray()).length;
        result.totalCities = count;
        result.totalPages = Math.ceil(count/limit);
        if (startIndex > 0) {
          result.previous = pageNumber - 1
        }
        if (endIndex < count) {
          result.next = pageNumber + 1
        }
        result.data = await client.db("welbex").collection("welbex").find(optionsFilter)
        .sort(optionsSort)
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
    //Create options for filter and sort
    const optionsFilter = {};
    const valueFilter = decodeURI(req.query.valuefilter);
    optionsFilter[req.query.filter] = {[req.query.condition]: req.query.filter==='title'?valueFilter:Number(valueFilter)}
    if(optionsFilter['title']){
        optionsFilter[req.query.filter].$options = "i"
    }
    const optionsSort = {};
    optionsSort[req.query.sort] = Number(req.query.value)
    
    await getPage(req,res, optionsFilter, optionsSort)
});

app.listen(PORT, () => console.log(`App is running on port: ${PORT}`));	
