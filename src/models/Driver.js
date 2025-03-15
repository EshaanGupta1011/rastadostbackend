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
    totalEarnings: { type: Number, default: 0 }, // New field for total earnings

    // Additional fields typically used in your UI:
    vehicleNumber: { type: String, default: "DL9IAR3425" },
    licenseNumber: { type: String, default: "24J4KJ2H3" },
    totalTrips: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Driver", driverSchema);
