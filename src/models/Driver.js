// models/Driver.js
const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]{10}$/,
    },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    points: { type: Number, default: 0 },

    // Additional fields typically used in your UI:
    vehicleNumber: { type: String },
    licenseNumber: { type: String },
    totalTrips: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Driver", driverSchema);
