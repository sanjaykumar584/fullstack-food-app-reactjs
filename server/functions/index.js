// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

const functions = require("firebase-functions");
const admin = require("firebase-admin");
require("dotenv").config();

const serviceAccountKey = require("./serviceAccountKey.json");

const express = require("express");
const app = express();

// Body Parser for JSON data
app.use(express.json());

// Cross Orgin
const cors = require("cors");
app.use(cors({origin: true}));
app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
  
    next();
  });

// Firebase Credentials
admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey)
});

// Api endpoint
app.get("/", (req, res) => {
    return res.send("Hello World");
});

const userRoute = require("./routes/user");
app.use("/api/users", userRoute);

const productsRoute = require("./routes/products");
app.use("/api/products", productsRoute);

exports.app = functions.https.onRequest(app);
