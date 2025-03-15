// src/app.js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Route Imports
const detailsRoutes = require("./routes/detailsRoutes");
const tripRoutes = require("./routes/tripRoutes");

// Mount Routes
app.use("/api/details", detailsRoutes);
app.use("/api/trips", tripRoutes);

module.exports = app;
