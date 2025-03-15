// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Routes
const tripRoutes = require("./routes/tripRoutes");
const detailsRoutes = require("./routes/detailsRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB (Update the URI to yours)
mongoose
  .connect(
    "mongodb+srv://eshaangupta33:7Hq2Y66cIoLiMlVs@rasta.r2shg.mongodb.net/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Use routes
app.use("/api/trips", tripRoutes);
app.use("/api/details", detailsRoutes);

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
