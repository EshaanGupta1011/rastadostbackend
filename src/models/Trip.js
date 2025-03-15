const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
    {
        source: { type: String, required: true },
        destination: { type: String, required: true },
        distance: { type: Number, required: true }, // in km
        OTP: { type: Number, required: true, min: 1000, max: 9999 }, // 4-digit OTP
        endingUser: { type: Boolean, default: false },
        endingDriver: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);
