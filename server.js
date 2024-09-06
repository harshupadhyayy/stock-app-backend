const express = require("express");
const axios = require("axios");
const parser = require("body-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

app.use(parser.json());
const finnhub_api_key = process.env.FINNHUB_API;
const polygon_api_key = process.env.POLYGON_API;
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectDb() {
  await client.connect()
  console.log("connected to mongodb");
};

connectDb();


app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/api/v1/stock/profile2", async (req, res) => {
  const { symbol } = req.query;
  const url = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${finnhub_api_key}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    res.send(data);
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
});

app.get("/api/v1/stock/summary-chart", async (req, res) => {
  const { symbol, from, to } = req.query;
  const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/hour/${from}/${to}?adjusted=true&sort=asc&apiKey=${polygon_api_key}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    res.send(data);
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
});

app.get("/api/v1/stock/chart", async (req, res) => {
  const { symbol, from, to } = req.query;
  const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${from}/${to}?adjusted=true&sort=asc&apiKey=${polygon_api_key}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    res.send(data);
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
});

app.get("/api/v1/quote", async (req, res) => {
  const { symbol } = req.query;
  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${finnhub_api_key}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    res.send(data);
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
});

app.get("/api/v1/search", async (req, res) => {
  const { q } = req.query;
  const url = `https://finnhub.io/api/v1/search?q=${q}&token=${finnhub_api_key}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    res.send(data);
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
});

app.get("/api/v1/company-news", async (req, res) => {
  const { symbol, from, to } = req.query;

  const url = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${finnhub_api_key}`;
  console.log(url);
  try {
    const response = await axios.get(url);
    const data = response.data;
    const newsData = data
    .filter(
      (item) =>
        item.image && item.url && item.headline && item.datetime !== undefined
    )
    .slice(0, 20);

    res.send(newsData);

  } catch (error) {
    res.status(500).send("Error fetching data");
  }
});

app.get("/api/v1/stock/recommendation", async (req, res) => {
  const { symbol } = req.query;
  const url = `https://finnhub.io/api/v1/stock/recommendation?symbol=${symbol}&token=${finnhub_api_key}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    res.send(data);
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
});

app.get("/api/v1/stock/insider-sentiment", async (req, res) => {
  const { symbol } = req.query;
  const url = `https://finnhub.io/api/v1/stock/insider-sentiment?symbol=${symbol}&from=2022-01-01&token=${finnhub_api_key}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    res.send(data);
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
});

app.get("/api/v1/stock/peers", async (req, res) => {
  const { symbol } = req.query;
  const url = `https://finnhub.io/api/v1/stock/peers?symbol=${symbol}&token=${finnhub_api_key}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    res.send(data);
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
});

app.get("/api/v1/stock/earnings", async (req, res) => {
  const { symbol } = req.query;
  const url = `https://finnhub.io/api/v1/stock/earnings?symbol=${symbol}&token=${finnhub_api_key}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    res.send(data);
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
});

app.get("/api/v1/stock/market-status", async (req, res) => {
  const url = `https://finnhub.io/api/v1/stock/market-status?exchange=US&token=${finnhub_api_key}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    res.send(data);
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
});

app.get("/api/v1/fetch-watchlist", async (req, res) => {
  try {
    // await client.connect();
    const db = await client.db("stock_app");
    const collection = db.collection("watchlist");

    const data = await collection.find({}).toArray();

    res.send(data);
  } catch (error) {
    console.error("Error fetching data from MongoDB:", error);
    res.status(500).send("Internal Server Error");
  } finally {
    // await client.close();
  }
});

app.get("/api/v1/find-symbol-watchlist", async (req, res) => {
  const { symbol } = req.query;
  try {
    // await client.connect();
    const db = await client.db("stock_app");
    const collection = db.collection("watchlist");

    const data = await collection.findOne({ symbol: symbol });

    if (data) {
      res.send(true);
    } else {
      res.send(false);
    }
  } catch (error) {
    console.error("Error fetching data from MongoDB:", error);
    res.status(500).send("Internal Server Error");
  } finally {
    // await client.close();
  }
});


app.delete("/api/v1/delete-symbol-watchlist", async (req, res) => {
  const { symbol } = req.query;
  try {
    // await client.connect();
    const db = await client.db("stock_app");
    const collection = db.collection("watchlist");

    const result = await collection.deleteOne({ symbol: symbol });

    if (result.acknowledged) {
      res.send(true);
    } else {
      res.send(false);
    }
  } catch (error) {
    console.error("Error fetching data from MongoDB:", error);
    res.status(500).send("Internal Server Error");
  } finally {
    // await client.close();
  }
});

app.post("/api/v1/save-watchlist", async (req, res) => {
  const { symbol, name } = req.body;
  const obj = {
    symbol: symbol,
    name: name,
  };
  try {
    // await client.connect();
    const db = await client.db("stock_app");
    const collection = db.collection("watchlist");

    const data = await collection.insertOne(obj);
    res.send("object saved");
  } catch (error) {
    console.error("Error saving data from MongoDB:", error);
    res.status(500).send("Internal Server Error");
  } finally {
    // await client.close();
  }
});

app.get("/api/v1/fetch-portfolio", async (req, res) => {
  try {
    // await client.connect();
    const db = await client.db("stock_app");
    const collection = db.collection("portfolio");

    const data = await collection.find({}).toArray();

    res.send(data);
  } catch (error) {
    console.error("Error fetching data from MongoDB:", error);
    res.status(500).send("Internal Server Error");
  } finally {
    // await client.close();
  }
});

app.get("/api/v1/find-symbol-portfolio", async (req, res) => {
  const { symbol } = req.query;
  try {
    // await client.connect();
    const db = await client.db("stock_app");
    const collection = db.collection("portfolio");

    const data = await collection.findOne({ symbol: symbol });

    console.log(data);

    if (data) {
      res.send(data);
    } else {
      res.send(false);
    }
  } catch (error) {
    console.error("Error fetching data from MongoDB:", error);
    res.status(500).send("Internal Server Error");
  } finally {
    // await client.close();
  }
});

app.post("/api/v1/buy-symbol", async (req, res) => {
  const { symbol, totalPrice, quantity, name } = req.body;
  const obj = {
    symbol: symbol,
    name: name,
    totalPrice: totalPrice,
    quantity: quantity,
  };

  try {
    // await client.connect();
    const db = await client.db("stock_app");
    const collection = db.collection("portfolio");

    const data = await collection.insertOne(obj);
    res.send("object saved");
  } catch (error) {
    console.error("Error saving data from MongoDB:", error);
    res.status(500).send("Internal Server Error");
  } finally {
    // await client.close();
  }
});

app.put("/api/v1/buy-symbol-update", async (req, res) => {
  const { symbol, totalPrice, quantity, name } = req.body;
  const obj = {
    symbol: symbol,
    name: name,
    totalPrice: totalPrice,
    quantity: quantity,
  };

  try {
    // await client.connect();
    const db = await client.db("stock_app");
    const collection = db.collection("portfolio");

    // const data = await collection.insertOne(obj);
    const updateObj = await collection.findOneAndUpdate(
      { symbol: symbol },
      { $set: obj }
    );
    res.send("object saved");
  } catch (error) {
    console.error("Error saving data from MongoDB:", error);
    res.status(500).send("Internal Server Error");
  } finally {
    // await client.close();
  }
});

app.delete("/api/v1/symbol-delete", async (req, res) => {
  const { symbol } = req.query;
  console.log("symbol is in deelete", req.body);
  try {
    // await client.connect();
    const db = await client.db("stock_app");
    const collection = db.collection("portfolio");

    // const data = await collection.insertOne(obj);
    const response = await collection.deleteOne({ symbol: symbol });
    if (response.acknowledged) {
      res.send(true);
    } else {
      res.send(false);
    }
  } catch (error) {
    console.error("Error saving data from MongoDB:", error);
    res.status(500).send("Internal Server Error");
  } finally {
    // await client.close();
  }
});

app.get("/api/v1/fetch-wallet", async (req, res) => {
  try {
    // await client.connect();
    const db = await client.db("stock_app");
    const collection = db.collection("wallet");

    const data = await collection.findOne({});

    console.log(data);

    res.send(data);
    // console.log("tjhis is called first");
  } catch (error) {
    console.error("Error fetching data from MongoDB:", error);
    res.status(500).send("Internal Server Error");
  } finally {
    console.log("finally is called asap");
    // await client.close();
  }
});


app.post("/api/v1/update-wallet", async (req, res) => {
  const { amount } = req.body;
  try {
    // await client.connect();
    const db = await client.db("stock_app");
    const collection = db.collection("wallet");

    const filter = { _id: new ObjectId("65fd112849c39366b678d4d4") };
    const update = { $set: { wallet: amount } };

    const result = await collection.updateOne(filter, update);

    res.send("updated");
  } catch (error) {
    console.error("Error fetching data from MongoDB:", error);
    res.status(500).send("Internal Server Error");
  } finally {
    // await client.close();
  }
});



async function cleanup() {
  try {
    await client.close();
    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
  }
}

process.on('SIGINT', async () => {
  console.log("Received SIGINT signal");
  await cleanup();
  process.exit(0); // Exit the process
});


app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});

app.on('close', async () => {
  console.log("Server is closing");
  await cleanup();
});
